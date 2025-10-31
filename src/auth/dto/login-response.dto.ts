import { User } from "src/users/entities/user.entity";

export class LoginResponse {
    user: User;
    token: string;
}