import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, ParseFilePipe, Req, UploadedFile, UseGuards, UseInterceptors, Put, Query } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }


  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
        ]
      })
    )
    file: Express.Multer.File
  ) {
    return this.uploadsService.uploadFile(file, req.user);
  }

  @Put('/rename')
  @UseGuards(JwtAuthGuard)
  renameFile(
    @Req() req,
    @Body() body: { filename: string, newFilename: string }
  ) {
    return this.uploadsService.renameFile(body.filename, body.newFilename, req.user);
  }

  @Post('/external')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadExternalfile(
    @Req() req,
    @Body() body: { url: string, name: string }
  ) {
    return this.uploadsService.uploadExternalFile(body.url, body.name, req.user);
  }

}
