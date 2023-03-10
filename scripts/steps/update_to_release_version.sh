#!/usr/bin/env bash
## Replace the version in package.json so that the release is created correctly
sed -i .old "s/$1/$2/" package.json
npm install

## Cleanup temporary files
rm -f package.json.old
