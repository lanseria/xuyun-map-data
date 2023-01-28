import path from 'node:path'
import type { RouteItem } from './types'

export const ROOT_DIR = path.resolve('.')

export const POINTS_NAME = 'all-points'
export const VIDEOS_NAME = 'all-videos'

export const GEOJSON_EXT = '.geojson'
export const JSON_EXT = '.json'
export const GPX_EXT = '.gpx'

export const RAW_NAME = 'raw'
export const DATA_NAME = 'data'

export const ROUTE_LIST = [
  {
    name: '东北之行',
    value: 'dongbei',
    dateRange: [2212, 2303],
    url: '',
  },
  {
    name: '重返川西',
    value: 'chuanxi',
    dateRange: [2208, 2212],
    url: '',
  },
  {
    name: '遥远边疆',
    value: 'xinjiang',
    dateRange: [2205, 2208],
    url: '',
  },
  {
    name: '阿里尘与雪',
    value: 'ali',
    dateRange: [2202, 2205],
    url: '',
  },
  {
    name: '风雪川藏北',
    value: 'chuanzang',
    dateRange: [2112, 2202],
    url: '',
  },
  {
    name: '落魄江湖',
    value: 'first',
    dateRange: [2108, 2112],
    url: '',
  },
] satisfies RouteItem[]

export const FORMAT_ROUTE_LIST = ROUTE_LIST.map((item) => {
  return {
    ...item,
    value: `${item.dateRange.join('-')}-${item.value}`,
  }
})

export const LAST_ROUTE = '2212-2303-dongbei'
