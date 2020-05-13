FROM node:14

# Install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain stable && \
  PATH="/root/.cargo/bin:$PATH" rustup install stable
ENV PATH $PATH:/root/.cargo/bin

RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN yarn cache clean
RUN yarn install
EXPOSE 80
CMD ["yarn", "start"]
