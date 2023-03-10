#!/usr/bin/env bash
## Stash all current changes so that they are not pushed to the release
git add .
git stash -m "Pre-release stash $1"
