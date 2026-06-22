import { describe, it, expect } from 'vitest';
import { sha256 } from './hash';

describe('sha256', () => {
  it('should return a 64-char hex string', () => {
    const result = sha256('test');
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should return the same hash for the same input', () => {
    expect(sha256('hello')).toBe(sha256('hello'));
  });

  it('should return different hashes for different inputs', () => {
    expect(sha256('hello')).not.toBe(sha256('world'));
  });

  it('should match known SHA-256 values', () => {
    // echo -n "test" | shasum -a 256
    expect(sha256('test')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    // echo -n "" | shasum -a 256
    expect(sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('should produce the same output as runtime hashString for the same input', async () => {
    const { hashString } = await import('../runtime/hash-string');
    const input = 'my-test-app';

    const nodeHash = sha256(input);
    const browserHash = await hashString(input);

    expect(nodeHash).toBe(browserHash);
  });
});
