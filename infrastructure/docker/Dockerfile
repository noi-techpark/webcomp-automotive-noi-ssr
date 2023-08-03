FROM node:16-alpine3.18

COPY . .

RUN yarn install && yarn build

ENTRYPOINT ["npx", "nuxt", "start"]
EXPOSE 3000
