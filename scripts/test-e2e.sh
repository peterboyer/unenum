#!/usr/bin/env bash

yarn build
cd test
yarn
rm -r node_modules/unenum
(cd node_modules && ln -s ../../dist unenum)
yarn tsc --project tsconfig.json
yarn tsc --project tsconfig.global.json
