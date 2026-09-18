import { describe, expect, it } from 'vitest';
import { DEFAULT_SHEET_NAMES, sanitizeSheetName } from './sheetName';

describe('sanitizeSheetName', () => {
  it('replaces the characters Excel forbids', () => {
    expect(sanitizeSheetName('a/b\\c?d*e[f]g:h', new Set())).to.equal('a_b_c_d_e_f_g_h');
  });

  it('strips leading and trailing apostrophes, which Excel rejects', () => {
    expect(sanitizeSheetName("'quoted'", new Set())).to.equal('quoted');
    expect(sanitizeSheetName("''both''", new Set())).to.equal('both');
    expect(sanitizeSheetName("keep'inside", new Set())).to.equal("keep'inside");
  });

  it('falls back to a placeholder when nothing survives', () => {
    expect(sanitizeSheetName('', new Set())).to.equal('Sheet');
    expect(sanitizeSheetName("'''", new Set())).to.equal('Sheet');
  });

  it('truncates to 31 characters', () => {
    const name = sanitizeSheetName('a'.repeat(40), new Set());

    expect(name.length).to.equal(31);
  });

  it('dedupes case-insensitively, because Excel compares that way', () => {
    const used = new Set<string>();

    expect(sanitizeSheetName('category', used)).to.equal('category');
    expect(sanitizeSheetName('category', used)).to.equal('category (2)');
    // `category (2)` is taken too, so the differently-cased name skips to 3.
    expect(sanitizeSheetName('CATEGORY', used)).to.equal('CATEGORY (3)');
    expect(sanitizeSheetName('category', used)).to.equal('category (4)');
  });

  it('keeps the total within 31 characters when deduping a long name', () => {
    const used = new Set<string>();
    const long = 'a'.repeat(40);

    expect(sanitizeSheetName(long, used).length).to.equal(31);

    const deduped = sanitizeSheetName(long, used);

    expect(deduped.length).to.equal(31);
    expect(deduped.endsWith(' (2)')).to.equal(true);
  });
});

describe('DEFAULT_SHEET_NAMES', () => {
  it('never needs sanitizing', () => {
    for (const name of Object.values(DEFAULT_SHEET_NAMES)) {
      expect(sanitizeSheetName(name, new Set())).to.equal(name);
    }
  });

  it('names the merged single-measure table after the shape rather than a series type', () => {
    // bar and line share this sheet, so no single series type could name it.
    expect(DEFAULT_SHEET_NAMES.category).to.equal('category');
  });
});
