FROM node:16

WORKDIR /app

COPY /frontend/package*.json /app

RUN ls -la /app

RUN npm install

COPY /frontend /app

EXPOSE 8080

CMD ["npm", "run", "serve"]
