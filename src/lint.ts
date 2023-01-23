import fs from 'node:fs/promises'
import { ROUTE_LIST } from './constant'
import { getRouteGeoJSON } from './utils'

export const lint = async () => {
  for await (const route of ROUTE_LIST) {
    const dirname = `${route.dateRange.join('-')}-${route.value}`
    const sourceFilepath = getRouteGeoJSON(dirname)
    const json = await fs.readFile(sourceFilepath, { encoding: 'utf-8' })
    const points = JSON.parse(json)
    console.log(points.features.length)
    // if (!isCounterMatched(city, cafes.features.length)) {
    //   console.log(
    //     chalk.red('Found inconsistent number: city = %s, newNum = %d'),
    //     city,
    //     cafes.features.length,
    //   )
    //   updateReadmeContent(city, cafes.features.length)
    // }
  }
}

// lint()
