import path from 'node:path'
import { GEOJSON_EXT, POINTS_NAME, ROOT_DIR } from './constant'
import type { RouteItem } from './types'

export const getRouteDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data')
export const getRoutePointsDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data', 'points')
export const getRouteGpxDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data', 'gpx')
export const getRouteRawGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'raw')

export const getRouteDirname = (route: RouteItem) => `${route.dateRange.join('-')}-${route.value}`

export const getRouteGeoJSON = (route: string) => path.resolve(ROOT_DIR, route, 'data', POINTS_NAME + GEOJSON_EXT)
