import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterBody } from './dto/register-interface.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginBody } from './dto/login-interface.dto';
import { comparePassword, hashPassword } from 'src/utils/password-manager';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,

  ) { }

  async registerUser(userData: RegisterBody) {
    if (!userData.email || !userData.password) {
      throw new BadRequestException('Existen campos faltantes');
    }

    const existingUser = await this.usersService.findUserByEmail(userData.email);

    if (existingUser) {
      throw new BadRequestException('El email ya se encuentra en uso');
    }

    const user = await this.usersService.createUser(userData);

    return user;
  }

  async generateAccessToken(user: User) {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      user,
      token,
    }
  }

  async validateUser(data: LoginBody) {
    const user = await this.usersService.findUserByEmail(data.email);

    if (user?.password && data.password) {
      const match = await comparePassword(data.password, user.password);
      if (match) return user;
    }


  }

  async validateJWT(email: string, id: number) {
    if (id && email) {
      return this.usersService.findUserByEmail(email);
    }
  }

  async recoverPassword(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new BadRequestException('No se encontró un usuario con este email');

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    user.passwordResetToken = token;

    await this.usersService.saveUser(user);
    try {
      await this.mailerService.sendRecoverPassword(user);

      return { success: true };
    } catch (e) {
      console.error('Error al enviar el mail de recuperar contraseña', e);
      throw new InternalServerErrorException('Ha ocurrido un error al enviar el mail');
    }

  }

  async resetPassword(token: string, newPassword: string) {

    if (!newPassword) throw new BadRequestException('La nueva contraseña es requerida');

    const decodedToken = await this.jwtService.decode(token);

    const user = await this.usersService.findUserByEmail(decodedToken.email);

    if (!user || user.passwordResetToken !== token) {
      throw new ForbiddenException('El token es inválido o ya expiró');
    }

    user.password = await hashPassword(newPassword);
    user.passwordResetToken = null;

    try {
      await this.usersService.saveUser(user);

      return { success: true };
    } catch (e) {
      console.error('Error al actualizar contraseña', e);
      throw new InternalServerErrorException('Ha ocurrido un error al actualizar la contraseña');
    }

  }

}
