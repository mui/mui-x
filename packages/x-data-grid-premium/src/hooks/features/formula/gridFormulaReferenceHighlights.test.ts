import {
  FORMULA_REFERENCE_PALETTE,
  FORMULA_REFERENCE_PALETTE_SIZE,
  buildFormulaReferenceModel,
  getFormulaReferenceColor,
} from './gridFormulaReferenceHighlights';
import { createTestPositionContext } from './engine/testUtils';

// fields: A=item, B=price, C=quantity, D=total · rows: 1=r1, 2=r2, 3=r3
const context = createTestPositionContext(
  ['r1', 'r2', 'r3'],
  ['item', 'price', 'quantity', 'total'],
);
const owner = { id: 'r1', field: 'total' };

const build = (value: unknown, a1Notation = false, ownerCell = owner) =>
  buildFormulaReferenceModel(value, context, ownerCell, a1Notation);

describe('gridFormulaReferenceHighlights', () => {
  describe('resolution', () => {
    it('resolves same-row field references to owner-row cells', () => {
      const { references } = build('=price * quantity', false, { id: 'r1', field: 'summary' });
      expect(references.map((ref) => ref.target)).to.deep.equal([
        { kind: 'cell', field: 'price', rowId: 'r1' },
        { kind: 'cell', field: 'quantity', rowId: 'r1' },
      ]);
    });

    it('resolves an explicit canonical cell reference', () => {
      const { references } = build('=REF(COLUMN("price"), ROW("r2"))');
      expect(references[0].target).to.deep.equal({ kind: 'cell', field: 'price', rowId: 'r2' });
    });

    it('resolves a range to its normalized corners', () => {
      const { references } = build(
        '=SUM(RANGE(REF(COLUMN("total"), ROW("r3")), REF(COLUMN("item"), ROW("r1"))))',
      );
      expect(references[0].target).to.deep.equal({
        kind: 'range',
        startField: 'item',
        endField: 'total',
        startRowId: 'r1',
        endRowId: 'r3',
      });
    });

    it('resolves COLUMN_VALUES to a whole column', () => {
      const { references } = build('=COLUMN_VALUES("quantity")');
      expect(references[0].target).to.deep.equal({ kind: 'wholeColumn', field: 'quantity' });
    });

    it('marks a reference to a hidden/unknown column as unresolved', () => {
      const { references } = build('=missingColumn + price');
      expect(references[0].target).to.deep.equal({ kind: 'unresolved' });
      expect(references[0].colorIndex).to.equal(null);
      // The valid `price` reference is still resolved and colored.
      expect(references[1].target).to.include({ kind: 'cell', field: 'price' });
      expect(references[1].colorIndex).to.equal(0);
    });

    it('marks a reference to a filtered-out row as unresolved', () => {
      const { references } = build('=REF(COLUMN("price"), ROW("r99"))');
      expect(references[0].target).to.deep.equal({ kind: 'unresolved' });
      expect(references[0].colorIndex).to.equal(null);
    });

    it('never outlines the cell being edited (self-reference)', () => {
      const { references } = build('=total + price', false, { id: 'r1', field: 'total' });
      expect(references[0].target).to.deep.equal({ kind: 'unresolved' });
      expect(references[1].target).to.include({ kind: 'cell', field: 'price' });
    });
  });

  describe('color assignment', () => {
    it('gives distinct targets distinct colors in source order', () => {
      const { references } = build('=price + quantity + item', false, { id: 'r1', field: 'total' });
      expect(references.map((ref) => ref.colorIndex)).to.deep.equal([0, 1, 2]);
    });

    it('gives repeated targets the same color', () => {
      const { references } = build('=price + quantity + price', false, {
        id: 'r1',
        field: 'total',
      });
      expect(references.map((ref) => ref.colorIndex)).to.deep.equal([0, 1, 0]);
    });

    it('keys color on resolved identity across dialects', () => {
      // A1 `B1` and canonical `price` both resolve to the (r1, price) cell.
      const a1 = build('=B1 * quantity', true, { id: 'r1', field: 'summary' });
      const canonical = build('=price * quantity', false, { id: 'r1', field: 'summary' });
      expect(a1.references[0].target).to.deep.equal(canonical.references[0].target);
    });

    it('cycles the palette over more distinct targets than colors', () => {
      const manyFields = Array.from(
        { length: FORMULA_REFERENCE_PALETTE_SIZE + 1 },
        (_, i) => `f${i}`,
      );
      const wideContext = createTestPositionContext(['r1'], manyFields);
      const expression = `=${manyFields.join(' + ')}`;
      const { references } = buildFormulaReferenceModel(
        expression,
        wideContext,
        { id: 'r1', field: 'owner' },
        false,
      );
      const colors = references.map((ref) => ref.colorIndex);
      expect(colors[0]).to.equal(0);
      expect(colors[FORMULA_REFERENCE_PALETTE_SIZE - 1]).to.equal(
        FORMULA_REFERENCE_PALETTE_SIZE - 1,
      );
      // Wraps back to 0 for the (size+1)-th distinct target.
      expect(colors[FORMULA_REFERENCE_PALETTE_SIZE]).to.equal(0);
    });
  });

  describe('spans', () => {
    it('shifts spans into editor coordinates (past the leading `=`)', () => {
      const value = '=price * quantity';
      const { references } = build(value, false, { id: 'r1', field: 'summary' });
      expect(value.slice(references[0].spans[0].start, references[0].spans[0].end)).to.equal(
        'price',
      );
      expect(value.slice(references[1].spans[0].start, references[1].spans[0].end)).to.equal(
        'quantity',
      );
    });
  });

  describe('non-formula and escaped values', () => {
    it('returns the empty model for a non-formula value', () => {
      expect(build('hello').references).to.have.length(0);
      expect(build(42).references).to.have.length(0);
      expect(build(null).references).to.have.length(0);
    });

    it('returns the empty model for an escaped literal', () => {
      expect(build("'=price * quantity").references).to.have.length(0);
    });

    it('always reports the palette size', () => {
      expect(build('hello').paletteSize).to.equal(FORMULA_REFERENCE_PALETTE_SIZE);
      expect(build('=price').paletteSize).to.equal(FORMULA_REFERENCE_PALETTE_SIZE);
    });
  });

  describe('getFormulaReferenceColor', () => {
    it('returns the palette hue for the mode', () => {
      expect(getFormulaReferenceColor(0, 'light')).to.equal(FORMULA_REFERENCE_PALETTE[0].light);
      expect(getFormulaReferenceColor(1, 'dark')).to.equal(FORMULA_REFERENCE_PALETTE[1].dark);
    });

    it('wraps indices past the palette size', () => {
      expect(getFormulaReferenceColor(FORMULA_REFERENCE_PALETTE_SIZE, 'light')).to.equal(
        FORMULA_REFERENCE_PALETTE[0].light,
      );
    });

    it('returns undefined for an unresolved (null) index', () => {
      expect(getFormulaReferenceColor(null, 'light')).to.equal(undefined);
    });
  });
});
