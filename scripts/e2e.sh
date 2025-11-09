#!/bin/bash

set -e

# Install playwright
pnpm exec playwright install

# just do e2e!
pnpm run test:e2e
