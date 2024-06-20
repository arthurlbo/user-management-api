import { Request } from "express";
import { BadRequestException, Injectable } from "@nestjs/common";

import { SystemService } from "@/system/system.service";

type FileUrl = { fileUrl: string };

@Injectable()
export class FileService {
    constructor(private readonly systemService: SystemService) {}

    private generateFileUrl(req: Request, path: string): FileUrl {
        const fullUrl = req.protocol.concat("://").concat(req.hostname);
        const fileUrl = new URL(path, fullUrl).toString();

        return { fileUrl };
    }

    public async upload(
        req: Request,
        file: Express.Multer.File,
        path: string,
        acceptableFileExtensions: string[] = ["png", "jpg", "jpeg", "webp", "svg"],
    ): Promise<FileUrl> {
        try {
            this.systemService.deleteExistingFile(path, acceptableFileExtensions);
            await this.systemService.createFile(path, file);
            return this.generateFileUrl(req, path);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
