import { parseQueryString } from './query-parser.js'
import { get, isPlainObject } from 'es-toolkit/compat'
import type { UrlManager } from './url-manager-interface.js'
import type { DataManager } from './data-manager-interface.js'

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value)
}

export function createDataManager(urlManager: UrlManager): DataManager {
  const getCurrentData = (base: string = ''): Record<string, unknown> => {
    const currentUrl = urlManager.getUrl()
    const queryString = currentUrl.search.slice(1)
    if (!queryString) return {}

    const allData = parseQueryString(queryString)
    if (!base) return allData

    const baseData = get(allData, base)
    if (isRecordObject(baseData)) {
      return baseData
    }
    return {}
  }

  return { getCurrentData }
}