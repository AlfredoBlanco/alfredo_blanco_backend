import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterBody } from './interfaces/register-interface';
import { UserLocalStrategy } from './strategies/user-local.strategy';
import { UserAuthGuard } from './guards/user-auth.guard';
import { LoginResponse } from './interfaces/login-response';

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
}
