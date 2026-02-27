"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendAtKey = appendAtKey;
/**
 * Given a map of arrays, appends a value to the array at the given key.
 * If no array exists at that key, one is created and the value appended.
 * @param map Map of arrays
 * @param key Key to append the value at
 * @param value Value to append
 */
function appendAtKey(map, key, value) {
    var bucket = map.get(key);
    if (!bucket) {
        bucket = [value];
        map.set(key, bucket);
    }
    else {
        bucket.push(value);
    }
    return bucket;
}
