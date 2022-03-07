#!/usr/bin/env sh

npm install

OPTS=""

if [ "$WATCH_MOD" == "poll" ]; then
    OPTS="-L"
fi

./node_modules/.bin/nodemon $OPTS --watch ./ ./server.js