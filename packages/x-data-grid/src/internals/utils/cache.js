import { getKeyDefault } from '../../hooks/features/dataSource/cache';
export class TestCache {
    cache;
    constructor() {
        this.cache = new Map();
    }
    set(key, value) {
        this.cache.set(getKeyDefault(key), value);
    }
    get(key) {
        return this.cache.get(getKeyDefault(key));
    }
    size() {
        return this.cache.size;
    }
    clear() {
        this.cache.clear();
    }
}
