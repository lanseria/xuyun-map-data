import fs from 'node:fs/promises'
import path from 'node:path'
import type { Feature, Point } from '@turf/turf'
import { nanoid } from 'nanoid'
import * as turf from '@turf/turf'
import type { PointFeatureProp, RawData } from './types'
import { DATA_NAME, GEOJSON_EXT, JSON_EXT, POINTS_NAME, RAW_NAME } from './constant'

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
