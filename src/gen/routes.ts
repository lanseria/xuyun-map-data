import fs from 'node:fs/promises'
import * as turf from '@turf/turf'
import type { RouteItem, RouteVideoItem, StartEndPointFeature, StartEndPointFeatureProp } from '../types'
import { getValueVideoJson } from '../utils'
import { genRouteList } from './routeList'

/**
 * 生成每个 routeItem
 * @param {RouteItem} routeItem
 * @returns {Promise<RouteVideoItem>}
 */
export const genRoutes = async (routeItem: RouteItem): Promise<RouteVideoItem> => {
  // 拿到每个routeItem的视频 video.json 进行解析
  const filePath = getValueVideoJson(routeItem.value)
  // console.log('genRoutes filePath: ', filePath)
  const routeItemVideoJson = await fs.readFile(filePath, { encoding: 'utf-8' })
  const routeItemVideoData: RouteVideoItem = {
    ...JSON.parse(routeItemVideoJson),
    ...routeItem,
  }
  //  解析出所有线路与兴趣点，视频列表
  const [featureList, videoList] = await genRouteList(routeItemVideoData)
  routeItemVideoData.startEndPoints.forEach((item, idx) => {
    const icons = ['start', 'end']
    const pointFeature: StartEndPointFeature = turf.point(item.coordinates, {
      rValue: routeItem.value,
      type: 'flag',
      icon: icons[idx],
      name: item.name,
      date: item.date,
    } as StartEndPointFeatureProp)
    featureList.push(pointFeature)
  })
  routeItemVideoData.featureList = featureList
  routeItemVideoData.videoList = videoList

  return routeItemVideoData
}
