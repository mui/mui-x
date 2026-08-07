import { describe, it, expect } from 'vitest';
import { ensurePool } from './utils';

describe('ensurePool', () => {
  it('allocates a fresh array when the pool is null', () => {
    const out = ensurePool<Float32Array>(null, 10, Float32Array);
    expect(out).to.be.instanceOf(Float32Array);
    expect(out.length).to.equal(10);
  });

  it('reuses the existing array when it is large enough', () => {
    const initial = new Float32Array(20);
    const out = ensurePool<Float32Array>(initial, 10, Float32Array);
    expect(out).to.equal(initial);
  });

  it('reuses when the existing array exactly matches the requested length', () => {
    const initial = new Float32Array(10);
    const out = ensurePool<Float32Array>(initial, 10, Float32Array);
    expect(out).to.equal(initial);
  });

  it('reallocates when the existing array is too small', () => {
    const initial = new Float32Array(5);
    const out = ensurePool<Float32Array>(initial, 10, Float32Array);
    expect(out).to.not.equal(initial);
    expect(out.length).to.equal(10);
  });

  it('supports Uint8Array', () => {
    const out = ensurePool<Uint8Array>(null, 4, Uint8Array);
    expect(out).to.be.instanceOf(Uint8Array);
    expect(out.length).to.equal(4);
  });
});
