export function getKeyDefault(params) {
    return JSON.stringify([params.filterModel, params.sortModel, params.start, params.end]);
}
export class GridDataSourceCacheDefault {
    cache;
    ttl;
    getKey;
    constructor({ ttl = 300_000, getKey = getKeyDefault }) {
        this.cache = {};
        this.ttl = ttl;
        this.getKey = getKey;
    }
    set(key, value) {
        const keyString = this.getKey(key);
        const expiry = Date.now() + this.ttl;
        this.cache[keyString] = { value, expiry };
    }
    get(key) {
        const keyString = this.getKey(key);
        const entry = this.cache[keyString];
        if (!entry) {
            return undefined;
        }
        if (Date.now() > entry.expiry) {
            delete this.cache[keyString];
            return undefined;
        }
        return entry.value;
    }
    clear() {
        this.cache = {};
    }
}
