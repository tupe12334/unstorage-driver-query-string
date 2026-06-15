import type { QueryStringDriverOptions } from './types.js'
import type { UrlManager } from './url-manager-interface.js'
import { stringifyData } from './query-stringifier.js'
import { parseQueryString } from './query-parser.js'
import { set } from 'es-toolkit/compat'

export function createUrlUpdater(
  urlManager: UrlManager,
  options: QueryStringDriverOptions
) {
  const {
    base = '',
    updateHistory = true,
    historyMethod = 'pushState',
    maxUrlLength = 2000
  } = options

  return (data: Record<string, unknown>): void => {
    const currentUrl = urlManager.getUrl()
    const newUrl = new URL(currentUrl)

    let queryData: Record<string, unknown>
    if (base) {
      const existingData = parseQueryString(currentUrl.search.slice(1))
      queryData = set({ ...existingData }, base, data)
    } else {
      queryData = data
    }

    const queryString = stringifyData(queryData)
    newUrl.search = queryString ? `?${queryString}` : ''

    if (newUrl.href.length > maxUrlLength) {
      console.warn(`URL length (${newUrl.href.length}) exceeds maximum allowed (${maxUrlLength})`)
      return
    }

    urlManager.updateInternalUrl(newUrl)

    if (!options.url && typeof window !== 'undefined' && updateHistory) {
      if (historyMethod === 'pushState') {
        window.history.pushState(null, '', newUrl.href)
      } else {
        window.history.replaceState(null, '', newUrl.href)
      }
    }
  }
}