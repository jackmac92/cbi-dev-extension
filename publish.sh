#! /bin/bash -ex

APP_ID="njdpfahenljmkilaefpomkcghdlcooed"
FILE_NAME="./dist/cbi-dev-ext.zip"
ACCESS_TOKEN=""
UPLOADED_ITEM_ID=""

CONSUL_KV="http://internal.consul-nomad.cfg.dev.cbinsights.com:8500/v1/kv/chrome-extension/publishing_auth"

CLIENT_ID=$(curl "$CONSUL_KV/client_id?raw=true")
CLIENT_SECRET=$(curl "$CONSUL_KV/client_secret?raw=true")
REFRESH_TOKEN=$(curl "$CONSUL_KV/refresh_token?raw=true")

build() {
    docker build . -t cbidevextension
    docker run \
        -e NODE_ENV="production" \
        -e NODE_ENV="$APP_ID" \
        -v $(pwd)/dist:/usr/app/dist \
        --rm \
        cbidevextension npm run doit2it
}

refreshAccessToken() {
    ACCESS_TOKEN=$(curl \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -X POST \
        -d "client_id=$CLIENT_ID" \
        -d "client_secret=$CLIENT_SECRET" \
        -d "refresh_token=$REFRESH_TOKEN" \
        -d "grant_type=refresh_token" \
        https://www.googleapis.com/oauth2/v4/token  | jq -r ".access_token")
}

uploadExtension() {
    curl \
        -H "Authorization: Bearer $ACCESS_TOKEN"  \
        -H "x-goog-api-version: 2" \
        -X PUT \
        -T $FILE_NAME \
        "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID"
}

publish() {
    curl \
        -H "Authorization: Bearer $ACCESS_TOKEN"  \
        -H "x-goog-api-version: 2" \
        -H "Content-Length: 0" \
        -X POST \
        "https://www.googleapis.com/chromewebstore/v1.1/items/$APP_ID/publish"
}

build
refreshAccessToken
uploadExtension
publish
