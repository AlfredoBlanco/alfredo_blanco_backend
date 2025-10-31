import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterBody } from './interfaces/register-interface';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginBody } from './interfaces/login-interface';
import { comparePassword } from 'src/utils/password-manager';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
    const payload = { email: user.email, sub: user._id};
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      user,
      token,
    }
  }

  async validateUser(data: LoginBody) {
    const user = await this.usersService.findUserByEmail(data.email);

    if(user?.password && data.password) {
      const match = await comparePassword(data.password, user.password);
      if(match) return user;
    }


  }

  async validateJWT(email: string, id: number) {
    if(id && email) {
      return this.usersService.findUserByEmail(email);
    }
  }
}
