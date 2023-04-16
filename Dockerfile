FROM node:16-alpine as builder

# Create directory in the image
WORKDIR /app

# Install typescript with --quite and -g modes.
RUN npm install --quite typescript -g
COPY ./public ./public
COPY ./src ./src
COPY ./.env.frontend ./.env
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./

# install frontend packages
RUN npm install

# build frontend app
RUN npm run build

# -------------------------------------------------------------------------
FROM node:16-alpine

WORKDIR /usr/src

RUN mkdir -p ./presento/client-build

COPY --from=builder /app/client-build ./presento/client-build

COPY ./backend/src ./presento/src
COPY ./backend/package.json ./presento
COPY ./backend/package-lock.json ./presento

RUN cd ./presento && npm ci

CMD cd presento && npm start

# FROM node:16-alpine

# WORKDIR /app

# RUN npm install --quite typescript -g

# COPY . .

# RUN npm install

# # # build frontend app
# RUN npm run build

# RUN mkdir -p ./backend/client-build

# COPY ./client-build ./backend/client-build

# RUN cd ./backend && npm ci

# CMD cd backend && npm start
