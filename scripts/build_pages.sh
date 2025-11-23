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
rm -r node_modules
git clean -fx -d
git rm $(git ls-files)
ls | xargs -r rm -r
mv $(ls -A "$tempdir" | sed "s#^#${tempdir}/#") .
rm -r "$tempdir"
