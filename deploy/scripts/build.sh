#!/usr/bin/env bash
set -xe

# Download all required dependencies
yarn install --production=false

NODE_ENV=production yarn build
