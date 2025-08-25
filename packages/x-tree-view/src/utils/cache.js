"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceCacheDefault = void 0;
var DataSourceCacheDefault = /** @class */ (function () {
    function DataSourceCacheDefault(_a) {
        var _b = _a.ttl, ttl = _b === void 0 ? 300000 : _b;
        this.cache = {};
        this.ttl = ttl;
    }
    DataSourceCacheDefault.prototype.set = function (key, value) {
        var expiry = Date.now() + this.ttl;
        this.cache[key] = { value: value, expiry: expiry };
    };
    DataSourceCacheDefault.prototype.get = function (key) {
        var entry = this.cache[key];
        if (!entry) {
            return undefined;
        }
        if (Date.now() > entry.expiry) {
            delete this.cache[key];
            return -1;
        }
        return entry.value;
    };
    DataSourceCacheDefault.prototype.clear = function () {
        this.cache = {};
    };
    return DataSourceCacheDefault;
}());
exports.DataSourceCacheDefault = DataSourceCacheDefault;
