import { describe, expect, it } from 'vitest';
import { isUrlLike } from './url';

describe('isUrlLike', () => {
  it('accepts absolute http(s) URLs', () => {
    expect(isUrlLike('https://mui.com/x')).toBe(true);
    expect(isUrlLike('http://localhost:5003/list')).toBe(true);
  });

  it("accepts other absolute URL schemes (scheme filtering is the guard's job)", () => {
    expect(isUrlLike('file:///etc/passwd')).toBe(true);
  });

  it('rejects package shorthands and non-URL strings', () => {
    expect(isUrlLike('@mui/material')).toBe(false);
    expect(isUrlLike('@mui/material@9.1.2')).toBe(false);
    expect(isUrlLike('not a url')).toBe(false);
    expect(isUrlLike('')).toBe(false);
  });
});
