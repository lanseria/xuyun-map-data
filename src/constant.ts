import path from 'node:path'

export const ROOT_DIR = path.resolve('.')

export const POINTS_NAME = 'all-points'

export const GEOJSON_EXT = '.geojson'

export const ROUTE_LIST = [
  {
    label: '东北',
    value: 'dongbei',
    dateRange: [2212, 2303],
    url: '',
  },
  {
    label: '重返川西',
    value: 'chuanxi',
    dateRange: [2208, 2212],
    url: 'https://space.bilibili.com/697166795/channel/collectiondetail?sid=947506',
  },
  {
    label: '遥远边疆',
    value: 'xinjiang',
    dateRange: [2205, 2208],
    url: 'https://space.bilibili.com/697166795/channel/collectiondetail?sid=947480',
  },
  {
    label: '阿里尘与雪',
    value: 'ali',
    dateRange: [2202, 2205],
    url: 'https://space.bilibili.com/697166795/channel/collectiondetail?sid=946665',
  },
  {
    label: '风雪川藏北',
    value: 'chuanzang',
    dateRange: [2112, 2202],
    url: 'https://space.bilibili.com/697166795/channel/collectiondetail?sid=946626',
  },
  {
    label: '落魄江湖',
    value: 'first',
    dateRange: [2108, 2112],
    url: 'https://space.bilibili.com/697166795/channel/collectiondetail?sid=946593',
  },
]
