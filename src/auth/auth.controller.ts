import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterBody } from './dto/register-interface.dto';
import { UserAuthGuard } from './guards/user-auth.guard';
import { LoginResponse } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  register(
    @Body() body: RegisterBody,
  ){
    return this.authService.registerUser(body);
  }

  @Post('/login')
  @UseGuards(UserAuthGuard)
  login(@Req() req): Promise<LoginResponse>{
    return this.authService.generateAccessToken(req.user);
  }

  @Post('/recover-password')
  recover(
    @Body() body: { email: string}
  ){
    return this.authService.recoverPassword(body.email);
  }

  @Post('/reset-password')
  reset(
    @Body() body: { reset_token: string, newPassword: string}
  ){
    return this.authService.resetPassword(body.reset_token, body.newPassword);
  }
}
