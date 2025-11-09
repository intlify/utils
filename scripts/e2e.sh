#!/bin/bash

set -e

# Pack packages
pnpm pack

# Replace deps
pnpx tsx run ./scripts/replaceDeps.ts

# just do e2e!
pnpm run test:e2e
