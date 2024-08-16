import { GridGetRowsParams, GridGetRowsResponse } from '../../../models';

export type GridDataSourceCacheDefaultConfig = {
  /**
   * Time To Live for each cache entry in milliseconds.
   * After this time the cache entry will become stale and the next query will result in cache miss.
   * @default 300000 (5 minutes)
   */
  ttl?: number;
  /**
   * The number of rows to store in each cache entry. If not set, the whole array will be stored in a single cache entry.
   * Setting this value to smallest page size will result in better cache hit rate.
   * Has no effect if cursor pagination is used.
   * @default undefined
   */
  chunkSize?: number;
};

function getKey(params: GridGetRowsParams) {
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.groupKeys,
    params.groupFields,
    params.start,
    params.end,
  ]);
}

export class GridDataSourceCacheDefault {
  private cache: Record<
    string,
    {
      value: GridGetRowsResponse;
      expiry: number;
      chunk: { startIndex: string | number; endIndex: number };
    }
  >;

  private ttl: number;

  private chunkSize: number;

  private getChunkRanges = (params: GridGetRowsParams) => {
    if (this.chunkSize < 1 || typeof params.start !== 'number') {
      return [{ startIndex: params.start, endIndex: params.end }];
    }

    // split the range into chunks
    const chunkRanges = [];
    for (let i = params.start; i < params.end; i += this.chunkSize) {
      const endIndex = Math.min(i + this.chunkSize - 1, params.end);
      chunkRanges.push({ startIndex: i, endIndex });
    }

    return chunkRanges;
  };

  constructor({ chunkSize, ttl = 300000 }: GridDataSourceCacheDefaultConfig) {
    this.cache = {};
    this.ttl = ttl;
    this.chunkSize = chunkSize || 0;
  }

  set(key: GridGetRowsParams, value: GridGetRowsResponse) {
    const chunks = this.getChunkRanges(key);
    const expiry = Date.now() + this.ttl;

    chunks.forEach((chunk) => {
      const isLastChunk = chunk.endIndex === key.end;
      const keyString = getKey({ ...key, start: chunk.startIndex, end: chunk.endIndex });
      const chunkValue: GridGetRowsResponse = {
        ...value,
        pageInfo: {
          ...value.pageInfo,
          // If the original response had page info, update that information for all but last chunk and keep the original value for the last chunk
          hasNextPage:
            (value.pageInfo?.hasNextPage !== undefined && !isLastChunk) ||
            value.pageInfo?.hasNextPage,
          nextCursor:
            value.pageInfo?.nextCursor !== undefined && !isLastChunk
              ? value.rows[chunk.endIndex + 1].id
              : value.pageInfo?.nextCursor,
        },
        rows:
          typeof chunk.startIndex !== 'number' || typeof key.start !== 'number'
            ? value.rows
            : value.rows.slice(chunk.startIndex - key.start, chunk.endIndex - key.start + 1),
      };

      this.cache[keyString] = { value: chunkValue, expiry, chunk };
    });
  }

  get(key: GridGetRowsParams): GridGetRowsResponse | undefined {
    const chunks = this.getChunkRanges(key);

    const startChunk = chunks.findIndex((chunk) => chunk.startIndex === key.start);
    const endChunk = chunks.findIndex((chunk) => chunk.endIndex === key.end);

    // If desired range cannot fit completely in chunks, then it is a cache miss
    if (startChunk === -1 || endChunk === -1) {
      return undefined;
    }

    const cachedResponses = [];

    for (let i = startChunk; i <= endChunk; i += 1) {
      const keyString = getKey({ ...key, start: chunks[i].startIndex, end: chunks[i].endIndex });
      const entry = this.cache[keyString];
      const isCacheValid = entry?.value && Date.now() < entry.expiry;
      cachedResponses.push(isCacheValid ? entry?.value : null);
    }

    // If any of the chunks is missing, then it is a cache miss
    if (cachedResponses.some((response) => response === null)) {
      return undefined;
    }

    // Merge the chunks into a single response
    return (cachedResponses as GridGetRowsResponse[]).reduce(
      (acc: GridGetRowsResponse, response) => {
        return {
          rows: [...acc.rows, ...response.rows],
          rowCount: response.rowCount,
          pageInfo: response.pageInfo,
        };
      },
      { rows: [], rowCount: 0, pageInfo: {} },
    );
  }

  clear() {
    this.cache = {};
  }
}
