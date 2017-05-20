#! /bin/bash -ex

main() {

    if [[ "$1" == build ]]; then
        npmBuild
    else
        if [[ $(docker images | grep -c jarvixextension) -eq 0 ]]; then
            imageBuilder
        fi
        dev
    fi
}

imageBuilder() {
    docker build . -t jarvixextension
}

npmBuild() {
    imageBuilder
    rm -rf build
    mkdir build
    docker run \
        -v $(pwd)/build:/usr/app/build \
        -ti --rm \
        jarvixextension npm run build
}

dev() {
    rm -rf dev
    docker run \
        -v $(pwd)/dev:/usr/app/dev \
        -v $(pwd)/src:/usr/app/src \
        -ti -P --rm \
        -p 3004:3004 \
        jarvixextension npm run dev

}

main "$@"
