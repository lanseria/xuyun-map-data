import fs from 'node:fs/promises'
import path from 'node:path'
import dayjs from 'dayjs'
import chalk from 'chalk'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { ROOT_DIR, ROUTE_LIST } from './constant'
import { getRouteDirname, getRouteGeoJSON } from './utils'
import type { RouteItem } from './types'

dayjs.extend(utc)
dayjs.extend(timezone)

const readme = path.resolve(ROOT_DIR, 'README.md')
let readmeContent = await fs.readFile(readme, 'utf8')

const isCounterMatched = (route: RouteItem, count: number) => {
  // match the number before the cityname e.g. [北京 (35)](beijing.geojson)
  // the inner `(` is for regexp grouping
  const dirname = getRouteDirname(route)
  const arr = readmeContent.match(`\\((\\d+)\\)\\]\\(${dirname}`)
  // console.log(arr)
  if (!arr)
    return false
  return parseInt(arr[1], 10) === count
}

const updateReadmeContent = (route: RouteItem, newNumber: number) => {
  const dirname = getRouteDirname(route)
  const re = new RegExp(`(.*)\\((\\d+)\\)\\]\\((${dirname})`)
  // console.log(re)
  readmeContent = readmeContent.replace(re, `$1(${newNumber})]($3`)

  const reDate = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/
  const time = dayjs().tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm:ss')
  readmeContent = readmeContent.replace(reDate, time)
}

export const lint = async () => {
  for await (const route of ROUTE_LIST) {
    const dirname = getRouteDirname(route)
    const sourceFilepath = getRouteGeoJSON(dirname)
    const json = await fs.readFile(sourceFilepath, { encoding: 'utf-8' })
    const points = JSON.parse(json)
    const count = points.features.length
    const routeValue = route.value
    if (count === 0)
      continue
    if (!isCounterMatched(route, count)) {
      // eslint-disable-next-line no-console
      console.log(
        chalk.red('Found inconsistent number: city = %s, newNum = %d'),
        routeValue,
        count,
      )
      updateReadmeContent(route, count)
    }
  }

  // eslint-disable-next-line no-console
  console.log(chalk.magenta('Updating README.md, don’t forget to commit it!'))
  await fs.writeFile(readme, readmeContent)
}

lint()
