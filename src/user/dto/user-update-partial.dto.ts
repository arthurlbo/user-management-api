import { PartialType } from "@nestjs/mapped-types";

import { UserCreateDTO } from "./user-create.dto";

export class UserUpdatePartialDTO extends PartialType(UserCreateDTO) {}
