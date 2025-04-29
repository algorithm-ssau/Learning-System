FROM node:18-alpine
WORKDIR /app
RUN npm install -g @angular/cli
COPY package.json package-lock.json ./
RUN npm install
EXPOSE 4200