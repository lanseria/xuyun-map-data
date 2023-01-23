export interface PointFeatureProp {
  id: string
  name: string
  date: string
  time: string
  icon: string
  vid: string
  vName: string
  vt: number
}

export interface RawItemData {
  name: string
  date: string
  time: string
  type: 'bicycle' | 'campsite'
  coordinates: [number, number]
  vTime: number
}

export interface RawData {
  vid: string
  vDate: string
  vName: string
  vClips: RawItemData[]
}
