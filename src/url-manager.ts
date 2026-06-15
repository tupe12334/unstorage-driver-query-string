import type { QueryStringDriverOptions } from './types.js'
import type { UrlManager } from './url-manager-interface.js'
import { QueryStringDriverError } from './errors.js'
import isURL from 'validator/lib/isURL.js'
import invariant from 'tiny-invariant'

export function createUrlManager(options: QueryStringDriverOptions): UrlManager {
  const { url } = options
  let internalUrl: URL | null = null

  const getUrl = (): URL => {
    if (url) {
      if (internalUrl) return internalUrl

      // If it's a relative URL, we need a browser environment for the origin
      if (!isURL(url) && (typeof window === 'undefined' || !window.location)) {
        throw new QueryStringDriverError('Cannot resolve relative URL in non-browser environment')
      }

      try {
        if (isURL(url)) {
          internalUrl = new URL(url)
        } else {
          internalUrl = new URL(url, window.location.origin)
        }
        invariant(internalUrl, 'Failed to create URL')
        return internalUrl
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw new QueryStringDriverError(`Invalid URL: ${url} (${errorMessage})`, error)
      }
    }

    if (typeof window !== 'undefined') {
      if (internalUrl) return internalUrl
      return new URL(window.location.href)
    }

    throw new QueryStringDriverError('URL is required in non-browser environment')
  }

  const updateInternalUrl = (newUrl: URL): void => {
    if (url) {
      internalUrl = newUrl
    } else if (typeof window !== 'undefined') {
      // In browser environments without custom URL, we need to track the state
      // since window.location.href is read-only and cannot be reliably updated
      internalUrl = newUrl
    }
  }

  return { getUrl, updateInternalUrl }
}