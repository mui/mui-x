import type { GridMultiSelectColDef } from '@mui/x-data-grid';
import { GRID_MULTI_SELECT_COL_DEF } from './gridMultiSelectColDef';

describe('GRID_MULTI_SELECT_COL_DEF', () => {
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
      pastedValueParser(value, {} as any, column as any, {} as any);

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
  });
});
