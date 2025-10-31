import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { User } from "src/users/entities/user.entity";
import { LoginBody } from "../dto/login-interface.dto";

@Injectable()
export class UserLocalStrategy extends PassportStrategy(
    Strategy,
    'user-local',
) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        })
    }

    async validate(email: string, password: string): Promise<User> {
        if (email && password) {
            const credentials: LoginBody = { email, password };
            const user = await this.authService.validateUser(credentials);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}