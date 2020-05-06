FROM node:12.16-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN yarn cache clean
RUN yarn install
EXPOSE 80
CMD ["yarn", "start"]
