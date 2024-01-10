#!/usr/bin/env bash

cd test && \
	yarn tsc --project tsconfig.json && \
	yarn tsx --no-cache index.ts
