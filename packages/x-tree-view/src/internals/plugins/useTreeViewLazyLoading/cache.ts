import { TreeViewItemMeta } from '../../models';

type TreeViewDataSourceCacheDefaultConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300000 (5 minutes)
   */
  ttl?: number;
};

export interface TreeViewDataSourceCache {
  /**
   * Set the cache entry for the given key.
   * @param {string} key The key of type `string`
   * @param {TreeViewItemMeta[]} value The value to be stored in the cache
   */
  set: (key: string, value: TreeViewItemMeta[]) => void;
  /**
   * Get the cache entry for the given key.
   * @param {string} key The key of type `string`
   * @returns {TreeViewItemMeta[]} The value stored in the cache
   */
  get: (key: string) => TreeViewItemMeta[] | undefined;
  /**
   * Clear the cache.
   */
  clear: () => void;
}

export class TreeViewDataSourceCacheDefault {
  private cache: Record<string, { value: TreeViewItemMeta[]; expiry: number }>;

  private ttl: number;

  constructor({ ttl = 300000 }: TreeViewDataSourceCacheDefaultConfig) {
    this.cache = {};
    this.ttl = ttl;
  }

  set(key: string, value: TreeViewItemMeta[]) {
    const expiry = Date.now() + this.ttl;
    this.cache[key] = { value, expiry };
  }

  get(key: string): TreeViewItemMeta[] | undefined {
    const entry = this.cache[key];
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiry) {
      delete this.cache[key];
      return undefined;
    }
    return entry.value;
  }

  clear() {
    this.cache = {};
  }
}
