import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDTO) {
        return this.prisma.user.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async ensureUserExists(id: number) {
        if (!(await this.findOne(id))) {
            throw new NotFoundException(`User with id: ${id} does not exist.`);
        }
    }

    async update(id: number, { birthDate, ...rest }: UpdateUserDTO) {
        await this.ensureUserExists(id);

        return this.prisma.user.update({
            where: { id },
            data: {
                ...rest,
                birthDate: birthDate ? new Date(birthDate) : null,
            },
        });
    }

    async updatePartial(id: number, { birthDate, ...rest }: UpdatePartialUserDTO) {
        await this.ensureUserExists(id);

        return this.prisma.user.update({
            where: { id },
            data: {
                ...rest,
                birthDate: birthDate && new Date(birthDate),
            },
        });
    }

    async delete(id: number) {
        await this.ensureUserExists(id);

        return this.prisma.user.delete({
            where: { id },
        });
    }
}
