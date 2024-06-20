FROM node:iron-alpine

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json .

# Copy pnpm-lock.yaml
COPY pnpm-lock.yaml .

# Install app dependencies
RUN pnpm install

# Copy .env
COPY .env.production .env.production

# Copy prisma directory
COPY ./prisma ./prisma

# Bundle dist
COPY ./dist ./dist

# Run prisma generate
RUN pnpm p-gen

CMD ["sh", "-c", "pnpm prod-p-mg; pnpm prod-p-seed; pnpm prod:start"]

