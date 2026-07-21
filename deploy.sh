#!/bin/bash

set -e

TARGET=$1

if [ -z "$TARGET" ]; then
    echo "Usage:"
    echo "  ./deploy.sh gmail1"
    echo "  ./deploy.sh gmail2"
    echo "  ./deploy.sh gmail3"
    echo "  ./deploy.sh gmail4"
    echo "  ./deploy.sh all"
    exit 1
fi

deploy() {

    NAME=$1

    echo ""
    echo "======================================="
    echo "Deploying to $NAME..."
    echo "======================================="

    cp ".clasp-$NAME.json" ".clasp.json"

    clasp push --force

    echo "✅ $NAME deployed."

}

if [ "$TARGET" = "all" ]; then

    for file in .clasp-gmail*.json
    do
        NAME=$(basename "$file" .json)
        NAME=${NAME#.clasp-}

        deploy "$NAME"
    done

else

    if [ ! -f ".clasp-$TARGET.json" ]; then
        echo "❌ Unknown target: $TARGET"
        exit 1
    fi

    deploy "$TARGET"

fi