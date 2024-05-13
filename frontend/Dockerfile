FROM node:16

WORKDIR /app

COPY package*.json ./

RUN ls -la /app

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]
