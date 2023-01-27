import path from 'node:path'
import fs from 'node:fs/promises'
import * as turf from '@turf/turf'
import { nanoid } from 'nanoid'
import tj from '@mapbox/togeojson'
import { DOMParser } from 'xmldom'
import type { Feature, FeatureCollection, LineString } from '@turf/turf'
import { DATA_NAME, GEOJSON_EXT, GPX_EXT, JSON_EXT, LAST_ROUTE, POINTS_NAME, RAW_NAME, ROUTE_LIST, VIDEOS_NAME } from './constant'
import { getRouteDirname } from './utils'
import type { PointFeature, RawData, RouteVideoItem, RouteVideoJsonItem, VideoData } from './types'

const gpxToGeojson = async (dataDirPath: string) => {
  const gpxDir = path.resolve(dataDirPath, 'gpx')
  const gpxFilename = await fs
    .readdir(gpxDir)

  const gpxXmlFilename = gpxFilename.filter(filename => filename.endsWith(GPX_EXT))
  for await (const filename of gpxXmlFilename) {
    const data = await fs.readFile(path.resolve(gpxDir, filename), 'utf-8')
    const gpx = new DOMParser().parseFromString(data)

    // const converted = tj.gpx(gpx)
    const convertedWithStyles = tj.gpx(gpx, { styles: true })
    // console.log(convertedWithStyles)
    const saveGeojsonPath = path.resolve(gpxDir, filename.replace('.gpx', '.geojson'))
    await fs.writeFile(saveGeojsonPath, JSON.stringify(convertedWithStyles))
  }
}

const videoLineGen = async (rootDirpath: string, videoItem: RawData, multiPoint: [number, number][]): Promise<Feature<LineString> | undefined> => {
  if (videoItem.vDistanceKm) {
    const gpxFilenamePath = path.resolve(rootDirpath, 'gpx', videoItem.vDate + GEOJSON_EXT)
    const data = await fs.readFile(gpxFilenamePath, 'utf-8')
    const geojson: FeatureCollection<LineString> = JSON.parse(data)
    return geojson.features[0]
  }
  else {
    return multiPoint.length >= 2 ? turf.lineString(multiPoint) : undefined
  }
}

export const getRouteJsonData = async (dirname: string) => {
  const routeVideoJsonPath = path.resolve(dirname, 'video.json')
  const routeVideoJson = await fs.readFile(routeVideoJsonPath, { encoding: 'utf-8' })
  return JSON.parse(routeVideoJson) satisfies RouteVideoItem
}

export const genGeojson = async () => {
  const lastestJson = await fs.readFile('./lastest.json', { encoding: 'utf-8' })
  const lastestData: RawData = JSON.parse(lastestJson)
  const lastestRoute = ROUTE_LIST.find(route => route.value === LAST_ROUTE)
  if (!lastestRoute)
    throw new Error('没有找到最新路线')
  const dirname = getRouteDirname(lastestRoute)
  await fs.writeFile(path.resolve(dirname, RAW_NAME, lastestData.vDate + JSON_EXT), lastestJson)

  const allRouteJson: RouteVideoJsonItem[] = []
  // 循环
  for await (const route of ROUTE_LIST) {
    const dirname = getRouteDirname(route)

    const RAW_ROOT_DIR = path.resolve(`./${dirname}/${RAW_NAME}`)
    const DATA_ROOT_DIR = path.resolve(`./${dirname}/${DATA_NAME}`)

    const vJsonData = await getRouteJsonData(dirname)
    // 填充 all route
    allRouteJson.push({
      ...route,
      ...vJsonData,
      value: `${vJsonData.date}-${route.value}`,
    })
    const videosFilename = await fs
      .readdir(RAW_ROOT_DIR)
    // 如何 Raw 为空，则跳过
    if (videosFilename.length === 0)
      continue

    // gpxToGeojson
    await gpxToGeojson(DATA_ROOT_DIR)

    const videosJsonFilename = videosFilename.filter(filename => filename.endsWith(JSON_EXT))
    const allPointList: PointFeature[] = []
    const allVideoList: VideoData[] = []
    for await (const filename of videosJsonFilename) {
      const jsonData = await fs.readFile(path.resolve(RAW_ROOT_DIR, filename), {
        encoding: 'utf-8',
      })
      const data: RawData = JSON.parse(jsonData)
      const pointList: PointFeature[] = []
      const multiPoint: [number, number][] = []
      data.vClips.forEach((clip) => {
        multiPoint.push(clip.coordinates)
        pointList.push(turf.point(clip.coordinates, {
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
      const routeLineGeojsonData = await videoLineGen(DATA_ROOT_DIR, data, multiPoint)
      //
      allVideoList.push({
        vid: data.vid,
        vDate: data.vDate,
        vName: data.vName,
        vDistanceKm: data.vDistanceKm,
        vPointIds: pointList.map(i => i.properties.id),
        vLine: routeLineGeojsonData,
      })

      const pointFeatureCollection = turf.featureCollection(pointList)
      allPointList.push(...pointList)
      const writeData = JSON.stringify(pointFeatureCollection, null, 2)
      await fs.writeFile(path.resolve(DATA_ROOT_DIR, 'points', filename), writeData)
    }

    const allpointsFeatureCollection = turf.featureCollection(allPointList)

    const writeData = JSON.stringify(allpointsFeatureCollection)
    await fs.writeFile(path.resolve(DATA_ROOT_DIR, `${POINTS_NAME}${GEOJSON_EXT}`), writeData)

    // 生成视频列表
    const writeVideoData = JSON.stringify(allVideoList)
    await fs.writeFile(path.resolve(DATA_ROOT_DIR, `${VIDEOS_NAME}${JSON_EXT}`), writeVideoData)
  }

  // gen all route video point json data
  await fs.writeFile('routes.json', JSON.stringify(allRouteJson))
}

genGeojson()
