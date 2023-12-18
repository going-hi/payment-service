import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import { access, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
    async uploadFile(file: Express.Multer.File): Promise<string> {
        const type = file.mimetype.split('/')[1];

        const filename = randomUUID() + '.' + type;
        const uploadFolder = join(__dirname, '..', '../static');
        const isDir = await this.exists(uploadFolder);
        if (!isDir) await mkdir(uploadFolder, { recursive: true });

        await writeFile(join(uploadFolder, filename), file.buffer);
        return filename;
    }

    async deleteFile(filename: string): Promise<void> {
        const pathFile = join(__dirname, '..', '../static', filename);
        await unlink(pathFile);
    }

    async exists(path: string): Promise<boolean> {
        try {
            await access(path);
            return true;
        } catch (e) {
            return false;
        }
    }
}
