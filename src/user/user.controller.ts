import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from "@nestjs/common";

import { Role } from "@/enums/role.enum";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { Roles } from "@/decorators/roles.decorator";

import { UserService } from "./user.service";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UpdatePartialUserDTO } from "./dto/update-partial-user.dto";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
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
    async findOne(@Param("id", ParseUUIDPipe) id: string) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() data: UpdateUserDTO) {
        return this.userService.update(id, data);
    }

    @Patch(":id")
    async updatePartial(@Param("id", ParseUUIDPipe) id: string, @Body() data: UpdatePartialUserDTO) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(":id")
    async delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.userService.delete(id);
    }
}
