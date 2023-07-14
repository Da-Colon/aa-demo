/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheExpiry, type IStorageValue, keyInternal, CACHE_DEFAULTS } from "$lib/types/cache";
/**
 * Current database version. Must be an integer.
 *
 * The version number must be updated, and any conversion
 * work handled in onupgradeneeded if the structure of the
 * database changes in anyway.
 */
const DB_VERSION = 1;

/**
 * Database object keys.
 */
export enum DBObjectKeys {
  DECODED_TRANSACTIONS = 'DECODED_TRANSACTIONS',
}

/**
 * Helper function to create a promise-based wrapper for indexedDB.
 */
const withIndexedDB = (callback: (db: IDBDatabase) => Promise<any>) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('fractal', DB_VERSION);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;

      // Create an object store for each DBObjectKey
      for (const key in DBObjectKeys) {
        if (!db.objectStoreNames.contains(key)) {
          db.createObjectStore(key, { keyPath: 'key' });
        }
      }
    };

    openRequest.onsuccess = async () => {
      const db = openRequest.result;
      try {
        const result = await callback(db);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };
  });
};

export const setIndexedDBValue = async (
  objectStoreName: string,
  key: string,
  value: any,
  chainId: number,
  expirationMinutes: number = CacheExpiry.ONE_WEEK
): Promise<void> => {
  const val: IStorageValue = {
    v: value,
    e:
      expirationMinutes === CacheExpiry.NEVER
        ? CacheExpiry.NEVER
        : Date.now() + expirationMinutes * 60000,
  };

  await withIndexedDB(async db => {
    let transaction: IDBTransaction, store: IDBObjectStore;
    try {
      transaction = db.transaction(objectStoreName, 'readwrite');
      store = transaction.objectStore(objectStoreName);
    } catch (e) {
      return;
    }
    store.put({ key: keyInternal(chainId, key), value: val });
  });
};

export const getIndexedDBValue = async (
  storeKey: string,
  key: string,
  chainId: number
): Promise<any> => {
  return withIndexedDB(async db => {
    let transaction: IDBTransaction, store: IDBObjectStore, request: IDBRequest<any>;

    try {
      transaction = db.transaction(storeKey, 'readonly');
      store = transaction.objectStore(storeKey);
      request = store.get(keyInternal(chainId, key));
    } catch (e) {
      return Promise.reject(e);
    }

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;

        if (result) {
          const parsed: IStorageValue = result.value;
          if (parsed.e === CacheExpiry.NEVER) {
            resolve(parsed.v);
          } else {
            if (parsed.e < Date.now()) {
              setIndexedDBValue(storeKey, key, null, chainId, CacheExpiry.NEVER);
              resolve(null);
            } else {
              resolve(parsed.v);
            }
          }
        } else if (CACHE_DEFAULTS[key]) {
          resolve(CACHE_DEFAULTS[key]);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  });
};