/**
 * Given a map of arrays, appends a value to the array at the given key.
 * If no array exists at that key, one is created and the value appended.
 * @param map Map of arrays
 * @param key Key to append the value at
 * @param value Value to append
 */
export function appendAtKey<K, V>(map: Map<K, V[]>, key: K, value: V) {
  let bucket = map.get(key);

  if (!bucket) {
    bucket = [value];
    map.set(key, bucket);
  } else {
    bucket.push(value);
  }

  return bucket;
}
