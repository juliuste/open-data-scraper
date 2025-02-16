#!/usr/bin/env bash
set -e
DIR=$(dirname "$0")
DATA_DIR="$DIR/data"
SOURCE_DIR="$DATA_DIR/source"
STEP_1_DIR="$DATA_DIR/processing-1"

rm -rf "$DATA_DIR"
mkdir -p "$DATA_DIR"
mkdir -p "$SOURCE_DIR"
mkdir -p "$STEP_1_DIR"

echo 'Fetching…'
wget -q --show-progress --progress=dot:mega 'https://daten.gdz.bkg.bund.de/produkte/vg/vg250-ew_ebenen_1231/aktuell/vg250-ew_12-31.utm32s.shape.ebenen.zip' -O "$DATA_DIR/source.zip"

echo 'Unpacking…'
unzip -jq "$DATA_DIR/source.zip" "vg250-ew_12-31.utm32s.shape.ebenen/vg250-ew_ebenen_1231/*" -d "$SOURCE_DIR"

FILES=$(ls "$SOURCE_DIR" | sed -e 's/\..*$//' | sort | uniq)
EXPECTED_FILES="VG250_GEM
VG250_KRS
VG250_LAN
VG250_LI
VG250_PK
VG250_RBZ
VG250_STA
VG250_VWG
VGTB_ATT_VG
VGTB_AZB_VG
VGTB_RGS_OTL
VGTB_RGS_VG
VGTB_VZ_GEM
VG_DATEN
VG_IBZ
VG_WERTE"

if [[ $FILES != $EXPECTED_FILES ]]; then echo "Unexpected file detected in VG250 source"; echo $FILES && exit 1; fi

echo 'Converting…'
ogr2ogr -f GeoJSON "$STEP_1_DIR/gemeinden.json" -s_srs "$SOURCE_DIR/VG250_GEM.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_GEM.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/kreise.json" -s_srs "$SOURCE_DIR/VG250_KRS.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_KRS.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/laender.json" -s_srs "$SOURCE_DIR/VG250_LAN.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_LAN.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/gemeindepunkte.json" -s_srs "$SOURCE_DIR/VG250_PK.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_PK.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/regierungsbezirke.json" -s_srs "$SOURCE_DIR/VG250_RBZ.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_RBZ.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/bund.json" -s_srs "$SOURCE_DIR/VG250_STA.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_STA.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/verwaltungsgemeinschaften.json" -s_srs "$SOURCE_DIR/VG250_VWG.prj" -t_srs EPSG:4326 "$SOURCE_DIR/VG250_VWG.shp"
ogr2ogr -f GeoJSON "$STEP_1_DIR/zusatzbezeichnungen.json" "$SOURCE_DIR/VGTB_AZB_VG.dbf"
ogr2ogr -f GeoJSON "$STEP_1_DIR/uebersetzungen.json" "$SOURCE_DIR/VGTB_RGS_VG.dbf"

echo 'Mapping…'
node --no-warnings=ExperimentalWarning --loader ts-node/esm "$DIR/map.ts" > $DATA_DIR/output.json
cat $DATA_DIR/output.json | gzip > "$DATA_DIR/output.json.gz"

echo 'Generating AGS/ARS lookup table…'
node --no-warnings=ExperimentalWarning --loader ts-node/esm "$DIR/lookup.ts" | gzip > "$DATA_DIR/ags2ars.json.gz"

echo 'Done.'
