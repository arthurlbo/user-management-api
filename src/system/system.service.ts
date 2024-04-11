import { PassThrough } from "node:stream";
import { createWriteStream, existsSync, unlinkSync } from "node:fs";

import { Injectable } from "@nestjs/common";

@Injectable()
export class SystemService {
    deleteExistingFile(path: string, acceptableFileExtensions: string[]): void {
        const fileNameWithoutExtension = path.split(".")[0];

        acceptableFileExtensions.some((extension) => {
            const filePath = `${fileNameWithoutExtension}.${extension}`;
            if (existsSync(filePath)) {
                unlinkSync(filePath);
                return true;
            }
            return false;
        });
    }

    createFile(path: string, file: Express.Multer.File): Promise<void> {
        return new Promise((resolve, reject) => {
            const readStream = new PassThrough();
            readStream.end(file.buffer);

            const writeStream = createWriteStream(path);

            readStream.pipe(writeStream).on("finish", resolve).on("error", reject);
        });
    }
}
