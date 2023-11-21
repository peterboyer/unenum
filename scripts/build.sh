#!/usr/bin/env bash

rm -rf dist

# ts
tsc --project tsconfig.build.json \
	--declaration true \
	--emitDeclarationOnly true
cp src/*.d.ts dist

# mjs
tsc --project tsconfig.build.json \
	--outDir dist

# package
cp package.json LICENSE README.ts dist
dot-json dist/package.json scripts --delete
dot-json dist/package.json devDependencies --delete

version_base=$(dot-json dist/package.json version)
version_complete=$(scripts/version.sh $version_base | awk '{print$1}')
if [[ "$PUBLISH_CHANNEL" == "sha" ]]; then
	version_complete="$version_complete-sha.$(git rev-parse --short HEAD)"
fi
dot-json dist/package.json version $version_complete
