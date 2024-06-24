import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { UserEntity } from "./entity/user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    private async ensureUserExistsById(id: string) {
        if (!(await this.usersRepository.exists({ where: { id } }))) {
            throw new NotFoundException(`User with id: ${id} does not exist.`);
        }
    }

    public async create({ birthDate, password, ...rest }: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        const user = this.usersRepository.create({
            ...rest,
            birthDate: birthDate ? new Date(birthDate) : null,
            password: hashedPassword,
        });

        return this.usersRepository.save(user);
    }

    public async findAll() {
        return this.usersRepository.find();
    }

    public async findOne(id: string) {
        await this.ensureUserExistsById(id);

        return this.usersRepository.findOneBy({ id });
    }

    public async update(id: string, { birthDate, password, ...rest }: UpdateUserDTO) {
        await this.ensureUserExistsById(id);

        const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

        await this.usersRepository.update(id, {
            ...rest,
            birthDate: birthDate ? new Date(birthDate) : null,
            password: hashedPassword,
        });

        return this.findOne(id);
    }

    public async updatePartial(id: string, { birthDate, password, ...rest }: UpdatePartialUserDTO) {
        await this.ensureUserExistsById(id);

        const handledPassword = password && (await bcrypt.hash(password, bcrypt.genSaltSync()));

        await this.usersRepository.update(id, {
            ...rest,
            birthDate: birthDate && new Date(birthDate),
            password: handledPassword,
        });

        return this.findOne(id);
    }

    public async delete(id: string) {
        await this.ensureUserExistsById(id);

        await this.usersRepository.delete(id);

        return { success: true };
    }
}
