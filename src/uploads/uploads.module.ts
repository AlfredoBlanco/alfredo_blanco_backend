import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { AwsModule } from 'src/aws/aws.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    AwsModule
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule { }
