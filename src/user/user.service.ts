import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create({ birthDate, ...rest }: CreateUserDTO) {
        return this.prisma.user.create({
            data: {
                ...rest,
                birthDate: birthDate ? new Date(birthDate) : null,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async ensureUserExists(id: string) {
        if (!(await this.prisma.user.count({ where: { id } }))) {
            throw new NotFoundException(`User with id: ${id} does not exist.`);
        }
    }

    async findOne(id: string) {
        await this.ensureUserExists(id);

        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, { birthDate, ...rest }: UpdateUserDTO) {
        await this.ensureUserExists(id);

        return this.prisma.user.update({
            where: { id },
            data: {
                ...rest,
                birthDate: birthDate ? new Date(birthDate) : null,
            },
        });
    }

    async updatePartial(id: string, { birthDate, ...rest }: UpdatePartialUserDTO) {
        await this.ensureUserExists(id);

        return this.prisma.user.update({
            where: { id },
            data: {
                ...rest,
                birthDate: birthDate && new Date(birthDate),
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
