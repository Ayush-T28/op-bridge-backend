FROM node:16-alpine as builder
ARG GITLAB_ACCESS_TOKEN
LABEL maintainer=""
LABEL description="plaground-orchestrator-backend service"
#RUN apk add --no-cache --virtual .gyp python2 make g++

# Create app directory
WORKDIR /usr/src/app

# Copy source
COPY package*.json ./
COPY ./.npmrc ./

#RUN npm install
RUN npm ci

COPY . .

RUN npm run-script build && ls

FROM node:16-alpine
ARG GITLAB_ACCESS_TOKEN
ARG PORT=3009
ARG BUILD_ENV

ENV NODE_ENV ${BUILD_ENV}
ENV NODE_CONFIG_ENV ${BUILD_ENV}

# Update the system
RUN apk --no-cache -U upgrade
RUN apk update && apk add bash
RUN apk add --update coreutils
RUN apk update && apk add openssl

RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node  --from=builder /usr/src/app/package*.json ./
COPY --chown=node:node --from=builder /usr/src/app/.npmrc ./

RUN export GITLAB_ACCESS_TOKEN=${GITLAB_ACCESS_TOKEN} && npm install --only=production
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/config ./config
COPY --chown=node:node --from=builder /usr/src/app/migrations ./migrations
COPY --chown=node:node --from=builder /usr/src/app/knexfile.js ./knexfile.js
COPY --chown=node:node --from=builder /usr/src/app/templates ./templates
COPY --chown=node:node --from=builder /usr/src/app/db-migrations ./db-migrations

EXPOSE 3009

CMD ["npm","start"]
