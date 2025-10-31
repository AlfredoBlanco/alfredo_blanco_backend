import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    MailerModule
  ],
})
export class AppModule {}
