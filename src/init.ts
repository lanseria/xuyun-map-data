import fs from 'node:fs/promises'
import * as turf from '@turf/turf'
import { getRouteDataGitkeep, getRouteGeoJSON, getRouteRawGitkeep } from './utils'
import { ROUTE_LIST } from './constant'

export const initGeojsonFile = async () => {
  for await (const route of ROUTE_LIST) {
    const dirname = `${route.dateRange.join('-')}-${route.value}`
    const sourceFilepath = getRouteGeoJSON(dirname)
    const initFeatureCollection = turf.featureCollection([])
    await fs.writeFile(sourceFilepath, JSON.stringify(initFeatureCollection))

    const dataGitkeep = getRouteDataGitkeep(dirname)
    await fs.writeFile(dataGitkeep, '')

    const rawGitkeep = getRouteRawGitkeep(dirname)
    await fs.writeFile(rawGitkeep, '')
  }
}

initGeojsonFile()
