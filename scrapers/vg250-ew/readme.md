# VG250-EW

The transformed dataset is a (gzipped) JSON document - a list consisting of elements with these attributes:

| name/path | type | description | example(s) |
| --------- | ---- | ----------- | ---------- |
`type.id` | **number** | Machine-readable ID of this entity type. Note that there might be different types for the same administrative level, e.g. for states there are `20 - Land`, `21 - Freistaat` etc. | `64`
`type.name` | **string** | Type of this entity. See also `type.id`. | `Gemeinde`
`type.comment` | _string (optional)_ | Some types also have an additional comment/addition to their name, e.g. "kreisfrei". | `gemeinschaftsangehörig`
`administrativeLevel` | **number** | Number between 1 and 6 indicating the administrative level: 1 for the federal level, 2 for the states, 3 for districts (not all states have these), 4 for "Kreise", 5 for "Verwaltungsgemeinschaften" and 6 for municipalities. | `6`
`agsId` | _string (optional)_ | 2- to 8-digit [german municipality key](https://www.wikidata.org/wiki/Property:P439). Not always present, e.g. on "Verwaltungsgemeinschaften". | `01054045`
`arsId` | **string** | 2- to 12-digit [german regional key](https://www.wikidata.org/wiki/Property:P1388). | `010545494045`
`seatOfAdministrationArsId` | **string** | `arsId` of the municipality that holds the seat of administration. Equal to the entity's own `arsId` for objects on the lowest administrative level (6). | `010545494045`
`name.de` | **string** | Name of the entity, in german. | `Högel`
`name.da` | _string (optional)_ | Name of the entity, in Danish. Present for entities where Danish is a recognized minority language. |
`name.dsb` | _string (optional)_ | Name of the entity, in Lower Sorbian. Present for entities where Lower Sorbian is a recognized minority language. |
`name.hsb` | _string (optional)_ | Name of the entity, in Upper Sorbian. Present for entities where Upper Sorbian is a recognized minority language. |
`name.frr` | _string (optional)_ | Name of the entity, in North Frisian. Present for entities where North Frisian is a recognized minority language. | `Höögel`
`name.stq` | _string (optional)_ | Name of the entity, in Sater Frisian. Present for entities where Sater Frisian is a recognized minority language. |
`name.nds` | _string (optional)_ | Name of the entity, in Low German. Present for entities where Low German is a recognized minority language. |
`additionalName` | _string (optional)_ | Additional name of this entity, in german, such as "Hansestadt", "Ostseebad" etc. |
`canBePrefixedWithTypeName` | **boolean** | Flag indicating if the (german) name can be prefixed with `type.name`. Usually true, however there are cases in which this is not possible, e.g. for grammatical reasons, as in "Oberbergischer Kreis", which does not get prefixed with the term "Kreis". | `true`
`nuts` | **string** | [NUTS code](https://en.wikipedia.org/wiki/Nomenclature_of_Territorial_Units_for_Statistics) of a region this entity is located in (or equal to). | `todo`
`population` | **number** | Population of this entity | `todo`
`areaMeasurement` | **number** | Area of this entity, in km² | `todo`
`areaGeometry` | **GeoJSON Polygon/MultiPolygon** | Geometry of this entity. | `{"type": "MultiPolygon", "geometry": …}`
`pointGeometry` | _GeoJSON Point (optional)_ | Only available for municipalities (administrative level 6). Point that represents the center of the municipality, e.g. to be used on a map. | `{"type": "Point", "geometry": …}`
`dlmObjectId` | **string** | Object ID in the german digital landscape model (DLM) associated with this entity. | `DEBKGDL200000FCY`
