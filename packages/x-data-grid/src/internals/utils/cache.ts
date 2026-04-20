import { getKeyDefault } from '../../hooks/features/dataSource/cache';
import type { GridGetRowsParams, GridGetRowsResponse } from '../../models/gridDataSource';

export class TestCache {
  private cache: Map<string, GridGetRowsResponse>;

  constructor() {
    this.cache = new Map();
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    this.cache.set(getKeyDefault(key), value);
  }

  get(key: GridGetRowsParams) {
    return this.cache.get(getKeyDefault(key));
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}
