#! /bin/bash -ex

APP_ID="jgnfghipbdephjpabbaijeofnkhdnmfc"

npmBuild() {
    docker build . -t cbidevextension
    docker run \
        -e NODE_ENV="production" \
        -v $(pwd)/build:/usr/app/build \
        -v $(pwd)/dist:/usr/app/dist \
        --rm \
        cbidevextension npm run build
}

errThang() {
    docker build . -t cbidevextension
    docker run \
        -e NODE_ENV="production" \
        -e NODE_ENV="$APP_ID" \
        -v $(pwd)/build:/usr/app/build \
        -v $(pwd)/dist:/usr/app/dist \
        --rm \
        cbidevextension npm run doit2it
}

reloadScripts() {
    find dev/js/scripts | entr /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-gpu --app=http://reload.cbiextension
}

reloadManifest() {
    find dev/manifest.json | entr /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-gpu --app=http://reload.cbiextension
}

autoReloader() {
    reloadScripts &
    reloadManifest &
}

dev() {
    docker build . -t cbidevextension-dev
    rm -rf dev
    docker run \
        -e NODE_ENV="development" \
        -e DEV_PORT=$DEV_PORT \
        -v $(pwd)/dev:/usr/app/dev \
        -v $(pwd)/src:/usr/app/src \
        -ti -P --rm --name cbext \
        -p $DEV_PORT:$DEV_PORT \
        cbidevextension-dev npm run dev
}

while getopts 'h:p:c' flag; do
  case "${flag}" in
    p) devPort="${OPTARG}" ;;
    b) buildType="${OPTARG}" ;;
    h) PlatformHost="${OPTARG}" ;;
    *) error "Unexpected option ${flag}" ;;
  esac
done

DEV_PORT=${devPort:-3004}
BUILD_TYPE=${buildType:-"dev"}

"$@"
