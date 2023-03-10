#!/usr/bin/env bash
## Get the current version of the app
version=$(npm run --silent version)
## Calculate new release version
release_version=${version/"-dev"/}

./scripts/steps/stash_changes.sh "${version}"
./scripts/steps/update_to_release_version.sh "${version}" "${release_version}"
./scripts/steps/create_release_commit.sh "${release_version}"
./scripts/steps/create_release.sh "${release_version}"
./scripts/steps/update_release_notes.sh
./scripts/steps/update_changelog.sh
./scripts/steps/increase_version.sh "${release_version}"

new_version=$(npm run --silent version)

./scripts/steps/update_to_dev_version.sh "${new_version}"

## Add back stashed changers
git stash pop
echo "Version ${release_version} has been released and new version ${new_version} set."
