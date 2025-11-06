"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCache = void 0;
var cache_1 = require("../../hooks/features/dataSource/cache");
var TestCache = /** @class */ (function () {
    function TestCache() {
        this.cache = new Map();
    }
    TestCache.prototype.set = function (key, value) {
        this.cache.set((0, cache_1.getKeyDefault)(key), value);
    };
    TestCache.prototype.get = function (key) {
        return this.cache.get((0, cache_1.getKeyDefault)(key));
    };
    TestCache.prototype.size = function () {
        return this.cache.size;
    };
    TestCache.prototype.clear = function () {
        this.cache.clear();
    };
    return TestCache;
}());
exports.TestCache = TestCache;
