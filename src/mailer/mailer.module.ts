import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SMTP_HOST, SMTP_PASSWORD, SMTP_USER } from 'src/config/global-vars';
import { join } from 'path';

@Module({
  imports: [
    MailModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: SMTP_HOST,
          secure: false,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
          }
        },
        defaults: {
          from: `"No reply" <${SMTP_USER}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          }
        }
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    })
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule { }
