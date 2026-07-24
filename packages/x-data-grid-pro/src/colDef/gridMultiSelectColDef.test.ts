import type { GridMultiSelectColDef } from '@mui/x-data-grid';
import { GRID_MULTI_SELECT_COL_DEF } from './gridMultiSelectColDef';

describe('GRID_MULTI_SELECT_COL_DEF', () => {
  describe('groupingValueGetter', () => {
    // @ts-ignore premium-only field
    const groupingValueGetter = GRID_MULTI_SELECT_COL_DEF.groupingValueGetter as (
      value: any,
    ) => string | null;

    it('joins sorted values with comma', () => {
      expect(groupingValueGetter(['React', 'TypeScript'])).to.equal('React,TypeScript');
    });

    it('produces same key regardless of input order', () => {
      expect(groupingValueGetter(['TypeScript', 'React'])).to.equal(
        groupingValueGetter(['React', 'TypeScript']),
      );
    });

    it('returns null for an empty array', () => {
      expect(groupingValueGetter([])).to.equal(null);
    });

    it('returns null for non-array values', () => {
      expect(groupingValueGetter(null)).to.equal(null);
      expect(groupingValueGetter(undefined)).to.equal(null);
    });

    it('handles numeric values', () => {
      expect(groupingValueGetter([3, 1, 2])).to.equal('1,2,3');
    });
  });

  describe('pastedValueParser', () => {
    const pastedValueParser = GRID_MULTI_SELECT_COL_DEF.pastedValueParser!;

    const stringOptionsColumn = {
      ...GRID_MULTI_SELECT_COL_DEF,
      field: 'tags',
      valueOptions: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    } as GridMultiSelectColDef;

    const objectOptionsColumn = {
      ...GRID_MULTI_SELECT_COL_DEF,
      field: 'tags',
      valueOptions: [
        { value: 'fe', label: 'Frontend' },
        { value: 'be', label: 'Backend' },
        { value: 'fs', label: 'Full-stack' },
      ],
    } as GridMultiSelectColDef;

    const parse = (value: string, column = stringOptionsColumn) =>
      pastedValueParser(value, {} as any, column as any);

    it('splits on default ", " separator', () => {
      expect(parse('React, TypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('splits on "," without space', () => {
      expect(parse('React,TypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('splits on ";"', () => {
      expect(parse('React;TypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('splits on tab', () => {
      expect(parse('React\tTypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('splits on newline', () => {
      expect(parse('React\nTypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('splits on pipe', () => {
      expect(parse('React|TypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('collapses runs of separators and drops empties', () => {
      expect(parse('React,,TypeScript;;Node.js')).to.deep.equal(['React', 'TypeScript', 'Node.js']);
    });

    it('splits on the column-configured separator', () => {
      const slashColumn = { ...stringOptionsColumn, separator: ' / ' } as GridMultiSelectColDef;
      expect(parse('React / TypeScript', slashColumn)).to.deep.equal(['React', 'TypeScript']);
    });

    it('matches case-insensitively against option values', () => {
      expect(parse('react, TYPESCRIPT')).to.deep.equal(['React', 'TypeScript']);
    });

    it('matches case-insensitively against option labels (object options)', () => {
      expect(parse('frontend, BACKEND', objectOptionsColumn)).to.deep.equal(['fe', 'be']);
    });

    it('matches object options by raw value', () => {
      expect(parse('fe, be', objectOptionsColumn)).to.deep.equal(['fe', 'be']);
    });

    it('drops unknown values and keeps known ones', () => {
      expect(parse('React, Unknown, TypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('returns undefined when no values match', () => {
      expect(parse('Foo, Bar')).to.equal(undefined);
    });

    it('returns undefined for an empty string', () => {
      expect(parse('')).to.equal(undefined);
    });

    it('drops duplicate values', () => {
      expect(parse('React, React, TypeScript')).to.deep.equal(['React', 'TypeScript']);
    });

    it('drops duplicates matched via different casing/labels (object options)', () => {
      expect(parse('frontend, FE', objectOptionsColumn)).to.deep.equal(['fe']);
    });
  });

  describe('sortComparator', () => {
    const sortComparator = GRID_MULTI_SELECT_COL_DEF.sortComparator as (v1: any, v2: any) => number;

    it('sorts empty arrays before non-empty ones', () => {
      expect(sortComparator([], ['React'])).to.equal(-1);
      expect(sortComparator(['React'], [])).to.equal(1);
      expect(sortComparator([], [])).to.equal(0);
      expect(sortComparator(null, undefined)).to.equal(0);
    });

    it('orders alphabetically by joined values', () => {
      expect(sortComparator(['a'], ['b'])).to.be.lessThan(0);
      expect(sortComparator(['b'], ['a'])).to.be.greaterThan(0);
    });

    it('preserves element boundaries so ["a","bc"] and ["ab","c"] do not collide', () => {
      expect(sortComparator(['a', 'bc'], ['ab', 'c'])).to.not.equal(0);
    });
  });

  describe('valueFormatter', () => {
    const valueFormatter = GRID_MULTI_SELECT_COL_DEF.valueFormatter as (
      value: unknown,
      row: any,
      colDef: any,
      apiRef: any,
    ) => unknown;
    const colDef = {
      ...GRID_MULTI_SELECT_COL_DEF,
      field: 'tags',
      valueOptions: ['React', 'TypeScript'],
    } as unknown as GridMultiSelectColDef;
    const apiRef = { current: { state: { props: {} } } };

    it('passes non-array values through (e.g. aggregation count)', () => {
      // Aggregation overlays a non-array value (e.g. size count) onto the cell. The
      // formatter must not blank it out, otherwise the aggregation cell renders empty.
      expect(valueFormatter(3, {}, colDef, apiRef)).to.equal(3);
      expect(valueFormatter(0, {}, colDef, apiRef)).to.equal(0);
    });

    it('returns empty string for null or undefined', () => {
      expect(valueFormatter(null, {}, colDef, apiRef)).to.equal('');
      expect(valueFormatter(undefined, {}, colDef, apiRef)).to.equal('');
    });
  });
});
