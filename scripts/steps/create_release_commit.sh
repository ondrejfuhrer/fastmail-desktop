#!/usr/bin/env bash
## Create release commit
git add package.json package-lock.json
git commit -m "[Release] Change version to $1"
git push
