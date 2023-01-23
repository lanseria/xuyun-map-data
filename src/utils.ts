import path from 'node:path'
import { GEOJSON_EXT, POINTS_NAME, ROOT_DIR } from './constant'

export const getRouteDataGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'data', '.gitkeep')
export const getRouteRawGitkeep = (route: string) => path.resolve(ROOT_DIR, route, 'raw', '.gitkeep')

export const getRouteGeoJSON = (route: string) => path.resolve(ROOT_DIR, route, 'data', POINTS_NAME + GEOJSON_EXT)
