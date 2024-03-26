import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from "@nestjs/common";

import { UserService } from "./user.service";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateUserDTO) {
        return this.userService.update(id, data);
    }

    @Patch(":id")
    async updatePartial(@Param("id", ParseIntPipe) id: number, @Body() data: UpdatePartialUserDTO) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}
