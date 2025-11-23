#!/bin/bash

OUTPUT_PATH='dist/'

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"
cd "$(git rev-parse --show-toplevel)"

# Build site
npm i
npm run build

# Move build output to root directory and remove all other files
tempdir="$(mktemp -d)"
mv $(ls -A "$OUTPUT_PATH" | sed "s#^#${OUTPUT_PATH}#") "$tempdir"
git clean -fx -d . -e "/${OUTPUT_PATH}"
git rm $(git ls-files)
rm -r ./*
mv $(ls -A "$tempdir" | sed "s#^#${tempdir}/#") .
rm -r "$tempdir"
