import { describe, it, expect } from 'vitest';
import { hash } from './hash';

describe('hash', () => {
  // Reference values from the xxHash32 specification, seed 0.
  it('should match the xxHash32 reference vectors', () => {
    expect(hash('')).to.equal(String(0x02cc5d05));
    expect(hash('a')).to.equal(String(0x550d7456));
    expect(hash('abc')).to.equal(String(0x32d153ff));
    expect(hash('heiå')).to.equal(String(0xdb5abccc));
  });

  it('should hash inputs shorter, equal and longer than one 16-byte block', () => {
    expect(hash('hello world')).to.equal('3468387874');
    expect(hash('0123456789abcdef')).to.equal('3267648361');
    expect(hash('the quick brown fox jumps over the lazy dog')).to.equal('1718707063');
  });

  it('should be deterministic', () => {
    expect(hash('the quick brown fox')).to.equal(hash('the quick brown fox'));
  });

  it('should take every byte of the input into account', () => {
    // 32-bit words are read from a byte offset, so a mis-scaled index silently
    // skips most of the input and makes these mutations collide.
    const input = '0123456789abcdefghijklmnopqrstuv';
    const hashes = new Set([hash(input)]);
    for (let i = 0; i < input.length; i += 1) {
      hashes.add(hash(`${input.slice(0, i)}X${input.slice(i + 1)}`));
    }
    expect(hashes.size).to.equal(input.length + 1);
  });

  it('should distribute distinct inputs', () => {
    const count = 20000;
    const hashes = new Set<string>();
    for (let i = 0; i < count; i += 1) {
      hashes.add(hash(`key-${i}`));
    }
    expect(hashes.size).to.equal(count);
  });

  it('should not truncate multi-byte characters that overflow the scratch buffer', () => {
    // Each character takes 3 UTF-8 bytes, so the buffer has to grow beyond its
    // initial size for the trailing characters to be encoded at all.
    const long = '€'.repeat(2000);
    expect(hash(long)).not.to.equal(hash(`${long}suffix`));
    expect(hash(`${long}a`)).not.to.equal(hash(`${long}b`));
  });

  it('should stay stable after the scratch buffer grows', () => {
    const before = hash('abc');
    hash('€'.repeat(5000));
    expect(hash('abc')).to.equal(before);
  });
});
