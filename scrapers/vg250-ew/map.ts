import { either } from 'fp-ts'
import * as t from 'io-ts'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { loadJsonFile } from 'load-json-file'
import { AreaEntity, RawAdditionalNameEntitySchema, RawAreaEntity, RawAreaEntitySchema, RawPointEntitySchema, RawTranslationEntitySchema } from './types.js'

const esmDirname = dirname(fileURLToPath(import.meta.url))
const dataDirName = resolve(esmDirname, './data/processing-1/')

// load additional names
const additionalNameMap = new Map<string, string>()
await (async () => {
  const content = await loadJsonFile(resolve(dataDirName, 'zusatzbezeichnungen.json'))
  const validation = t.strict({ type: t.literal('FeatureCollection'), features: t.array(RawAdditionalNameEntitySchema) }).decode(content)
  if (!either.isRight(validation)) throw new Error('file does not match schema: zusatzbezeichnungen.json')
  validation.right.features.forEach(({ properties }) => {
    const existing = additionalNameMap.get(properties.ARS)
    if (existing !== undefined) throw new Error(`unexpected: more than one additional name for entity ${properties.ARS}`)
    additionalNameMap.set(properties.ARS, properties.AZB)
  })
})()

// load translations
const translationMap = new Map<string, Record<string, string>>()
await (async () => {
  const content = await loadJsonFile(resolve(dataDirName, 'uebersetzungen.json'))
  const validation = t.strict({ type: t.literal('FeatureCollection'), features: t.array(RawTranslationEntitySchema) }).decode(content)
  if (!either.isRight(validation)) throw new Error('file does not match schema: uebersetzungen.json')
  validation.right.features.forEach(({ properties }) => {
    const existing = translationMap.get(properties.ARS) ?? {}
    if (existing[properties.SPR] !== undefined) throw new Error(`unexpected: more than one translation in the same language for entity ${properties.ARS}`)
    existing[properties.SPR] = properties.RGS
    translationMap.set(properties.ARS, existing)
  })
})()

// load points
const pointMap = new Map<string, any>()
await (async () => {
  const content = await loadJsonFile(resolve(dataDirName, 'gemeindepunkte.json'))
  const validation = t.strict({ type: t.literal('FeatureCollection'), features: t.array(RawPointEntitySchema) }).decode(content)
  if (!either.isRight(validation)) throw new Error('file does not match schema: gemeindepunkte.json')
  validation.right.features.forEach(({ properties, geometry }) => {
    const existing = pointMap.get(properties.ARS)
    if (existing !== undefined) throw new Error(`unexpected: more than one point for entity ${properties.ARS}`)
    pointMap.set(properties.ARS, geometry)
  })
})()

const mapAreaEntity = ({ geometry, properties }: RawAreaEntity): AreaEntity => {
  const translations = translationMap.get(properties.ARS) ?? {}

  const entity: AreaEntity = {
    type: {
      id: properties.IBZ,
      name: properties.BEZ,
      comment: properties.BEM !== '--' ? properties.BEM : undefined
    },
    administrativeLevel: properties.ADE,
    agsId: /^-*$/.test(properties.AGS) ? undefined : properties.AGS,
    arsId: properties.ARS,
    seatOfAdministrationArsId: properties.SDV_ARS,
    name: {
      de: properties.GEN,
      da: translations.dan,
      dsb: translations.dsb,
      hsb: translations.hsb,
      frr: translations.frr,
      stq: translations.stq,
      nds: translations.nds
    },
    additionalName: additionalNameMap.get(properties.ARS),
    canBePrefixedWithTypeName: properties.NBD === 'ja',
    nuts: properties.NUTS,
    population: properties.EWZ,
    areaMeasurement: properties.KFL,
    areaGeometry: geometry,
    pointGeometry: pointMap.get(properties.ARS),
    dlmObjectId: properties.DLM_ID
  }
  return entity
}

export const areaEntities = (await Promise.all([
  'bund',
  'laender',
  'regierungsbezirke',
  'kreise',
  'verwaltungsgemeinschaften',
  'gemeinden'
].map(async fileName => {
  const content = await loadJsonFile(resolve(dataDirName, `${fileName}.json`))
  const validation = t.strict({ type: t.literal('FeatureCollection'), features: t.array(RawAreaEntitySchema) }).decode(content)
  if (!either.isRight(validation)) throw new Error(`file does not match schema: ${fileName}.json`)
  return validation.right.features
    .filter(({ properties }) =>
      properties.GF === 4 && // only select on-shore areas
      properties.BSG === 1 // remove bodensee
    ).map(mapAreaEntity)
}))).flat()

process.stdout.write(JSON.stringify(areaEntities, null, 2))
