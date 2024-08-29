import { loadJsonFile } from 'load-json-file'
import wkx from 'wkx'
import { AreaEntity } from '../../scrapers/vg250-ew/types.js'

interface AreaEntityWithAdditionalAttributes extends AreaEntity {
  paddedArsId: string
  additionalNameDE?: string
  areaMeasurementInSquareMeters: number
  areaGeometryWkt: string
  pointGeometryWkt?: string
}
interface AreaEntityWithParent extends AreaEntityWithAdditionalAttributes { parentPaddedArsId?: string }
type PartialAreaEntity = Omit<AreaEntityWithParent, 'arsId' | 'nuts' | 'seatOfAdministrationArsId'> & Partial<Pick<AreaEntityWithParent, 'arsId' | 'nuts' | 'seatOfAdministrationArsId'>>

const dataPath = process.env.SOURCE
if (dataPath === undefined) throw new Error('missing SOURCE env')

const data: AreaEntity[] = await loadJsonFile(dataPath)
const withAdditionalAttributes: AreaEntityWithAdditionalAttributes[] = data.map(e => ({
  ...e,
  paddedArsId: e.arsId.padEnd(12, '0'),
  additionalNameDE: e.canBePrefixedWithTypeName ? `${e.type.name} ${e.name.de}` : undefined,
  areaMeasurementInSquareMeters: Math.round(e.areaMeasurement * 1000 * 1000),
  areaGeometryWkt: wkx.Geometry.parseGeoJSON(e.areaGeometry as any).toWkt(),
  pointGeometryWkt: (e.pointGeometry !== undefined) ? wkx.Geometry.parseGeoJSON(e.pointGeometry as any).toWkt() : undefined
}))

const entityMap = new Map<string, AreaEntityWithAdditionalAttributes>()
withAdditionalAttributes.forEach(e => entityMap.set(e.arsId, e))

const possibleParentArsIds = (arsId: string): string[] => {
  return [9, 5, 3, 2, 0].map(index => {
    if (index === 0) return '000000000000'
    return arsId.slice(0, index)
  })
}

const withParent: AreaEntityWithParent[] = withAdditionalAttributes.map(e => {
  const possibleParents = possibleParentArsIds(e.arsId)
  const parent = possibleParents.find(pId => {
    const match = entityMap.get(pId)
    return (match !== undefined) && match.paddedArsId !== e.paddedArsId
  })?.padEnd(12, '0')
  return { ...e, parent }
})

const partial: PartialAreaEntity[] = withParent.map(e => {
  if (e.administrativeLevel === 1) return { ...e, arsId: undefined, agsId: undefined }
  if ([2, 3, 4].includes(e.administrativeLevel)) return e
  if (e.administrativeLevel === 5) return { ...e, nuts: undefined }
  return { ...e, nuts: undefined, seatOfAdministrationArsId: undefined }
})

process.stdout.write(JSON.stringify(partial, null, 2))
