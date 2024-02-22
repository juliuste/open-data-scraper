import * as t from 'io-ts'

const ADESchema = t.union([t.literal(1), t.literal(2), t.literal(3), t.literal(4), t.literal(5), t.literal(6)])
const GFSchema = t.union([t.literal(1), t.literal(2), t.literal(3), t.literal(4)])
const BSGSchema = t.union([t.literal(1), t.literal(9)])

export const RawAreaEntitySchema = t.strict({
  type: t.literal('Feature'),
  properties: t.strict({
    // left out (for now): OBJID, BEGINN, SN_L, SN_R, SN_K, SN_V1, SN_V2, SN_G, FK_F3, WSK, AGS, ARS
    ADE: ADESchema,
    GF: GFSchema,
    BSG: BSGSchema,
    ARS: t.string,
    AGS: t.string,
    SDV_ARS: t.string,
    GEN: t.string,
    BEZ: t.string,
    IBZ: t.number,
    BEM: t.string,
    NBD: t.union([t.literal('ja'), t.literal('nein')]),
    SN_L: t.string,
    NUTS: t.string,
    EWZ: t.number,
    KFL: t.number,
    DLM_ID: t.string
  }),
  geometry: t.strict({ type: t.union([t.literal('Polygon'), t.literal('MultiPolygon')]), coordinates: t.any }) // todo
})
export type RawAreaEntity = t.TypeOf<typeof RawAreaEntitySchema>

export const RawPointEntitySchema = t.strict({
  type: t.literal('Feature'),
  properties: t.strict({
    ARS: t.string
  }),
  geometry: t.strict({ type: t.literal('Point'), coordinates: t.any })
})
export type RawPointEntity = t.TypeOf<typeof RawPointEntitySchema>

export const RawAdditionalNameEntitySchema = t.strict({
  type: t.literal('Feature'),
  properties: t.strict({
    ARS: t.string,
    AZB: t.string
  })
})
export type RawAdditionalNameEntity = t.TypeOf<typeof RawAdditionalNameEntitySchema>

export const RawTranslationEntitySchema = t.strict({
  type: t.literal('Feature'),
  properties: t.strict({
    ARS: t.string,
    RGS: t.string,
    SPR: t.union([t.literal('dan'), t.literal('dsb'), t.literal('hsb'), t.literal('frr'), t.literal('stq')])
  })
})
export type RawTranslationEntity = t.TypeOf<typeof RawTranslationEntitySchema>

export interface AreaEntityType {
  id: number
  name: string
  comment?: string
}

// when adding a property, remember to add it to the readme as well
export interface AreaEntity {
  type: AreaEntityType
  administrativeLevel: number
  agsId?: string
  arsId: string
  seatOfAdministrationArsId: string
  name: {
    de: string
    da?: string
    dsb?: string
    hsb?: string
    frr?: string
    stq?: string
  }
  additionalName?: string
  canBePrefixedWithTypeName: boolean
  nuts: string
  population: number
  areaMeasurement: number
  areaGeometry: unknown // todo
  pointGeometry?: unknown // todo
  dlmObjectId: string
}
