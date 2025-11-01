import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CopyObjectCommand, CreateBucketCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, RenameObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT } from 'src/config/global-vars';
import { createWriteStream } from 'fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
    private readonly s3Client = new S3Client({
        region: AWS_REGION,
        endpoint: S3_ENDPOINT,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true
    })

    async onModuleInit() {
        await this.createBucket();
    }

    async createBucket() {
        try {
            await this.s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
            console.log(`Bucket ${S3_BUCKET} creado ✅`);
        } catch (err: any) {
            if (err.name === 'BucketAlreadyOwnedByYou') {
                console.log(`Bucket ${S3_BUCKET} ya existe`);
            } else {
                throw err;
            }
        }
    }

    async checkIfObjectExists(filename: string) {
        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: filename,
                })
            )
            return true;
        } catch (e) {
            return false;
        }
    }

    async uploadToAws(filename: string, file: Buffer) {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: filename,
                    Body: file,
                    IfNoneMatch: "*",
                })
            );
            return { success: true };
        } catch (e) {
            console.error('Error al subir el archivo a S3', e);
            if (e['$response']?.statusCode === 412) {
                throw new BadRequestException('Ya existe un archivo con este nombre');
            }
            throw new InternalServerErrorException('Ha ocurrido un error al subir el archivo');
        }
    }

    async downloadFromAws(filename: string, path: string) {
        if (!path) {
            throw new BadRequestException('Se debe especificar la ruta de destino');
        }

        const data = await this.s3Client.send(
            new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: filename,
            })
        );

        if (!data.Body) {
            throw new NotFoundException('No se encontró el archivo');
        }

        try {
            let pathName = path;
            if (!pathName.endsWith('/')) {
                pathName = `${pathName}/`;
            }

            await (data.Body as NodeJS.ReadableStream).pipe(createWriteStream(`${pathName}${filename}`));

            return { success: true }
        } catch (e) {
            console.error('Error al descargar archivo desde AWS', e);
            throw new NotFoundException('Error al descargar archivo');
        }
    }

    async deleteFileFromAws(filename: string) {
        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: filename,
            })
        )
    }

    async renameFile(filename: string, newFilename: string) {
        if (await this.checkIfObjectExists(newFilename)) {
            throw new BadRequestException('Ya existe un archivo con el nuevo nombre');
        }
        try {
            await this.s3Client.send(
                new CopyObjectCommand({
                    Bucket: S3_BUCKET,
                    CopySource: `/${S3_BUCKET}/${filename}`,
                    Key: newFilename
                })
            )
        } catch (e) {
            console.error('Error al actualizar el nombre', e);
            if (e['$response']?.statusCode === 412) {
                throw new BadRequestException('Ya existe un archivo con el nuevo nombre');
            }
            throw new InternalServerErrorException('Ha ocurrido un error al actualizar el nombre');
        }
        try {
            await this.deleteFileFromAws(filename);
        } catch (e) {
            console.error('Error al eliminar archivo de AWS', e);
        }
        return { succes: true };
    }

    async getPublicUrl(filename: string) {
        const command = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: filename,
        });
        try {

            const url = await getSignedUrl(this.s3Client, command);
            return { url }
        } catch (e) {
            console.error('Error al obtener la url pública', e);
            throw new InternalServerErrorException('Error al obtener la url')
        }
    }
}

