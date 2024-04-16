import { PartialType } from "@nestjs/mapped-types";

import { AuthRegisterDTO } from "./auth-register.dto";

export class AuthUpdatePartialDTO extends PartialType(AuthRegisterDTO) {}
