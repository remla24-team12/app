FROM node:16

WORKDIR /app

COPY package*.json /app

RUN ls -la /app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
