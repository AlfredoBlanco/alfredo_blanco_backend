import { Injectable } from '@nestjs/common';
import { MailerService as MailService } from '@nestjs-modules/mailer';
import { User } from 'src/users/entities/user.entity';
import { APP_URL } from 'src/config/global-vars';

@Injectable()
export class MailerService {
    constructor(
        private readonly mailerService: MailService,
    ) { }

    async sendRecoverPassword(user: User) {
        const resetLink = `${APP_URL}/?reset_token=${user.passwordResetToken}`;

        await this.mailerService.sendMail({
            to: 'alfre.blanco12@gmail.com',
            subject: 'Recupero de contraseña',
            template: './password-recover.ejs',
            context: {
                name: user.firstName,
                resetLink,
            }
        })
    }
}
