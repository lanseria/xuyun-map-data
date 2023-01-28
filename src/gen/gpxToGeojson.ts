import fs from 'node:fs/promises'
import { DOMParser } from 'xmldom'
import tj from '@mapbox/togeojson'
import type { LineFeature, LineFeatureProp, RouteVideoItem, VideoData } from '../types'
import { getValueDataGpxValueGeojson, getValueDataGpxValueGpx } from '../utils'

const genGeojsonFromGpx = async (date: string, lineProp: LineFeatureProp) => {
  const gpxFilepath = getValueDataGpxValueGpx(lineProp.rValue, date)
  const data = await fs.readFile(gpxFilepath, 'utf-8')
  const gpx = new DOMParser().parseFromString(data)

  const convertedWithStyles = tj.gpx(gpx)
  convertedWithStyles.features[0].properties = lineProp
  const saveGeojsonPath = getValueDataGpxValueGeojson(lineProp.rValue, date)
  await fs.writeFile(saveGeojsonPath, JSON.stringify(convertedWithStyles))
  return convertedWithStyles
}

export const genGeojsonByGpx = async (routeItem: RouteVideoItem, videoData: VideoData): Promise<LineFeature> => {
  const colorArray = ['#be185d', '#be123c', '#b91c1c', '#c2410c', '#b45309', '#b45309', '#4d7c0f', '#047857', '#0f766e', '#0e7490', '#0369a1', '#1d4ed8', '#4338ca', '#6d28d9', '#6d28d9', '#a21caf']

  return genGeojsonFromGpx(videoData.vDate, {
    type: 'finish',
    color: colorArray[0],
    rValue: routeItem.value,
    vid: videoData.vid,
    vDate: videoData.vDate,
    vName: videoData.vName,
    vDistanceKm: videoData.vDistanceKm,
  })
}

export const genRestGeojsonByGpx = async (routeItem: RouteVideoItem) => {
  return genGeojsonFromGpx('rest', {
    rValue: routeItem.value,
    type: 'rest',
    color: 'gray',
    vid: '',
    vDate: '',
    vName: '',
    vDistanceKm: 0,
  })
}
