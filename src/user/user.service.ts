import { Injectable, NotFoundException } from "@nestjs/common";

import * as bcrypt from "bcrypt";

import { PrismaService } from "@/prisma/prisma.service";

import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { UserUpdatePartialDTO } from "./dto/user-update-partial.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    private async ensureUserExistsById(id: string) {
        if (!(await this.prisma.user.count({ where: { id } }))) {
            throw new NotFoundException(`User with id: ${id} does not exist.`);
        }
    }

    public async create({ birthDate, password, ...rest }: UserCreateDTO) {
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        return this.prisma.user.create({
            data: {
                ...rest,
                birthDate: birthDate ? new Date(birthDate) : null,
                password: hashedPassword,
            },
        });
    }

    public async findAll() {
        return this.prisma.user.findMany();
    }

    public async findOne(id: string) {
        await this.ensureUserExistsById(id);

        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    public async update(id: string, { birthDate, password, ...rest }: UserUpdateDTO) {
        await this.ensureUserExistsById(id);

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

    public async updatePartial(id: string, { birthDate, password, ...rest }: UserUpdatePartialDTO) {
        await this.ensureUserExistsById(id);

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

    public async delete(id: string) {
        await this.ensureUserExistsById(id);

        return this.prisma.user.delete({
            where: { id },
        });
    }
}
