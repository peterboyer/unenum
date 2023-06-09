#!/usr/bin/env bash

cd test

yarn

rm -r node_modules/unenum
(cd node_modules && ln -s ../../dist unenum)

yarn tsc --project tsconfig.json

cp index.ts index.global.ts
sed -i'' 's/^import type .*/import "unenum\/global";/g' index.global.ts
cp tsconfig.json tsconfig.global.json
sed -i'' 's/index.ts/index.global.ts/g' tsconfig.global.json
yarn tsc --project tsconfig.global.json
rm index.global.ts tsconfig.global.json
