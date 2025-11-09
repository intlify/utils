#!/bin/bash

set -xe

# Check edge release
if [[ ! -z ${EDGE_RELEASE} ]] ; then
  pnpx tsx ./scripts/bump-edge
fi

# Release packages
echo "Publishing"
pnpm publish
