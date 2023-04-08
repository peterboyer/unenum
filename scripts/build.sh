#!/usr/bin/env bash

rm -rf dist

# ts
tsc --project tsconfig.build.json \
	--declaration true \
	--emitDeclarationOnly true
cp src/*.d.ts dist

# mjs
tsc --project tsconfig.build.json \
	--outDir dist/mjs
touch dist/mjs/global.js
cat >dist/mjs/package.json <<!EOF
{
	"type": "module"
}
!EOF

# cjs
tsc --project tsconfig.build.json \
	--outDir dist/cjs \
	--module commonjs \
	--target es2015 \
	--verbatimModuleSyntax false
touch dist/cjs/global.js
cat >dist/cjs/package.json <<!EOF
{
	"type": "commonjs"
}
!EOF

# package
cp package.json LICENSE README.md dist
dot-json dist/package.json scripts --delete
dot-json dist/package.json devDependencies --delete
sed -i'' 's/"src/"./g' dist/package.json

version_base=$(dot-json dist/package.json version)
version_complete=$(scripts/version.sh $version_base | awk '{print$1}')
if [[ "$PUBLISH_CHANNEL" == "sha" ]]; then
	version_complete="$version_complete-sha.$(git rev-parse --short HEAD)"
fi
dot-json dist/package.json version $version_complete
