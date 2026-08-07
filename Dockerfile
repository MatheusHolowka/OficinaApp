FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

# Executa o servidor SSR do Angular na porta 4000
CMD ["node", "dist/app/server/server.mjs"]
