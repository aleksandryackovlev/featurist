#!/usr/bin/env bash
set -ex

PROJECT_DIR="$(realpath "$(dirname "$0")"/../..)"

commandToExec="${1:-up}"

if [[ -n $1 ]]; then
  shift
fi

case $commandToExec in
  up)
    npm --prefix "$PROJECT_DIR" run migration:up
    ;;
  down)
    npm --prefix "$PROJECT_DIR" run migration:down
    ;;
  *)
      printf "%s\n" "An unknown command $commandToExec" >&2
      exit 1;
    ;;
esac

