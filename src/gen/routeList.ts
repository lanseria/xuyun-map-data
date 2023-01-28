import fs from 'node:fs/promises'
import { JSON_EXT } from '../constant'
import type { LineFeature, PointFeature, RouteVideoItem, StartEndPointFeature, VideoData } from '../types'
import { getValueRawDir } from '../utils'
import { genGeojsonByGpx, genRestGeojsonByGpx } from './gpxToGeojson'
import { genRoutePoints } from './routePoints'
/**
 * 解析出所有线路与兴趣点，视频列表
 * @param {RouteVideoItem} routeItem
 * @returns {Promise<[Array<LineFeature | PointFeature | StartEndPointFeature>, VideoData[]]>}
 */
export const genRouteList = async (routeItem: RouteVideoItem): Promise<[Array<LineFeature | PointFeature | StartEndPointFeature>, VideoData[]]> => {
  const dirPath = getValueRawDir(routeItem.value)
  // console.log('dirPath: ', dirPath)
  const videosFilename = await fs
    .readdir(dirPath)
  // console.log('videosFilename: ', videosFilename)
  const videoFeatureList: Array<LineFeature | PointFeature | StartEndPointFeature> = []
  const videoDataList: VideoData[] = []
  //
  const filterVideoDates = videosFilename
    .filter(filename => filename.endsWith(JSON_EXT))
    .map(str => str.replace(JSON_EXT, ''))
  for await (const date of filterVideoDates) {
    const [videoPointList, videoData] = await genRoutePoints(routeItem, date)
    const videoLine = await genGeojsonByGpx(routeItem, videoData)
    videoLine && videoFeatureList.push(videoLine)
    videoFeatureList.push(...videoPointList)
    videoDataList.push(videoData)
  }

  const routeRestLine = await genRestGeojsonByGpx(routeItem)
  routeRestLine && videoFeatureList.push(routeRestLine)

  return [videoFeatureList, videoDataList]
}
