import fs from 'node:fs/promises'
import type { RawData } from '../types'
import { getValueRawValueJson } from '../utils'
import { FORMAT_ROUTE_LIST, LAST_ROUTE } from '../constant'

export const genLastest = async () => {
  const lastestJson = await fs.readFile('./lastest.json', { encoding: 'utf-8' })
  const lastestData: RawData = JSON.parse(lastestJson)
  const lastestRoute = FORMAT_ROUTE_LIST.find(route => route.value === LAST_ROUTE)
  if (!lastestRoute)
    throw new Error('没有找到最新路线')
  // TODO: 代替换方法名称 getRouteDirname => getValueRawValueJson
  // TODO: 代替换方法名称 getRouteDirname => getValueDataGpxValueGpx
  // const dirname = getRouteDirname(lastestRoute)
  // await fs.writeFile(path.resolve(dirname, RAW_NAME, lastestData.vDate + JSON_EXT), lastestJson)
  const filePath = getValueRawValueJson(lastestRoute.value, lastestData.vDate)
  await fs.writeFile(filePath, lastestJson)
}
