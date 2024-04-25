import { PartialType } from "@nestjs/mapped-types";

import { RegisterAuthDTO } from "./register-auth.dto";

export class UpdatePartialAuthDTO extends PartialType(RegisterAuthDTO) {}
