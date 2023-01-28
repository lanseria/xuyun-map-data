import path from 'node:path'
import { DATA_NAME, GEOJSON_EXT, GPX_EXT, JSON_EXT, POINTS_NAME, RAW_NAME, ROOT_DIR } from './constant'
import type { RouteItem } from './types'

export const getRouteDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data')
export const getRoutePointsDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data', 'points')
export const getRouteGpxDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data', 'gpx')
export const getRouteRawGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'raw')

export const getRouteDirname = (route: RouteItem) => `${route.dateRange.join('-')}-${route.value}`

export const getRouteGeoJSON = (route: string) => path.resolve(ROOT_DIR, route, 'data', POINTS_NAME + GEOJSON_EXT)
// new
export const getValueRawValueJson = (value: string, dataValueFile: string) =>
  path.resolve(value, RAW_NAME, dataValueFile + JSON_EXT)

export const getValueVideoJson = (value: string) =>
  path.resolve(value, `video${JSON_EXT}`)

export const getValueRawDir = (value: string) => {
  return path.resolve(value, RAW_NAME)
}

export const getValueDataGpxValueGpx = (value: string, dataValueFile: string) => {
  return path.resolve(value, DATA_NAME, 'gpx', dataValueFile + GPX_EXT)
}
export const getValueDataGpxValueGeojson = (value: string, dataValueFile: string) => {
  return path.resolve(value, DATA_NAME, 'gpx', dataValueFile + GEOJSON_EXT)
}
