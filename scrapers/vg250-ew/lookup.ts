import { either } from 'fp-ts'
import * as t from 'io-ts'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { loadJsonFile } from 'load-json-file'

const esmDirname = dirname(fileURLToPath(import.meta.url))
const dataDirName = resolve(esmDirname, './data/')

const keyMap = new Map<string, string>()
await (async () => {
  const content = await loadJsonFile(resolve(dataDirName, 'output.json'))
  const validation = t.array(t.intersection([t.strict({ arsId: t.string }), t.partial({ agsId: t.string })])).decode(content)
  if (!either.isRight(validation)) throw new Error('file does not match schema: output.json')
  validation.right.forEach(({ arsId, agsId }) => {
    if (agsId === undefined) return
    const existing = keyMap.get(agsId)
    if (existing !== undefined && existing !== arsId) throw new Error(`unexpected: multiple different arsId found for agsId ${agsId}: ${existing}, ${arsId}.`)
    keyMap.set(agsId, arsId)
  })
})()

process.stdout.write(JSON.stringify(Object.fromEntries(keyMap.entries()), null, 2))
