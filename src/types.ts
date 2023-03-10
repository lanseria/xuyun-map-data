import type { Feature, LineString, Point } from '@turf/turf'

export interface PointFeatureProp {
  // 自动生成
  id: string
  // 切片点描述
  name: string
  // 切片点日期
  date: string
  // 切片点时间（大致）
  time: string
  // 类型
  type: 'bicycle' | 'campsite'
  // 自动生成
  icon: string
  // 视频ID
  vid: string
  // 视频名称
  vName: string
  // 视频切片秒数
  vt: number
  // 视频发布时间
  vDate: string
}

export interface RawItemData {
  // 切片点描述
  name: string
  // 切片点日期
  date: string
  // 切片点时间（大致）
  time: string
  type: 'bicycle' | 'campsite'
  // 切片点坐标（大致）
  coordinates: [number, number]
  // 切片点时间（大致）
  vTime: number
}

export interface RawData {
  // 视频ID
  vid: string
  // 视频发布时间
  vDate: string
  // 视频名称
  vName: string
  // 视频路程km
  vDistanceKm: number
  vClips: RawItemData[]
}

export interface VideoData {
  // 视频ID
  vid: string
  // 视频发布时间
  vDate: string
  // 视频名称
  vName: string
  // 视频路程km
  vDistanceKm: number
  vPointIds: string[]
  vLine?: LineFeature
}

export type StartEndPointFeature = Feature<Point, {
  'date': string
  'name': string
  'type': string
  'icon': string
}>

export interface RouteItem {
  label: string
  value: string
  dateRange: number[]
  url: string
}

export interface RouteVideoItem {
  uid: string
  sid: string
  name: string
  desc: string
  value: string
  date: string
  startEndPoints: StartEndPointFeature[]
}

export interface RouteVideoJsonItem extends RouteVideoItem, RouteItem {}

export type PointFeature = Feature<Point, PointFeatureProp>

export type LineFeature = Feature<LineString>
