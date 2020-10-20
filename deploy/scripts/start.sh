#!/usr/bin/env bash
set -xe

PROJECT_DIR="$(realpath "$(dirname "$0")"/../..)"

# start project
NODE_ENV=production npm --prefix "$PROJECT_DIR" run start:prod
