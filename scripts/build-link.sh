#!/usr/bin/env bash

(cd test && rm -r node_modules/unenum)
(cd test/node_modules && ln -s ../../dist unenum)
