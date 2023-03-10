#!/usr/bin/env bash
## Create artifacts
npm run make

## Create release
gh release create "$1" -t "$1" "./out/make/Spendee-$1.dmg" "./out/make/zip/darwin/x64/Spendee-darwin-x64-$1.zip"
