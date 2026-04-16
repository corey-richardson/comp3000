FROM node:20-alpine AS common
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# DEV
FROM common AS development
COPY . .
CMD ["npm", "run", "dev"]

# BUILD
FROM common AS build-step
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build-step /app/dist ./dist
COPY --from=build-step /app/node_modules ./node_modules
COPY --from=build-step /app/package*.json ./
COPY --from=build-step /app/prisma ./prisma/

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
