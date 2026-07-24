import { bindFormulaDependencies, extractFormulaDependencies } from './formulaDependencies';
import type { FormulaStaticDependencies } from './formulaDependencies';
import { parseFormula } from './formulaParser';
import { createFormulaCellKey } from './formulaTypes';
import { createTestPositionContext } from './testUtils';

const extract = (expression: string): FormulaStaticDependencies => {
  const { ast, error } = parseFormula(expression);
  if (ast === null) {
    throw new Error(`Test expression did not parse: ${error?.message}`);
  }
  return extractFormulaDependencies(ast);
};

describe('formulaDependencies', () => {
  describe('extractFormulaDependencies', () => {
    it('collects same-row field refs', () => {
      const deps = extract('price * quantity + price');
      expect(Array.from(deps.fieldRefs).sort()).to.deep.equal(['price', 'quantity']);
      expect(deps.usesPositionContext).to.equal(false);
    });

    it('collects field refs nested in calls and operators', () => {
      const deps = extract('IF(a > 1, SUM(b, -c), FIELD("d e"))');
      expect(Array.from(deps.fieldRefs).sort()).to.deep.equal(['a', 'b', 'c', 'd e']);
    });

    it('collects explicit cell refs', () => {
      const deps = extract('REF(COLUMN("total"), ROW("r1")) + REF(COLUMN("total"), ROW("r2"))');
      expect(deps.cellRefs).to.have.length(2);
      expect(deps.cellRefs[0]).to.include({ type: 'cellRef' });
      expect(deps.usesPositionContext).to.equal(false);
    });

    it('flags positional selectors as position-context-dependent', () => {
      expect(extract('REF(COLUMN("a"), ROW_POSITION(1))').usesPositionContext).to.equal(true);
      expect(extract('REF(COLUMN_POSITION(1), ROW("r1"))').usesPositionContext).to.equal(true);
    });

    it('flags ranges and column slices as position-context-dependent', () => {
      expect(
        extract('SUM(RANGE(REF(COLUMN("a"), ROW(1)), REF(COLUMN("a"), ROW(2))))')
          .usesPositionContext,
      ).to.equal(true);
      const deps = extract('SUM(COLUMN_VALUES("price"))');
      expect(deps.usesPositionContext).to.equal(true);
      expect(Array.from(deps.columnValues)).to.deep.equal(['price']);
    });

    it('collects uppercase function names', () => {
      const deps = extract('if(sum(a), nope(b), 1)');
      expect(Array.from(deps.calls).sort()).to.deep.equal(['IF', 'NOPE', 'SUM']);
    });

    it('collects nothing from pure literals', () => {
      const deps = extract('1 + 2 & "a"');
      expect(deps.fieldRefs.size).to.equal(0);
      expect(deps.cellRefs).to.have.length(0);
      expect(deps.calls.size).to.equal(0);
      expect(deps.usesPositionContext).to.equal(false);
    });
  });

  describe('bindFormulaDependencies', () => {
    const owner = { id: 'r2', field: 'total' };
    // Position context: rows r1, r2, r3 (in that order), fields a, b, c.
    const context = createTestPositionContext(['r1', 'r2', 'r3'], ['a', 'b', 'c']);

    it('binds same-row field refs to the owner row', () => {
      const bound = bindFormulaDependencies(owner, extract('a + b'), context);
      expect(Array.from(bound.cells).sort()).to.deep.equal([
        createFormulaCellKey('r2', 'a'),
        createFormulaCellKey('r2', 'b'),
      ]);
      expect(bound.errors).to.have.length(0);
    });

    it('binds stable cell refs without consulting positions', () => {
      // A stable ref to a row id missing from the position context still binds:
      // existence is an evaluation concern.
      const bound = bindFormulaDependencies(
        owner,
        extract('REF(COLUMN("a"), ROW("filtered-out"))'),
        context,
      );
      expect(Array.from(bound.cells)).to.deep.equal([createFormulaCellKey('filtered-out', 'a')]);
      expect(bound.errors).to.have.length(0);
    });

    it('binds positional selectors through the context', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('REF(COLUMN_POSITION(2), ROW_POSITION(3))'),
        context,
      );
      expect(Array.from(bound.cells)).to.deep.equal([createFormulaCellKey('r3', 'b')]);
    });

    it('records #REF! for out-of-bounds positional selectors', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('REF(COLUMN("a"), ROW_POSITION(5)) + REF(COLUMN_POSITION(9), ROW("r1"))'),
        context,
      );
      expect(bound.cells.size).to.equal(0);
      expect(bound.errors).to.have.length(2);
      expect(bound.errors[0].code).to.equal('#REF!');
      expect(bound.errors[1].code).to.equal('#REF!');
    });

    it('binds ranges to column interval records, never exploded cells', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('SUM(RANGE(REF(COLUMN("a"), ROW("r1")), REF(COLUMN("b"), ROW("r3"))))'),
        context,
      );
      expect(bound.cells.size).to.equal(0);
      expect(bound.columnIntervals).to.deep.equal([
        { field: 'a', fromIndex: 1, toIndex: 3 },
        { field: 'b', fromIndex: 1, toIndex: 3 },
      ]);
    });

    it('normalizes inverted range anchors', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('SUM(RANGE(REF(COLUMN("b"), ROW("r3")), REF(COLUMN("a"), ROW("r1"))))'),
        context,
      );
      expect(bound.columnIntervals).to.deep.equal([
        { field: 'a', fromIndex: 1, toIndex: 3 },
        { field: 'b', fromIndex: 1, toIndex: 3 },
      ]);
    });

    it('resolves positional range anchors against the context', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract(
          'SUM(RANGE(REF(COLUMN_POSITION(1), ROW_POSITION(2)), REF(COLUMN("a"), ROW("r3"))))',
        ),
        context,
      );
      expect(bound.columnIntervals).to.deep.equal([{ field: 'a', fromIndex: 2, toIndex: 3 }]);
    });

    it('records #REF! when a range anchor has no position', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('SUM(RANGE(REF(COLUMN("a"), ROW("filtered-out")), REF(COLUMN("a"), ROW("r2"))))'),
        context,
      );
      expect(bound.columnIntervals).to.have.length(0);
      expect(bound.errors).to.have.length(1);
      expect(bound.errors[0].code).to.equal('#REF!');
    });

    it('records #REF! when a range anchor column is hidden', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('SUM(RANGE(REF(COLUMN("hidden"), ROW("r1")), REF(COLUMN("a"), ROW("r2"))))'),
        context,
      );
      expect(bound.errors).to.have.length(1);
      expect(bound.errors[0].code).to.equal('#REF!');
    });

    it('binds COLUMN_VALUES to whole-column records', () => {
      const bound = bindFormulaDependencies(
        owner,
        extract('SUM(COLUMN_VALUES("a"), COLUMN_VALUES("b"))'),
        context,
      );
      expect(bound.wholeColumns).to.deep.equal([
        { field: 'a', whole: true },
        { field: 'b', whole: true },
      ]);
    });

    it('rebinds differently under a changed context', () => {
      const deps = extract('REF(COLUMN("a"), ROW_POSITION(1))');
      const before = bindFormulaDependencies(owner, deps, context);
      expect(Array.from(before.cells)).to.deep.equal([createFormulaCellKey('r1', 'a')]);

      const reordered = createTestPositionContext(['r3', 'r1', 'r2'], ['a', 'b', 'c'], 1);
      const after = bindFormulaDependencies(owner, deps, reordered);
      expect(Array.from(after.cells)).to.deep.equal([createFormulaCellKey('r3', 'a')]);
    });
  });
});
