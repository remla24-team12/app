FROM node:16

WORKDIR /app

COPY /frontend/package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "serve"]
