import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterBody } from 'src/auth/interfaces/register-interface';
import { hashPassword } from 'src/utils/password-manager';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async findUserByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }

    async createUser(userData: RegisterBody) {
        const user = new User;

        user.email = userData.email;
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;

        const hashedPassword = await hashPassword(userData.password);
        user.password = hashedPassword;

        try {

            await this.userRepository.insert(user);
            return user;

        } catch (e) {
            console.log('Ha ocurrido un error al generar usuario', e);
            throw new InternalServerErrorException('Ha ocurrido un error');
        }

    }

    async getAllUsers(user: User) {
        console.log(user);
        return await this.userRepository.find();
    }
}
