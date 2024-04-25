import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migration1713322668775 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "63",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "127",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "127",
                    },
                    {
                        name: "birthDate",
                        type: "date",
                        isNullable: true,
                    },
                    {
                        name: "role",
                        type: "varchar",
                        length: "36",
                        default: "'user'",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP()",
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}
