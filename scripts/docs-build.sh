#!/usr/bin/env bash

echo "\`\`\`ts" > README.md
sed "s/\t/  /g" ./README.ts >> README.md
echo "\`\`\`" >> README.md
