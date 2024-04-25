import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Role } from "@/enums/role.enum";

@Entity({
    name: "users",
})
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        length: 63,
    })
    name: string;

    @Column({
        length: 127,
        unique: true,
    })
    email: string;

    @Column({
        length: 127,
    })
    password: string;

    @Column({
        type: "date",
        nullable: true,
    })
    birthDate: Date;

    @Column({
        default: Role.User,
    })
    role: Role;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
