FROM node:16

WORKDIR /app

COPY /backend/package*.json /app

RUN ls -la /app

RUN npm install

COPY /backend/* /app


EXPOSE 3000

CMD ["node", "src/index.js"]
