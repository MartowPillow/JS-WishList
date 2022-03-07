FROM node:14.11.0-alpine3.12

USER root

RUN apk update && apk add sqlite python3 make gcc libc-dev g++ sqlite-libs jq

RUN npm install -g node-gyp-cache

RUN npm config set node_gyp node-gyp-cache

RUN npm install -g --unsafe-perm better-sqlite3@7.1.2

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["sh", "/entrypoint.sh"]
