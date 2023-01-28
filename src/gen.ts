import fs from 'node:fs/promises'
import { FORMAT_ROUTE_LIST } from './constant'
import type { RouteVideoItem } from './types'
import { genLastest } from './gen/lastest'
import { genRoutes } from './gen/routes'

// Gen 总路线循环程序
// 1. 将lastest.json复制到对应文件夹下
// 2. 循环FORMAT_ROUTE_LIST
// 3. 生成具有开始点与结束点还有各个路线的JSON文件
export const genGeojson = async () => {
  try {
    // 1. 将lastest.json复制到对应文件夹下
    await genLastest()
    const allRouteJson: RouteVideoItem[] = []
    // 2. 循环FORMAT_ROUTE_LIST
    for await (const route of FORMAT_ROUTE_LIST) {
      const newFormatRouteItem = await genRoutes(route)
      allRouteJson.push(newFormatRouteItem)
    }

    // gen all route video point json data
    await fs.writeFile('routes.json', JSON.stringify(allRouteJson))
  }
  catch (error) {
    console.warn('gen file error: ', error)
  }
}

genGeojson()
