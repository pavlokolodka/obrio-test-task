FROM node:20-alpine
WORKDIR /app
COPY ./user-service/package*.json ./
RUN npm install
COPY ./user-service .
RUN npm run build
CMD ["node", "dist/main"]
