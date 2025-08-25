"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridDataSourceCacheDefault = void 0;
exports.getKeyDefault = getKeyDefault;
function getKeyDefault(params) {
    return JSON.stringify([params.filterModel, params.sortModel, params.start, params.end]);
}
var GridDataSourceCacheDefault = /** @class */ (function () {
    function GridDataSourceCacheDefault(_a) {
        var _b = _a.ttl, ttl = _b === void 0 ? 300000 : _b, _c = _a.getKey, getKey = _c === void 0 ? getKeyDefault : _c;
        this.cache = {};
        this.ttl = ttl;
        this.getKey = getKey;
    }
    GridDataSourceCacheDefault.prototype.set = function (key, value) {
        var keyString = this.getKey(key);
        var expiry = Date.now() + this.ttl;
        this.cache[keyString] = { value: value, expiry: expiry };
    };
    GridDataSourceCacheDefault.prototype.get = function (key) {
        var keyString = this.getKey(key);
        var entry = this.cache[keyString];
        if (!entry) {
            return undefined;
        }
        if (Date.now() > entry.expiry) {
            delete this.cache[keyString];
            return undefined;
        }
        return entry.value;
    };
    GridDataSourceCacheDefault.prototype.clear = function () {
        this.cache = {};
    };
    return GridDataSourceCacheDefault;
}());
exports.GridDataSourceCacheDefault = GridDataSourceCacheDefault;
