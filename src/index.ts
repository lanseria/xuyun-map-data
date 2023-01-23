import fs from 'node:fs/promises'
import path from 'node:path'
import type { Feature, Point } from '@turf/turf'
import { nanoid } from 'nanoid'
import * as turf from '@turf/turf'
import type { PointFeatureProp, RawData } from './types'

const TEMP_DIR = '2212-2303-dongbei'

const JSON_EXT = '.json'
const RAW_NAME = 'raw'
const DATA_NAME = 'data'
const RAW_ROOT_DIR = path.resolve(`./${TEMP_DIR}/${RAW_NAME}`)
const DATA_ROOT_DIR = path.resolve(`./${TEMP_DIR}/${DATA_NAME}`)

const videosFilename = await fs
  .readdir(RAW_ROOT_DIR)

const videosJsonFilename = videosFilename.filter(filename => filename.endsWith(JSON_EXT))

// console.log(videosJsonFilename)

const allPointList: Feature<Point, PointFeatureProp>[] = []

for await (const filename of videosJsonFilename) {
  const jsonData = await fs.readFile(path.resolve(RAW_ROOT_DIR, filename), {
    encoding: 'utf-8',
  })
  const data: RawData = JSON.parse(jsonData)
  const pointList: Feature<Point, PointFeatureProp>[] = []
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
    }))
  })

  const pointFeatureCollection = turf.featureCollection(pointList)
  allPointList.push(...pointList)
  const writeData = JSON.stringify(pointFeatureCollection, null, 2)
  await fs.writeFile(path.resolve(DATA_ROOT_DIR, 'points', filename), writeData)
}

const allpointsFeatureCollection = turf.featureCollection(allPointList)

const writeData = JSON.stringify(allpointsFeatureCollection)
await fs.writeFile(path.resolve(DATA_ROOT_DIR, 'all-points.geojson'), writeData)

// TODO temp transform
// const TEMP_RAW_ROOT_DIR = path.resolve('./5-dongbei/temp_raw')
// const allRawData = await fs.readFile(path.resolve(DATA_ROOT_DIR, '202212-202301.geojson'), { encoding: 'utf-8' })
// const allData: FeatureCollection<Point, PointFeatureProp> = JSON.parse(allRawData)

// const allVideoData = await fs.readFile(path.resolve(DATA_ROOT_DIR, 'video.json'), { encoding: 'utf-8' })
// const allVideos: any = JSON.parse(allVideoData)
// // console.log(allData, allVideos)

// allVideos.videos.forEach(async (item: any) => {
//   const filename = `${item.date}.json`
//   const vid = item.id
//   const rawItemData: RawItemData[] = allData.features.filter((it) => {
//     return it.properties.vid === vid
//   }).map((it) => {
//     return {
//       name: it.properties.name,
//       date: it.properties.date,
//       time: it.properties.time,
//       type: it.properties.icon,
//       coordinates: it.geometry.coordinates,
//       vTime: it.properties.vt || 0,
//     }
//   })
//   const rawData: RawData = {
//     vid,
//     vDate: item.date,
//     vName: item.name,
//     vClips: rawItemData,
//   }

//   await fs.writeFile(path.resolve(TEMP_RAW_ROOT_DIR, filename), JSON.stringify(rawData, null, 2))
// })
