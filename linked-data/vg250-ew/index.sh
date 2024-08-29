#!/usr/bin/env bash
set -e
DIR=$(dirname "$0")
BASE_IRI="https://lod.codefor.de/"
BIN_DIR="$DIR/../.bin"
DATA_DIR="$DIR/data"

echo 'Fetching rmlmapper'
wget -q --show-progress --progress=dot:mega -c -N -O "$BIN_DIR/rmlmapper.jar" https://github.com/RMLio/rmlmapper-java/releases/download/v7.0.0/rmlmapper-7.0.0-r374-all.jar

rm -rf "$DATA_DIR"
mkdir -p "$DATA_DIR"

echo 'Preparing data…'
cat "$DIR/../../scrapers/vg250-ew/data/output.json.gz" | gunzip > "$DATA_DIR/source.json"
env SOURCE="$DATA_DIR/source.json" node --no-warnings=ExperimentalWarning --loader ts-node/esm "$DIR/build.ts" > "$DATA_DIR/processed.json"

echo 'Applying mapping…'
java -jar "$BIN_DIR/rmlmapper.jar" -m "$DIR/mapping.ttl" -s turtle --strict --base-iri "$BASE_IRI" > "$DATA_DIR/output.ttl"

echo 'Compressing output…'
cat "$DATA_DIR/output.ttl" | gzip > "$DATA_DIR/output.ttl.gz"

echo 'Done.'
