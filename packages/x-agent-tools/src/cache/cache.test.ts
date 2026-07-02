import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LRUCache } from './cache';

const HOUR_MS = 60 * 60 * 1000;

describe('LRUCache', () => {
  beforeEach(() => {
    // Fake timers cover both Date.now() (TTL math) and the cleanup setInterval.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('returns null for a key that was never set', () => {
    const cache = new LRUCache();
    expect(cache.get('missing')).toBe(null);
  });

  it('stores and retrieves a value', () => {
    const cache = new LRUCache();
    cache.set('a', 'value-a');
    expect(cache.get('a')).toBe('value-a');
  });

  it('overwrites the value for an existing key', () => {
    const cache = new LRUCache();
    cache.set('a', 'first');
    cache.set('a', 'second');
    expect(cache.get('a')).toBe('second');
  });

  it('expires an entry once its TTL has elapsed', () => {
    const ttl = 1000;
    const cache = new LRUCache(ttl);
    cache.set('a', 'value-a');

    vi.advanceTimersByTime(ttl - 1);
    expect(cache.get('a')).toBe('value-a');

    vi.advanceTimersByTime(1); // now exactly at the TTL boundary
    expect(cache.get('a')).toBe(null);
  });

  it('evicts the least-recently-used entry when at capacity', () => {
    const cache = new LRUCache(HOUR_MS, 2);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.set('c', 'C'); // exceeds capacity → 'a' (LRU) is dropped

    expect(cache.get('a')).toBe(null);
    expect(cache.get('b')).toBe('B');
    expect(cache.get('c')).toBe('C');
  });

  it('does not evict another entry when refreshing an existing key at capacity', () => {
    const cache = new LRUCache(HOUR_MS, 2);
    cache.set('a', 'A');
    cache.set('b', 'B'); // full: { a, b }
    cache.set('b', 'B2'); // refresh existing key, must NOT drop 'a'

    expect(cache.get('a')).toBe('A');
    expect(cache.get('b')).toBe('B2');
  });

  it('treats a refresh (set of an existing key) as a use', () => {
    const cache = new LRUCache(HOUR_MS, 2);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.set('a', 'A2'); // 'a' becomes most-recently-used
    cache.set('c', 'C'); // 'b' is now the LRU and gets dropped

    expect(cache.get('a')).toBe('A2');
    expect(cache.get('b')).toBe(null);
    expect(cache.get('c')).toBe('C');
  });

  it('treats a read as a use, protecting that entry from eviction', () => {
    const cache = new LRUCache(HOUR_MS, 2);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.get('a'); // 'a' becomes most-recently-used
    cache.set('c', 'C'); // 'b' is now the LRU and gets dropped

    expect(cache.get('a')).toBe('A');
    expect(cache.get('b')).toBe(null);
    expect(cache.get('c')).toBe('C');
  });

  it('purges expired entries on the scheduled cleanup interval', () => {
    const ttl = 1000;
    const cleanupFreq = 500;
    const cache = new LRUCache(ttl, 10, cleanupFreq);
    cache.set('a', 'A');

    // Advance past the TTL and at least one cleanup tick so the interval fires.
    vi.advanceTimersByTime(ttl + cleanupFreq);
    expect(cache.get('a')).toBe(null);
  });

  it('stops running the cleanup interval after dispose()', () => {
    const cleanupSpy = vi.spyOn(global, 'clearInterval');
    const cache = new LRUCache();

    cache.dispose();

    expect(cleanupSpy).toHaveBeenCalledTimes(1);
    cleanupSpy.mockRestore();
  });
});
