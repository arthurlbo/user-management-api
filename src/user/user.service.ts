import { Injectable, NotFoundException } from "@nestjs/common";

import * as bcrypt from "bcrypt";

import { PrismaService } from "@/prisma/prisma.service";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async ensureUserExists(id: string) {
        if (!(await this.prisma.user.count({ where: { id } }))) {
            throw new NotFoundException(`User with id: ${id} does not exist.`);
        }
    }

    async create({ birthDate, password, ...rest }: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        return this.prisma.user.create({
            data: {
                ...rest,
                birthDate: birthDate ? new Date(birthDate) : null,
                password: hashedPassword,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: string) {
        await this.ensureUserExists(id);

        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, { birthDate, password, ...rest }: UpdateUserDTO) {
        await this.ensureUserExists(id);

        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        return this.prisma.user.update({
            where: { id },
            data: {
                ...rest,
                birthDate: birthDate ? new Date(birthDate) : null,
                password: hashedPassword,
            },
        });
    }

    async updatePartial(id: string, { birthDate, password, ...rest }: UpdatePartialUserDTO) {
        await this.ensureUserExists(id);

        const handledPassword = password && (await bcrypt.hash(password, bcrypt.genSaltSync()));

        return this.prisma.user.update({
            where: { id },
            data: {
                ...rest,
                birthDate: birthDate && new Date(birthDate),
                password: handledPassword,
            },
        });
    }

    async delete(id: string) {
        await this.ensureUserExists(id);

        return this.prisma.user.delete({
            where: { id },
        });
    }
}
