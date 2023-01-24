import fs from 'node:fs/promises'
import path from 'node:path'
import * as turf from '@turf/turf'
import { getRouteDataGitkeep, getRouteDirname, getRouteGeoJSON, getRouteGpxDataGitkeep, getRoutePointsDataGitkeep, getRouteRawGitkeep } from './utils'
import { ROUTE_LIST } from './constant'

const initDirKeep = (dirname: string) => {
  return fs.access(dirname, fs.constants.F_OK).then(() => {

  }).catch(async () => {
    await fs.mkdir(dirname)
    await fs.writeFile(path.resolve(dirname, '.gitkeep'), '')
  })
}

export const initGeojsonFile = async () => {
  for await (const route of ROUTE_LIST) {
    const dirname = getRouteDirname(route)
    const sourceFilepath = getRouteGeoJSON(dirname)
    const initFeatureCollection = turf.featureCollection([])
    await fs.writeFile(sourceFilepath, JSON.stringify(initFeatureCollection))

    const dataGitkeep = getRouteDataGitkeep(dirname)
    await initDirKeep(dataGitkeep)

    const pointDataGitkeep = getRoutePointsDataGitkeep(dirname)
    await initDirKeep(pointDataGitkeep)

    const gpxDataGitkeep = getRouteGpxDataGitkeep(dirname)
    await initDirKeep(gpxDataGitkeep)

    const rawGitkeep = getRouteRawGitkeep(dirname)
    await initDirKeep(rawGitkeep)
  }
}

initGeojsonFile()
