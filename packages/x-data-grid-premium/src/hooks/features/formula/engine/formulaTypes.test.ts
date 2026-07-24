import {
  createFormulaCellKey,
  getFormulaCellKey,
  getFormulaExpression,
  isEscapedFormulaSource,
  isFormulaSource,
  parseFormulaCellKey,
  unescapeLiteralSource,
} from './formulaTypes';

describe('formulaTypes', () => {
  describe('cell keys', () => {
    it('round-trips id and field', () => {
      const key = createFormulaCellKey('order-1', 'total');
      expect(parseFormulaCellKey(key)).to.deep.equal({ id: 'order-1', field: 'total' });
    });

    it('builds the same key from a ref object', () => {
      expect(getFormulaCellKey({ id: 'a', field: 'b' })).to.equal(createFormulaCellKey('a', 'b'));
    });

    it('does not collide for ids and fields that concatenate identically', () => {
      expect(createFormulaCellKey('ab', 'c')).not.to.equal(createFormulaCellKey('a', 'bc'));
    });

    it('stringifies numeric ids (documented coercion)', () => {
      expect(createFormulaCellKey(1, 'total')).to.equal(createFormulaCellKey('1', 'total'));
    });
  });

  describe('formula source detection', () => {
    it('recognizes strings with a leading =', () => {
      expect(isFormulaSource('=1 + 1')).to.equal(true);
      expect(isFormulaSource('=')).to.equal(true);
      expect(isFormulaSource('1 + 1')).to.equal(false);
      expect(isFormulaSource(' =1')).to.equal(false);
      expect(isFormulaSource(42)).to.equal(false);
      expect(isFormulaSource(null)).to.equal(false);
      expect(isFormulaSource(undefined)).to.equal(false);
    });

    it('recognizes the apostrophe escape for literal =', () => {
      expect(isEscapedFormulaSource("'=not a formula")).to.equal(true);
      expect(isEscapedFormulaSource('=formula')).to.equal(false);
      expect(isEscapedFormulaSource("'plain")).to.equal(false);
      expect(unescapeLiteralSource("'=text")).to.equal('=text');
    });

    it('strips the leading = from formula source', () => {
      expect(getFormulaExpression('=1 + 1')).to.equal('1 + 1');
      expect(getFormulaExpression('1 + 1')).to.equal('1 + 1');
    });
  });
});
