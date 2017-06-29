#! /bin/bash -ex

main() {
    imageBuilder
    if [[ "$1" == build ]]; then
        npmBuild
    else
        dev
    fi
}

imageBuilder() {
    docker build . -t jarvixextension
}

npmBuild() {
    rm -rf build && mkdir build
    docker run \
        -v $(pwd)/build:/usr/app/build \
        -e NODE_ENV="production" \
        -e CBI_HOSTNAME="https://cbinsights.com" \
        -ti --rm \
        jarvixextension npm run build
}

dev() {
    rm -rf dev
    docker run \
        -v $(pwd)/dev:/usr/app/dev \
        -v $(pwd)/src:/usr/app/src \
        -e NODE_ENV="dev" \
        -e DEV_PORT="3004" \
        -e CBI_HOSTNAME="https://dev.cbinsights.com" \
        -ti --rm \
        -p 3004:3004 \
        jarvixextension npm run dev

}

main "$@"
