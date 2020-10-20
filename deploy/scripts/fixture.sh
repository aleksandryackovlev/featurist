#!/usr/bin/env bash
set -ex

PROJECT_DIR="$(realpath "$(dirname "$0")"/../..)"

npm --prefix "$PROJECT_DIR" run fixture
