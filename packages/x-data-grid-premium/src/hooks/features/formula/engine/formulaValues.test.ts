import { isFormulaErrorValue } from './formulaErrors';
import {
  compareFormulaScalars,
  isEmptyFormulaValue,
  toFormulaBoolean,
  toFormulaNumber,
  toFormulaText,
} from './formulaValues';

const expectError = (value: unknown, code: string) => {
  expect(isFormulaErrorValue(value)).to.equal(true);
  expect((value as { code: string }).code).to.equal(code);
};

describe('formulaValues', () => {
  describe('toFormulaNumber', () => {
    it('passes finite numbers through', () => {
      expect(toFormulaNumber(1.5)).to.equal(1.5);
      expect(toFormulaNumber(-2)).to.equal(-2);
      expect(toFormulaNumber(0)).to.equal(0);
    });

    it('rejects non-finite numbers', () => {
      expectError(toFormulaNumber(NaN), '#VALUE!');
      expectError(toFormulaNumber(Infinity), '#VALUE!');
    });

    it('parses numeric strings strictly', () => {
      expect(toFormulaNumber('5')).to.equal(5);
      expect(toFormulaNumber(' 5.5 ')).to.equal(5.5);
      expect(toFormulaNumber('-3')).to.equal(-3);
      expect(toFormulaNumber('1e3')).to.equal(1000);
      expect(toFormulaNumber('.5')).to.equal(0.5);
    });

    it('rejects non-numeric and lenient-only strings', () => {
      expectError(toFormulaNumber('abc'), '#VALUE!');
      expectError(toFormulaNumber(''), '#VALUE!');
      expectError(toFormulaNumber('0x10'), '#VALUE!');
      expectError(toFormulaNumber('Infinity'), '#VALUE!');
      expectError(toFormulaNumber('1,000'), '#VALUE!');
    });

    it('coerces booleans to 1/0', () => {
      expect(toFormulaNumber(true)).to.equal(1);
      expect(toFormulaNumber(false)).to.equal(0);
    });

    it('coerces empty to 0', () => {
      expect(toFormulaNumber(null)).to.equal(0);
      expect(toFormulaNumber(undefined)).to.equal(0);
    });

    it('coerces dates to epoch milliseconds', () => {
      const date = new Date(1000);
      expect(toFormulaNumber(date)).to.equal(1000);
    });

    it('rejects other objects', () => {
      expectError(toFormulaNumber({}), '#VALUE!');
    });
  });

  describe('toFormulaText', () => {
    it('serializes numbers with a dot decimal separator', () => {
      expect(toFormulaText(1.5)).to.equal('1.5');
      expect(toFormulaText(-2)).to.equal('-2');
    });

    it('passes strings through', () => {
      expect(toFormulaText('a')).to.equal('a');
    });

    it('serializes booleans as TRUE/FALSE', () => {
      expect(toFormulaText(true)).to.equal('TRUE');
      expect(toFormulaText(false)).to.equal('FALSE');
    });

    it('serializes empty as the empty string', () => {
      expect(toFormulaText(null)).to.equal('');
      expect(toFormulaText(undefined)).to.equal('');
    });

    it('serializes dates as ISO strings', () => {
      expect(toFormulaText(new Date(Date.UTC(2024, 0, 1)))).to.equal('2024-01-01T00:00:00.000Z');
    });

    it('rejects other objects', () => {
      expectError(toFormulaText({}), '#VALUE!');
    });
  });

  describe('toFormulaBoolean', () => {
    it('passes booleans through', () => {
      expect(toFormulaBoolean(true)).to.equal(true);
      expect(toFormulaBoolean(false)).to.equal(false);
    });

    it('coerces numbers (zero is false)', () => {
      expect(toFormulaBoolean(0)).to.equal(false);
      expect(toFormulaBoolean(2)).to.equal(true);
      expect(toFormulaBoolean(-1)).to.equal(true);
    });

    it('rejects NaN', () => {
      expectError(toFormulaBoolean(NaN), '#VALUE!');
    });

    it('coerces TRUE/FALSE strings case-insensitively', () => {
      expect(toFormulaBoolean('true')).to.equal(true);
      expect(toFormulaBoolean(' FALSE ')).to.equal(false);
    });

    it('rejects other strings', () => {
      expectError(toFormulaBoolean('yes'), '#VALUE!');
      expectError(toFormulaBoolean(''), '#VALUE!');
    });

    it('coerces empty to false', () => {
      expect(toFormulaBoolean(null)).to.equal(false);
      expect(toFormulaBoolean(undefined)).to.equal(false);
    });

    it('rejects dates', () => {
      expectError(toFormulaBoolean(new Date()), '#VALUE!');
    });
  });

  describe('isEmptyFormulaValue', () => {
    it('treats only null/undefined as empty', () => {
      expect(isEmptyFormulaValue(null)).to.equal(true);
      expect(isEmptyFormulaValue(undefined)).to.equal(true);
      expect(isEmptyFormulaValue(0)).to.equal(false);
      expect(isEmptyFormulaValue('')).to.equal(false);
      expect(isEmptyFormulaValue(false)).to.equal(false);
    });
  });

  describe('compareFormulaScalars', () => {
    describe('equality', () => {
      it('compares numbers', () => {
        expect(compareFormulaScalars('=', 1, 1)).to.equal(true);
        expect(compareFormulaScalars('<>', 1, 2)).to.equal(true);
      });

      it('compares strings case-insensitively (Excel behavior)', () => {
        expect(compareFormulaScalars('=', 'a', 'A')).to.equal(true);
        expect(compareFormulaScalars('=', 'a', 'b')).to.equal(false);
        expect(compareFormulaScalars('<>', 'a', 'A')).to.equal(false);
      });

      it('compares dates by timestamp', () => {
        expect(compareFormulaScalars('=', new Date(1000), new Date(1000))).to.equal(true);
        expect(compareFormulaScalars('=', new Date(1000), new Date(2000))).to.equal(false);
      });

      it('treats empty as equal only to empty', () => {
        expect(compareFormulaScalars('=', null, null)).to.equal(true);
        expect(compareFormulaScalars('=', null, 0)).to.equal(false);
        expect(compareFormulaScalars('=', null, '')).to.equal(false);
        expect(compareFormulaScalars('=', null, false)).to.equal(false);
        expect(compareFormulaScalars('<>', null, 0)).to.equal(true);
      });

      it('returns false (not an error) for cross-type equality', () => {
        expect(compareFormulaScalars('=', 1, '1')).to.equal(false);
        expect(compareFormulaScalars('<>', 1, '1')).to.equal(true);
        expect(compareFormulaScalars('=', true, 1)).to.equal(false);
      });
    });

    describe('ordered comparison', () => {
      it('compares numbers', () => {
        expect(compareFormulaScalars('<', 1, 2)).to.equal(true);
        expect(compareFormulaScalars('>=', 2, 2)).to.equal(true);
        expect(compareFormulaScalars('>', 1, 2)).to.equal(false);
      });

      it('compares strings case-insensitively', () => {
        expect(compareFormulaScalars('<', 'a', 'B')).to.equal(true);
        expect(compareFormulaScalars('<=', 'A', 'a')).to.equal(true);
        expect(compareFormulaScalars('>', 'b', 'A')).to.equal(true);
      });

      it('compares booleans (FALSE < TRUE)', () => {
        expect(compareFormulaScalars('<', false, true)).to.equal(true);
        expect(compareFormulaScalars('>', true, false)).to.equal(true);
      });

      it('compares dates by timestamp', () => {
        expect(compareFormulaScalars('<', new Date(1000), new Date(2000))).to.equal(true);
      });

      it('substitutes a type-neutral value for empty operands', () => {
        expect(compareFormulaScalars('<', null, 5)).to.equal(true); // empty -> 0
        expect(compareFormulaScalars('>', 5, null)).to.equal(true);
        expect(compareFormulaScalars('<', null, 'a')).to.equal(true); // empty -> ''
        expect(compareFormulaScalars('<', null, new Date(1000))).to.equal(true); // empty -> epoch
        expect(compareFormulaScalars('>', new Date(1000), null)).to.equal(true);
        expect(compareFormulaScalars('<=', null, new Date(0))).to.equal(true);
        expect(compareFormulaScalars('<=', null, null)).to.equal(true);
        expect(compareFormulaScalars('<', null, null)).to.equal(false);
      });

      it('rejects cross-type ordered comparison', () => {
        expectError(compareFormulaScalars('<', 1, 'a'), '#VALUE!');
        expectError(compareFormulaScalars('>', true, 1), '#VALUE!');
        expectError(compareFormulaScalars('<', new Date(), 1), '#VALUE!');
      });

      it('rejects ordered comparison with an invalid Date', () => {
        const invalid = new Date(NaN);
        expectError(compareFormulaScalars('<', invalid, new Date(0)), '#VALUE!');
        expectError(compareFormulaScalars('>=', new Date(0), invalid), '#VALUE!');
      });

      it('treats an invalid Date as never equal, including to itself', () => {
        const invalid = new Date(NaN);
        expect(compareFormulaScalars('=', invalid, invalid)).to.equal(false);
        expect(compareFormulaScalars('<>', invalid, invalid)).to.equal(true);
        expect(compareFormulaScalars('=', invalid, new Date(0))).to.equal(false);
      });
    });
  });
});
