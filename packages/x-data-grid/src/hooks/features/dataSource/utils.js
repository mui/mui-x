"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheChunkManager = exports.DataSourceRowsUpdateStrategy = void 0;
var DataSourceRowsUpdateStrategy;
(function (DataSourceRowsUpdateStrategy) {
    DataSourceRowsUpdateStrategy["Default"] = "set-new-rows";
    DataSourceRowsUpdateStrategy["LazyLoading"] = "replace-row-range";
})(DataSourceRowsUpdateStrategy || (exports.DataSourceRowsUpdateStrategy = DataSourceRowsUpdateStrategy = {}));
/**
 * Provides better cache hit rate by:
 * 1. Splitting the data into smaller chunks to be stored in the cache (cache `set`)
 * 2. Merging multiple cache entries into a single response to get the required chunk (cache `get`)
 */
var CacheChunkManager = /** @class */ (function () {
    /**
     * @param chunkSize The number of rows to store in each cache entry.
     * If not set, the whole array will be stored in a single cache entry.
     * Setting this value to smallest page size will result in better cache hit rate.
     * Has no effect if cursor pagination is used.
     */
    function CacheChunkManager(chunkSize) {
        var _this = this;
        this.getCacheKeys = function (key) {
            if (_this.chunkSize < 1 || typeof key.start !== 'number') {
                return [key];
            }
            // split the range into chunks
            var chunkedKeys = [];
            for (var i = key.start; i <= key.end; i += _this.chunkSize) {
                var end = Math.min(i + _this.chunkSize - 1, key.end);
                chunkedKeys.push(__assign(__assign({}, key), { start: i, end: end }));
            }
            return chunkedKeys;
        };
        this.splitResponse = function (key, response) {
            var cacheKeys = _this.getCacheKeys(key);
            if (cacheKeys.length === 1) {
                return new Map([[key, response]]);
            }
            var responses = new Map();
            cacheKeys.forEach(function (chunkKey) {
                var _a, _b, _c, _d;
                var isLastChunk = chunkKey.end === key.end;
                var responseSlice = __assign(__assign({}, response), { pageInfo: __assign(__assign({}, response.pageInfo), { 
                        // If the original response had page info, update that information for all but last chunk and keep the original value for the last chunk
                        hasNextPage: ((_a = response.pageInfo) === null || _a === void 0 ? void 0 : _a.hasNextPage) !== undefined && !isLastChunk
                            ? true
                            : (_b = response.pageInfo) === null || _b === void 0 ? void 0 : _b.hasNextPage, nextCursor: ((_c = response.pageInfo) === null || _c === void 0 ? void 0 : _c.nextCursor) !== undefined && !isLastChunk
                            ? response.rows[chunkKey.end + 1].id
                            : (_d = response.pageInfo) === null || _d === void 0 ? void 0 : _d.nextCursor }), rows: typeof chunkKey.start !== 'number' || typeof key.start !== 'number'
                        ? response.rows
                        : response.rows.slice(chunkKey.start - key.start, chunkKey.end - key.start + 1) });
                responses.set(chunkKey, responseSlice);
            });
            return responses;
        };
        this.chunkSize = chunkSize;
    }
    CacheChunkManager.mergeResponses = function (responses) {
        if (responses.length === 1) {
            return responses[0];
        }
        return responses.reduce(function (acc, response) { return ({
            rows: __spreadArray(__spreadArray([], acc.rows, true), response.rows, true),
            rowCount: response.rowCount,
            pageInfo: response.pageInfo,
        }); }, { rows: [], rowCount: 0, pageInfo: {} });
    };
    return CacheChunkManager;
}());
exports.CacheChunkManager = CacheChunkManager;
