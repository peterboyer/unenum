#!/usr/bin/env bash

NODE_NO_WARNINGS=1 node --experimental-vm-modules node_modules/jest/bin/jest.js $@
