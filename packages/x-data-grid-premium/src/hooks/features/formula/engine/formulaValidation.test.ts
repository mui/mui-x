import { createFormulaFunctionRegistry } from './formulaFunctions';
import { validateFormulaExpression } from './formulaValidation';

describe('formulaValidation', () => {
  it('accepts a well-formed expression', () => {
    expect(validateFormulaExpression('price * quantity')).to.deep.equal({
      valid: true,
      issues: [],
    });
  });

  it('reports a syntax error with its span', () => {
    const result = validateFormulaExpression('1 +');
    expect(result.valid).to.equal(false);
    expect(result.issues).to.have.length(1);
    expect(result.issues[0].code).to.equal('#ERROR!');
    expect(result.issues[0].message).to.equal('Unexpected end of formula.');
    expect(result.issues[0].span).to.deep.equal({ start: 3, end: 3 });
  });

  it('does not check function names without a registry', () => {
    expect(validateFormulaExpression('NOPE(1)').valid).to.equal(true);
  });

  it('reports unknown function names with their span when a registry is provided', () => {
    const functions = createFormulaFunctionRegistry();
    const result = validateFormulaExpression('NOPE(SUM(1))', { functions });
    expect(result.valid).to.equal(false);
    expect(result.issues).to.deep.equal([
      { code: '#NAME?', message: 'Unknown function "NOPE".', span: { start: 0, end: 12 } },
    ]);
  });

  it('reports an unknown function once even when called repeatedly', () => {
    const functions = createFormulaFunctionRegistry();
    const result = validateFormulaExpression('NOPE(1) + NOPE(2)', { functions });
    expect(result.issues).to.have.length(1);
  });

  it('reports arity violations as #VALUE! issues with their span', () => {
    const functions = createFormulaFunctionRegistry();
    const tooMany = validateFormulaExpression('ABS(1, 2)', { functions });
    expect(tooMany.valid).to.equal(false);
    expect(tooMany.issues).to.deep.equal([
      {
        code: '#VALUE!',
        message: 'ABS() expects at most 1 argument(s).',
        span: { start: 0, end: 9 },
      },
    ]);

    const tooFew = validateFormulaExpression('IF(TRUE)', { functions });
    expect(tooFew.issues[0].message).to.equal('IF() expects at least 2 argument(s).');
  });

  it('does not limit variadic functions', () => {
    const functions = createFormulaFunctionRegistry();
    expect(validateFormulaExpression('SUM(1, 2, 3, 4, 5)', { functions }).valid).to.equal(true);
  });

  it('does not report a spurious arity issue for unknown functions', () => {
    const functions = createFormulaFunctionRegistry();
    const result = validateFormulaExpression('NOPE()', { functions });
    expect(result.issues).to.have.length(1);
    expect(result.issues[0].code).to.equal('#NAME?');
  });

  it('accepts known functions case-insensitively', () => {
    const functions = createFormulaFunctionRegistry();
    expect(validateFormulaExpression('sum(1, 2)', { functions }).valid).to.equal(true);
  });

  it('never throws for malformed input (validation is informative, not blocking)', () => {
    expect(validateFormulaExpression('').valid).to.equal(false);
    expect(validateFormulaExpression('"unterminated').valid).to.equal(false);
    expect(validateFormulaExpression('@@@').valid).to.equal(false);
  });
});
