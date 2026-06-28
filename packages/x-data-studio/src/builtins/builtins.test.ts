import { describe, expect, it } from 'vitest';
import {
  getBuiltinSheetTemplates,
  getBuiltinViewTypes,
  resolveOverridable,
} from './index';

interface Item {
  id: string;
  value: number;
}

const defaults: Item[] = [
  { id: 'a', value: 1 },
  { id: 'b', value: 2 },
];

const getKey = (item: Item) => item.id;

describe('resolveOverridable', () => {
  it('returns the defaults untouched when the override is undefined', () => {
    const result = resolveOverridable(defaults, undefined, getKey);
    expect(result).toBe(defaults);
  });

  it('appends array entries that introduce a new key', () => {
    const result = resolveOverridable(defaults, [{ id: 'c', value: 3 }], getKey);
    expect(result.map(getKey)).toEqual(['a', 'b', 'c']);
  });

  it('replaces a default in place when an array entry reuses its key', () => {
    const result = resolveOverridable(defaults, [{ id: 'a', value: 99 }], getKey);
    expect(result).toHaveLength(2);
    expect(result.find((item) => item.id === 'a')?.value).toBe(99);
  });

  it('hands the defaults to a function override and uses its return verbatim', () => {
    const result = resolveOverridable(defaults, (d) => d.filter((item) => item.id !== 'b'), getKey);
    expect(result.map(getKey)).toEqual(['a']);
  });

  it('supports removing every default via a function override', () => {
    const result = resolveOverridable(defaults, () => [], getKey);
    expect(result).toEqual([]);
  });

  it('supports reordering via a function override', () => {
    const result = resolveOverridable(defaults, (d) => [...d].reverse(), getKey);
    expect(result.map(getKey)).toEqual(['b', 'a']);
  });
});

describe('getBuiltinSheetTemplates', () => {
  it('always includes the spreadsheet template', () => {
    for (const plan of ['community', 'pro', 'premium'] as const) {
      expect(getBuiltinSheetTemplates(plan).map((t) => t.id)).toContain('spreadsheet');
    }
  });

  it('gates the pivot + chart templates behind the premium plan', () => {
    expect(getBuiltinSheetTemplates('premium').map((t) => t.id)).toEqual(
      expect.arrayContaining(['pivot', 'chart']),
    );
    for (const plan of ['community', 'pro'] as const) {
      const ids = getBuiltinSheetTemplates(plan).map((t) => t.id);
      expect(ids).not.toContain('pivot');
      expect(ids).not.toContain('chart');
    }
  });
});

describe('getBuiltinViewTypes', () => {
  it('always includes the spreadsheet view type', () => {
    for (const plan of ['community', 'pro', 'premium'] as const) {
      expect(getBuiltinViewTypes(plan).map((vt) => vt.type)).toContain('spreadsheet');
    }
  });

  it('gates the pivot + chart view types behind the premium plan', () => {
    expect(getBuiltinViewTypes('premium').map((vt) => vt.type)).toEqual(
      expect.arrayContaining(['pivot', 'chart']),
    );
    for (const plan of ['community', 'pro'] as const) {
      const types = getBuiltinViewTypes(plan).map((vt) => vt.type);
      expect(types).not.toContain('pivot');
      expect(types).not.toContain('chart');
    }
  });
});
