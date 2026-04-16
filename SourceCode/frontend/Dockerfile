FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PROD
FROM nginx:stable-alpine AS production
# copy static files to be served
COPY --from=build-stage /app/build /usr/share/nginx/html 

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
