import { Module } from "@nestjs/common";

import { FileService } from "./file.service";

import { SystemModule } from "@/system/system.module";

@Module({
    imports: [SystemModule],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule {}
