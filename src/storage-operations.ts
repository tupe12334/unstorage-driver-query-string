import type { StorageValue, TransactionOptions, GetKeysOptions } from 'unstorage'
import type { DataManager } from './data-manager-interface.js'
import { QueryStringDriverError } from './errors.js'
import { get, set, has, omit, keys } from 'es-toolkit/compat'

function isStorageValue(value: unknown): value is StorageValue {
  return value === null ||
         typeof value === 'string' ||
         typeof value === 'number' ||
         typeof value === 'boolean' ||
         typeof value === 'object'
}

export function createStorageOperations(
  dataManager: DataManager,
  updateUrl: (data: Record<string, unknown>) => void,
  basePrefix: string
) {
  const operations = {
    hasItem: (key: string, _opts: TransactionOptions): boolean => {
      try {
        return has(dataManager.getCurrentData(basePrefix), key)
      } catch {
        return false
      }
    },

    getItem: (key: string, _opts?: TransactionOptions): StorageValue => {
      try {
        const data = dataManager.getCurrentData(basePrefix)
        const value = has(data, key) ? get(data, key, null) : null
        return isStorageValue(value) ? value : null
      } catch {
        return null
      }
    },

    getItemRaw: (key: string, opts: TransactionOptions): string | null => {
      const value = operations.getItem(key, opts)
      return value === null ? null : String(value)
    },

    setItem: (key: string, value: string, _opts: TransactionOptions): Promise<void> => {
      try {
        const data = dataManager.getCurrentData(basePrefix)
        const newData = value === null || value === undefined
          ? omit(data, key)
          : set({ ...data }, key, value)
        updateUrl(newData)
        return Promise.resolve()
      } catch (error) {
        throw new QueryStringDriverError(`Failed to set item: ${String(error)}`, error)
      }
    },

    removeItem: (key: string, _opts: TransactionOptions): Promise<void> => {
      try {
        const data = dataManager.getCurrentData(basePrefix)
        updateUrl(omit(data, key))
        return Promise.resolve()
      } catch (error) {
        throw new QueryStringDriverError(`Failed to remove item: ${String(error)}`, error)
      }
    },

    getKeys: (_base: string, _opts: GetKeysOptions): string[] => {
      try {
        return keys(dataManager.getCurrentData(basePrefix))
      } catch {
        return []
      }
    },

    clear: (_base: string, _opts: TransactionOptions): Promise<void> => {
      try {
        updateUrl({})
        return Promise.resolve()
      } catch (error) {
        throw new QueryStringDriverError(`Failed to clear storage: ${String(error)}`, error)
      }
    }
  }

  return operations
}