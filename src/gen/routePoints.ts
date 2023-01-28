import fs from 'node:fs/promises'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import type { PointFeature, RawData, RouteVideoItem, VideoData } from '../types'
import { getValueRawValueJson } from '../utils'

export const genRoutePoints = async (routeItem: RouteVideoItem, date: string): Promise<[
  PointFeature[], VideoData,
]> => {
  const videoFilepath = getValueRawValueJson(routeItem.value, date)
  const json = await fs.readFile(videoFilepath, {
    encoding: 'utf-8',
  })
  const data: RawData = JSON.parse(json)
  const pointList: PointFeature[] = []
  data.vClips.forEach((clip) => {
    pointList.push(turf.point(clip.coordinates, {
      rValue: routeItem.value,
      id: nanoid(),
      name: clip.name,
      date: clip.date,
      time: clip.time,
      type: clip.type,
      icon: `${clip.type}1`,
      vid: data.vid,
      vName: data.vName,
      vt: clip.vTime,
      vDate: data.vDate,
    }))
  })
  const videoData = {

    vid: data.vid,
    vDate: data.vDate,
    vName: data.vName,
    vDistanceKm: data.vDistanceKm,
  }
  return [pointList, videoData]
}
