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
