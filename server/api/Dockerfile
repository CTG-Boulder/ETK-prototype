FROM node:12.16-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn cache clean
RUN yarn install
COPY . /app
EXPOSE 80
CMD ["yarn", "start"]
