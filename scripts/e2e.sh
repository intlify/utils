#!/bin/bash

set -e

# Pack packages
npm pack

# Replace deps
bun run ./scripts/replaceDeps.ts

# setup playground/* for e2e
npm run setup

# just do e2e!
npm run test:e2e
