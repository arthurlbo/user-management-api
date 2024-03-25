import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Controller("users")
export class UserController {
    @Post()
    async create(@Body() { email, name, password }: CreateUserDTO) {
        return { email, name, password };
    }

    @Get()
    async findAll() {
        return [];
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return { id };
    }

    @Put(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() { email, name, password }: UpdateUserDTO) {
        return {
            id,
            name,
            email,
            password,
        };
    }

    @Patch(":id")
    async updatePartial(
        @Param("id", ParseIntPipe) id: number,
        @Body() { email, name, password }: UpdatePartialUserDTO,
    ) {
        return {
            id,
            name,
            email,
            password,
        };
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        return {
            id,
        };
    }
}
