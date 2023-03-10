#!/usr/bin/env bash
## Increase dev version
git add package.json package-lock.json
git commit -m "[Dev] Create dev version [$1]"
git push
