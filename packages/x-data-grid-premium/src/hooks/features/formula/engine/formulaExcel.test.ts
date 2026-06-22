import { parseFormula } from './formulaParser';
import { serializeFormulaAstToExcel, mapFormulaErrorCodeToExcel } from './formulaExcel';
import type { FormulaExcelSerializeContext } from './formulaExcel';
import type { FormulaAstNode } from './formulaAst';

const parseOk = (expression: string): FormulaAstNode => {
  const { ast, error } = parseFormula(expression);
  if (ast === null) {
    throw new Error(`Test expression did not parse: ${error?.message}`);
  }
  return ast;
};

// A 4-column × 3-row export: item→A, price→B, qty→C, total→D; data rows r1..r3
// land on Excel rows 2..4 (a single header row). Positional indexes mirror the
// same letters/rows but are flagged absolute, exactly as the adapter resolves
// them. Field "missing"/row "rX"/out-of-range positions resolve to `null`.
const FIELD_LETTERS: Record<string, string> = { item: 'A', price: 'B', qty: 'C', total: 'D' };
const POSITION_LETTERS: Record<number, string> = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
const ROW_NUMBERS: Record<string, number> = { r1: 2, r2: 3, r3: 4 };
const POSITION_ROWS: Record<number, number> = { 1: 2, 2: 3, 3: 4 };

const context: FormulaExcelSerializeContext = {
  resolveColumn: (selector) => {
    if (selector.kind === 'field') {
      const letter = FIELD_LETTERS[selector.field];
      return letter === undefined ? null : { letter, absolute: false };
    }
    const letter = POSITION_LETTERS[selector.index];
    return letter === undefined ? null : { letter, absolute: true };
  },
  resolveRow: (selector) => {
    if (selector.kind === 'id') {
      const number = ROW_NUMBERS[String(selector.id)];
      return number === undefined ? null : { number, absolute: false };
    }
    const number = POSITION_ROWS[selector.index];
    return number === undefined ? null : { number, absolute: true };
  },
  ownerRowNumber: 2,
  firstDataRowNumber: 2,
  lastDataRowNumber: 4,
};

const toExcel = (expression: string) => serializeFormulaAstToExcel(parseOk(expression), context);

describe('serializeFormulaAstToExcel', () => {
  describe('cell references', () => {
    it('renders a stable ref as a relative A1 address', () => {
      expect(toExcel('REF(COLUMN("price"), ROW("r1"))')).to.deep.equal({
        formula: 'B2',
        hasRefError: false,
      });
    });

    it('renders a positional ref as an absolute A1 address', () => {
      expect(toExcel('REF(COLUMN_POSITION(2), ROW_POSITION(1))').formula).to.equal('$B$2');
    });

    it('renders mixed axes (absolute column, relative row)', () => {
      expect(toExcel('REF(COLUMN_POSITION(2), ROW("r1"))').formula).to.equal('$B2');
    });

    it('renders mixed axes (relative column, absolute row)', () => {
      expect(toExcel('REF(COLUMN("price"), ROW_POSITION(1))').formula).to.equal('B$2');
    });

    it('re-anchors each row to its export row number', () => {
      expect(toExcel('REF(COLUMN("qty"), ROW("r3"))').formula).to.equal('C4');
    });
  });

  describe('same-row field references', () => {
    it('renders against the owner cell row', () => {
      expect(toExcel('price * qty')).to.deep.equal({ formula: 'B2*C2', hasRefError: false });
    });
  });

  describe('ranges and whole columns', () => {
    it('renders a RANGE as start:end', () => {
      expect(
        toExcel('SUM(RANGE(REF(COLUMN("price"), ROW("r1")), REF(COLUMN("price"), ROW("r3"))))')
          .formula,
      ).to.equal('SUM(B2:B4)');
    });

    it('renders COLUMN_VALUES as a bounded data range (no header)', () => {
      expect(toExcel('SUM(COLUMN_VALUES("total"))').formula).to.equal('SUM(D2:D4)');
    });
  });

  describe('operators and precedence', () => {
    it('omits parentheses when precedence allows', () => {
      expect(toExcel('price + qty * total').formula).to.equal('B2+C2*D2');
    });

    it('adds parentheses to preserve a lower-precedence left operand', () => {
      expect(toExcel('(price + qty) * total').formula).to.equal('(B2+C2)*D2');
    });

    it('adds parentheses to preserve left-associativity on the right', () => {
      expect(toExcel('price - (qty - total)').formula).to.equal('B2-(C2-D2)');
    });

    it('renders unary minus', () => {
      expect(toExcel('-price').formula).to.equal('-B2');
    });

    it('parenthesizes a compound unary operand', () => {
      expect(toExcel('-(price + qty)').formula).to.equal('-(B2+C2)');
    });

    it('renders comparison and concatenation operators', () => {
      expect(toExcel('price > qty').formula).to.equal('B2>C2');
      expect(toExcel('price <> qty').formula).to.equal('B2<>C2');
      expect(toExcel('item & "x"').formula).to.equal('A2&"x"');
    });
  });

  describe('function calls and literals', () => {
    it('renders functions with comma-separated args', () => {
      expect(toExcel('IF(price > qty, price, qty)').formula).to.equal('IF(B2>C2,B2,C2)');
    });

    it('renders string, boolean and number literals', () => {
      expect(toExcel('"hi"').formula).to.equal('"hi"');
      expect(toExcel('"a""b"').formula).to.equal('"a""b"');
      expect(toExcel('TRUE').formula).to.equal('TRUE');
      expect(toExcel('FALSE').formula).to.equal('FALSE');
      expect(toExcel('42').formula).to.equal('42');
      expect(toExcel('3.14').formula).to.equal('3.14');
    });
  });

  describe('references outside the export → #REF!', () => {
    it('bakes #REF! for a missing column', () => {
      expect(toExcel('REF(COLUMN("missing"), ROW("r1"))')).to.deep.equal({
        formula: '#REF!',
        hasRefError: true,
      });
    });

    it('bakes #REF! for a missing row', () => {
      expect(toExcel('REF(COLUMN("price"), ROW("rX"))')).to.deep.equal({
        formula: '#REF!',
        hasRefError: true,
      });
    });

    it('bakes #REF! for an out-of-range positional ref', () => {
      expect(toExcel('REF(COLUMN_POSITION(9), ROW_POSITION(1))').hasRefError).to.equal(true);
    });

    it('bakes #REF! for an unknown same-row field', () => {
      expect(toExcel('missing').formula).to.equal('#REF!');
    });

    it('keeps the resolvable endpoint of a half-broken range', () => {
      expect(
        toExcel('SUM(RANGE(REF(COLUMN("price"), ROW("r1")), REF(COLUMN("price"), ROW("rX"))))'),
      ).to.deep.equal({ formula: 'SUM(B2:#REF!)', hasRefError: true });
    });

    it('bakes #REF! into one operand and keeps the rest', () => {
      expect(toExcel('price + REF(COLUMN("missing"), ROW("r1"))')).to.deep.equal({
        formula: 'B2+#REF!',
        hasRefError: true,
      });
    });
  });
});

describe('mapFormulaErrorCodeToExcel', () => {
  it('passes through codes Excel shares', () => {
    expect(mapFormulaErrorCodeToExcel('#REF!')).to.equal('#REF!');
    expect(mapFormulaErrorCodeToExcel('#DIV/0!')).to.equal('#DIV/0!');
    expect(mapFormulaErrorCodeToExcel('#NAME?')).to.equal('#NAME?');
    expect(mapFormulaErrorCodeToExcel('#VALUE!')).to.equal('#VALUE!');
  });

  it('maps engine-only codes to the nearest Excel error', () => {
    expect(mapFormulaErrorCodeToExcel('#CYCLE!')).to.equal('#REF!');
    expect(mapFormulaErrorCodeToExcel('#ERROR!')).to.equal('#VALUE!');
  });
});
