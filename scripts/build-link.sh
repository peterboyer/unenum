#!/usr/bin/env bash

cd ./test/node_modules
[[ -e ./unenum ]] && rm -r ./unenum
ln -s ../../dist unenum
