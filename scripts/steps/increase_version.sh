#!/usr/bin/env bash
## Setup -dev version as next in line
release_version="$1"
next_patch_version=${release_version: -1}
next_patch_version=$((next_patch_version+1))
version_length=${#release_version}
next_version="${release_version:0:version_length-1}${next_patch_version}-dev"

## Replace current version with next dev one
sed -i .old "s/${release_version}/${next_version}/" package.json
npm install

## Cleanup temp file
rm -f package.json.old
