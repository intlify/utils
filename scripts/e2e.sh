#!/bin/bash

set -e

# Install playwright
pnpm exec playwright install

# Pack packages
pnpm pack

# TODO(kazupon): Remove this when jsr supports pnpm workspace
# Replace deps
pnpx tsx ./scripts/replaceDeps.ts

pnpm install

# just do e2e!
pnpm run test:e2e
