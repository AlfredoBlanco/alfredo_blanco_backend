import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadsService {

  constructor(
    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
    private readonly awsService: AwsService,
  ) { }

  async getAnUpload(name: string) {
    return await this.uploadsRepository.findOne({
      where: { filename: name },
      relations: ['user'],
    })
  }

  async checkValidExternalUrl(url: string) {
    const res = await fetch(url, { method: 'HEAD' });

    if (!res.ok) {
      return false;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return false;
    }
    return true;
  }

  async getBufferFromUrl(url: string) {
    const res = await fetch(url);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer;

  }

  async createUpload(name: string, user: User) {
    const upload = new Upload();

    upload.filename = name;
    upload.user = user;

    await this.uploadsRepository.insert(upload);
    return upload;
  }

  async uploadFile(file: Express.Multer.File, user: User) {
    if (!user) throw new BadRequestException('Acceso denegado');

    const res = await this.awsService.uploadToAws(file.originalname, file.buffer);

    if (res.success) {
      const upload = await this.createUpload(file.originalname, user);

      return upload;
    }
  }

  async uploadExternalFile(url: string, name: string, user: User) {

    if (!user) throw new BadRequestException('Acceso denegado');
    if (!url || !name) throw new BadRequestException('Campos faltantes');

    if(!await this.checkValidExternalUrl(url)) {
      throw new BadRequestException('Url inválida');
    }

    const buffer = await this.getBufferFromUrl(url);

    if(!buffer) {
      throw new InternalServerErrorException('Error al obtener archivo');
    }
    
    const res = await this.awsService.uploadToAws(name, buffer);

    if (res.success) {
      const upload = await this.createUpload(name, user);

      return upload;
    }
  }

  async renameFile(filename: string, newFilename: string, user: User) {
    if (!filename || !newFilename) {
      throw new BadRequestException('Campos faltantes');
    }

    const upload = await this.getAnUpload(filename);


    if (upload?.user?.uuid !== user.uuid) {
      throw new BadRequestException('Solo puedes editar archivos que hayas subido');
    }

    await this.awsService.renameFile(filename, newFilename);

    upload.filename = newFilename;
    try {
      await this.uploadsRepository.save(upload);
    } catch (e) {
      console.error('Error al actualizar upload', e);
    }
    return upload;
  }
}
