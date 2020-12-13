FROM node:12.13-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install -g yarn
RUN yarn set version berry
RUN yarn install

# Bundle app source
# COPY public ./public
# COPY src ./src
COPY server ./server
COPY types ./types
COPY .env ./
COPY .eslintignore ./
COPY .eslintrc.js ./
COPY .prettierrc.js ./
COPY nodemon.json ./
# COPY next-env.d.ts ./
# COPY next.config.js ./
COPY tsconfig.json ./
# COPY tsconfig.server.json ./
RUN mkdir dist

ENV DOCKER 1

EXPOSE 5000

RUN yarn build:server
CMD [ "yarn", "start" ]