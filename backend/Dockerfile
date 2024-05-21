FROM node:16

WORKDIR /app

COPY package*.json /app/
COPY .npmrc /app/

RUN ls -la /app

RUN npm install

COPY . /app/


EXPOSE 3000

CMD ["node", "src/index.js"]
