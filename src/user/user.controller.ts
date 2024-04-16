import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";

import { Role } from "@/enums/role.enum";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { Roles } from "@/decorators/roles.decorator";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { UserService } from "./user.service";

import { UserCreateDTO } from "./dto/user-create.dto";
import { UserUpdateDTO } from "./dto/user-update.dto";
import { UserUpdatePartialDTO } from "./dto/user-update-partial.dto";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(EmailInterceptor)
    async create(@Body() data: UserCreateDTO) {
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
    @UseInterceptors(EmailInterceptor)
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() data: UserUpdateDTO) {
        return this.userService.update(id, data);
    }

    @Patch(":id")
    @UseInterceptors(EmailInterceptor)
    async updatePartial(@Param("id", ParseUUIDPipe) id: string, @Body() data: UserUpdatePartialDTO) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(":id")
    async delete(@Param("id", ParseUUIDPipe) id: string) {
        return this.userService.delete(id);
    }
}
