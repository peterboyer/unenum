#!/usr/bin/env bash

rm -rf dist

# ts
tsc --project tsconfig.build.json
mkdir -p dist

# package
cp package.json LICENSE README.md dist
(cd dist && npm pkg delete scripts)
(cd dist && npm pkg delete devDependencies)

version_base=$(cd dist && npm pkg get version | tr -d '\"')
version_complete=$(scripts/version.sh $version_base | awk '{print$1}')
if [[ "$PUBLISH_CHANNEL" == "sha" ]]; then
	version_complete="$version_complete-sha.$(git rev-parse --short HEAD)"
fi
(cd dist && npm pkg set version=$version_complete)
