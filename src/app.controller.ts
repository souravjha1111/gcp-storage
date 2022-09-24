import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multerGoogleStorage from 'multer-google-storage'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('gcpFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerGoogleStorage.storageEngine({
        projectId:'skydoc-360314',
        keyFilename:'',
        bucket:'',
        // destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleGcpUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'File upload API';
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'File upload API';
  }

}
