### Hi there! 👋

> The User Management API is designed to provide robust user authentication and management functionalities. This API enables users to perform essential operations such as registration, login, password recovery, etc. Additionally, it includes an admin-only CRUD for managing user accounts.
>
> The primary goal of this project was to enhance backend development skills by implementing a comprehensive user management system. This includes sophisticated authentication mechanisms and administrative capabilities to manage users effectively. The combination of NestJS, Docker, Prisma and PostgreSQL ensures a modern, scalable, and maintainable solution.
>
> Also there is a branch using TypeORM and MySQL instead Prisma and PostgreSQL, just for learning purposes. you can check it out [here](https://github.com/arthurlbo/user-management-api/tree/type-orm).

## Tech Stack

- [NestJS](https://nestjs.com/)
- [NodeJS](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://github.com/nestjs/jwt)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [class-validator](https://www.npmjs.com/package/class-validator)
- [class-transformer](https://www.npmjs.com/package/class-transformer)
- [zod](https://www.npmjs.com/package/zod)
- [NestJS Mailer](https://www.npmjs.com/package/@nestjs-modules/mailer)
- [pug](https://pugjs.org/api/getting-started.html)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)
- [dotenv-cli](https://www.npmjs.com/package/dotenv-cli)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Husky](https://github.com/typicode/husky)
- [Commitlint](https://commitlint.js.org/#/)

## Key Features

**User Authentication**

- Registration
- Login
- Avatar Upload
- Update Completely
- Update Partially
- Password Recovery

**Admin CRUD**

- Register User
- Read All Users
- Read User
- Update User Completely
- Update User Partially
- Delete User

## Getting Started

> **Make sure you have [Docker](https://www.docker.com/) installed on your machine.**

```bash
# Run database container
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
pnpm install

# Apply migration and generate prisma client
pnpm p-mg

# Start the development server
pnpm dev
```

API will be running  on `http://localhost:3000`

## Structure

```folder
├── .husky
└── .vscode
└── prisma
└── src
    ├── auth
    ├── common
    ├── decorators
    ├── env
    ├── file
    ├── guards
    ├── interceptors
    ├── prisma
    ├── system
    ├── templates
    ├── test
    ├── user
```

| Folder             | Description                                        |
| :------------------ | :-------------------------------------------------- |
| **.husky**         | Git hooks managed by Husky.                        |
| **.vscode**        | VSCode settings .                                  |
| **prisma**         | Prisma config such as schema, migrations and seed. |
| **auth**           | Auth related files to manage user authentication.  |
| **common**         | Reusable utilities and constants.                  |
| **decorators**     | Custom decorators.                                 |
| **env**            | Env related files to manage environment variables. |
| **file**           | File related files to manage file operations.      |
| **guards**         | Custom guards.                                     |
| **interceptors**   | Custom interceptors.                               |
| **prisma**         | Prisma service to interact with the database.      |
| **system**         | System related files to manage system operations.  |
| **templates**      | Email templates.                                   |
| **test**           | Test related files.                                |
| **user**           | User related files to manage user operations.      |

## Custom Commands

```bash

# Run all tests
pnpm test:all

# Run prisma generate
pnpm p-gen

# Run prisma migrate
pnpm p-mg

# Run prisma migrate reset
pnpm p-mg-reset

# Run prisma seed
pnpm p-seed

# Set environment to production
pnpm env:prod

# Set environment to development
pnpm env:dev

# Set environment to test
pnpm env:test

# Run prisma migrate in production environment
pnpm p-mg:prod

# Run prisma migrate in development environment
pnpm p-mg:dev

# Run prisma migrate in test environment
pnpm p-mg:test

# Run prisma migrate reset in development environment
pnpm p-mg-reset:dev

# Run prisma migrate reset in test environment
pnpm p-mg-reset:test

# Run prisma seed in production environment
pnpm p-seed:prod

# Run prisma seed in development environment
pnpm p-seed:dev

# Run prisma seed in test environment
pnpm p-seed:test

# Commit staged changes
pnpm commit

```

<p align="center">Made with 🤍 by Arthur</p>
