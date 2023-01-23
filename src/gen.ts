import path from 'node:path'
import fs from 'node:fs/promises'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import { DATA_NAME, GEOJSON_EXT, JSON_EXT, POINTS_NAME, RAW_NAME, ROUTE_LIST } from './constant'
import { getRouteDirname } from './utils'
import type { PointFeature, RawData } from './types'

export const genGeojson = async () => {
  for await (const route of ROUTE_LIST) {
    const dirname = getRouteDirname(route)

    const RAW_ROOT_DIR = path.resolve(`./${dirname}/${RAW_NAME}`)
    const DATA_ROOT_DIR = path.resolve(`./${dirname}/${DATA_NAME}`)
    const videosFilename = await fs
      .readdir(RAW_ROOT_DIR)
    // 如何为空，则跳过
    if (videosFilename.length === 0)
      continue

    const videosJsonFilename = videosFilename.filter(filename => filename.endsWith(JSON_EXT))
    const allPointList: PointFeature[] = []
    for await (const filename of videosJsonFilename) {
      const jsonData = await fs.readFile(path.resolve(RAW_ROOT_DIR, filename), {
        encoding: 'utf-8',
      })
      const data: RawData = JSON.parse(jsonData)
      const pointList: PointFeature[] = []
      data.vClips.forEach((clip) => {
        pointList.push(turf.point(clip.coordinates, {
          id: nanoid(),
          name: clip.name,
          date: clip.date,
          time: clip.time,
          icon: clip.type,
          vid: data.vid,
          vName: data.vName,
          vt: clip.vTime,
          vDate: data.vDate,
        }))
      })

      const pointFeatureCollection = turf.featureCollection(pointList)
      allPointList.push(...pointList)
      const writeData = JSON.stringify(pointFeatureCollection, null, 2)
      await fs.writeFile(path.resolve(DATA_ROOT_DIR, 'points', filename), writeData)
    }

    const allpointsFeatureCollection = turf.featureCollection(allPointList)

    const writeData = JSON.stringify(allpointsFeatureCollection)
    await fs.writeFile(path.resolve(DATA_ROOT_DIR, `${POINTS_NAME}${GEOJSON_EXT}`), writeData)
  }
}

genGeojson()
