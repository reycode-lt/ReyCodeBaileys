#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

command -v yarn >/dev/null 2>&1 || {
  echo "ERROR: Yarn tidak ditemukan."
  exit 1
}

command -v node >/dev/null 2>&1 || {
  echo "ERROR: Node.js tidak ditemukan."
  exit 1
}

TMP_DIR="$(mktemp -d "$SCRIPT_DIR/.wa-proto-generate.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "[1/3] Generate JavaScript..."
yarn pbjs -t static-module --no-beautify -w es6 \
  --no-bundle --no-delimited --no-verify --no-comments \
  -o "$TMP_DIR/index.js" "$SCRIPT_DIR/WAProto.proto"

echo "[2/3] Generate TypeScript declarations..."
set -o pipefail
yarn pbjs -t static-module --no-beautify -w es6 \
  --no-bundle --no-delimited --no-verify \
  "$SCRIPT_DIR/WAProto.proto" |
  yarn pbts --no-comments -o "$TMP_DIR/index.d.ts" -

echo "[3/3] Fix generated imports and Long helpers..."
(
  cd "$TMP_DIR"
  node "$SCRIPT_DIR/fix-imports.js"
)

mv "$TMP_DIR/index.js" "$SCRIPT_DIR/index.js"
mv "$TMP_DIR/index.d.ts" "$SCRIPT_DIR/index.d.ts"

echo "SUCCESS: WAProto berhasil diperbarui."
