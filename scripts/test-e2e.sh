#!/usr/bin/env bash

cd test

yarn
rm -r node_modules/unenum
(cd node_modules && ln -s ../../dist unenum)

yarn tsc --project tsconfig.json
yarn tsx --no-cache index.ts
