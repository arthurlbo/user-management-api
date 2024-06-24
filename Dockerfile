FROM node:20 AS build

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy necessary files for installing dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN pnpm p-gen

# Build the project
RUN pnpm run build

# Start a new, final image to reduce size
FROM node:20-alpine3.20

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy the dist folder from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy the prisma folder from the build stage
COPY --from=build /usr/src/app/prisma ./prisma

# Copy the package.json folder from the build stage
COPY --from=build /usr/src/app/package.json ./package.json

# Copy the node_modules folder from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy .env.production file from the build stage
COPY --from=build /usr/src/app/.env.production ./.env.production

CMD ["sh", "-c", "pnpm p-gen; pnpm p-mg:prod; pnpm p-seed:prod; pnpm prod:start"]

