import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AwsService } from './aws.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) { }

  @Post('/download')
  @UseGuards(JwtAuthGuard)
  dowloadFile(
    @Body() body: { filename: string, path: string },
  ) {
    return this.awsService.downloadFromAws(body.filename, body.path);
  }

  @Get('/:filename/public')
  @UseGuards(JwtAuthGuard)
  getPublicUrl(
    @Param('filename') filename: string,
  ) {
    return this.awsService.getPublicUrl(filename);
  }
}
