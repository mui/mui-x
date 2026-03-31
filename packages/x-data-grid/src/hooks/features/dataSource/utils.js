export var DataSourceRowsUpdateStrategy;
(function (DataSourceRowsUpdateStrategy) {
    DataSourceRowsUpdateStrategy["Default"] = "set-flat-rows";
    DataSourceRowsUpdateStrategy["LazyLoading"] = "replace-row-range";
    DataSourceRowsUpdateStrategy["GroupedData"] = "set-grouped-rows";
})(DataSourceRowsUpdateStrategy || (DataSourceRowsUpdateStrategy = {}));
/**
 * Provides better cache hit rate by:
 * 1. Splitting the data into smaller chunks to be stored in the cache (cache `set`)
 * 2. Merging multiple cache entries into a single response to get the required chunk (cache `get`)
 */
export class CacheChunkManager {
    chunkSize;
    /**
     * @param chunkSize The number of rows to store in each cache entry.
     * If not set, the whole array will be stored in a single cache entry.
     * Setting this value to smallest page size will result in better cache hit rate.
     * Has no effect if cursor pagination is used.
     */
    constructor(chunkSize) {
        this.chunkSize = chunkSize;
    }
    getCacheKeys = (key) => {
        if (this.chunkSize < 1 || typeof key.start !== 'number') {
            return [key];
        }
        // split the range into chunks
        const chunkedKeys = [];
        for (let i = key.start; i <= key.end; i += this.chunkSize) {
            const end = Math.min(i + this.chunkSize - 1, key.end);
            chunkedKeys.push({ ...key, start: i, end });
        }
        return chunkedKeys;
    };
    splitResponse = (key, response) => {
        const cacheKeys = this.getCacheKeys(key);
        if (cacheKeys.length === 1) {
            return new Map([[key, response]]);
        }
        const responses = new Map();
        cacheKeys.forEach((chunkKey) => {
            const isLastChunk = chunkKey.end === key.end;
            const responseSlice = {
                ...response,
                pageInfo: {
                    ...response.pageInfo,
                    // If the original response had page info, update that information for all but last chunk and keep the original value for the last chunk
                    hasNextPage: response.pageInfo?.hasNextPage !== undefined && !isLastChunk
                        ? true
                        : response.pageInfo?.hasNextPage,
                    nextCursor: response.pageInfo?.nextCursor !== undefined && !isLastChunk
                        ? response.rows[chunkKey.end + 1].id
                        : response.pageInfo?.nextCursor,
                },
                rows: typeof chunkKey.start !== 'number' || typeof key.start !== 'number'
                    ? response.rows
                    : response.rows.slice(chunkKey.start - key.start, chunkKey.end - key.start + 1),
            };
            responses.set(chunkKey, responseSlice);
        });
        return responses;
    };
    static mergeResponses = (responses) => {
        if (responses.length === 1) {
            return responses[0];
        }
        return responses.reduce((acc, response) => ({
            ...response,
            rows: [...acc.rows, ...response.rows],
        }), { rows: [], rowCount: 0, pageInfo: {} });
    };
}
