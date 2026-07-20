import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readVersionFrom } from './version';

describe('readVersionFrom', () => {
  it('reads the version from a directory that has a package.json', () => {
    // The package root (one level up from src/) holds this package's package.json.
    expect(readVersionFrom(join(__dirname, '..'))).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('returns undefined when the directory has no package.json', () => {
    expect(readVersionFrom(__dirname)).toBeUndefined(); // src/ has none
    expect(readVersionFrom('/definitely/not/a/real/dir')).toBeUndefined();
  });
});
