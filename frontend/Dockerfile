FROM node:16

WORKDIR /app

COPY package*.json /app

RUN ls -la /app

RUN npm install

COPY . /app

ENV VUE_APP_API_URL=http://localhost:8080

EXPOSE 8080

CMD ["npm", "run", "serve"]
