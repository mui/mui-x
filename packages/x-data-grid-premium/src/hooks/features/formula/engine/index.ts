/**
 * Pure formula engine: tokenize, parse, serialize, extract dependencies,
 * evaluate, and order recomputation. No React, no grid imports — files in
 * this folder may only import from this folder.
 *
 * The engine surface is internal to the package; it is deliberately not
 * re-exported from the public barrel.
 */
export type {
  FormulaCellKey,
  FormulaCellRef,
  FormulaPositionContext,
  FormulaRangeValue,
  FormulaResult,
  FormulaRowId,
  FormulaScalar,
  FormulaSourceSpan,
  FormulaValidationIssue,
  FormulaValidationResult,
} from './formulaTypes';
export {
  createFormulaCellKey,
  getFormulaCellKey,
  parseFormulaCellKey,
  isFormulaSource,
  isEscapedFormulaSource,
  unescapeLiteralSource,
  getFormulaExpression,
  isFormulaRangeValue,
} from './formulaTypes';

export type { FormulaErrorCode, FormulaErrorValue } from './formulaErrors';
export { FORMULA_ERROR_CODES, createFormulaError, isFormulaErrorValue } from './formulaErrors';

export type {
  FormulaAstNode,
  FormulaBinaryExpressionNode,
  FormulaBinaryOperator,
  FormulaBooleanLiteralNode,
  FormulaCellRefNode,
  FormulaColumnSelector,
  FormulaColumnValuesNode,
  FormulaFieldRefNode,
  FormulaFunctionCallNode,
  FormulaNumberLiteralNode,
  FormulaRangeNode,
  FormulaRowSelector,
  FormulaStringLiteralNode,
  FormulaUnaryExpressionNode,
} from './formulaAst';
export { FORMULA_RESERVED_NAMES } from './formulaAst';

export {
  toFormulaNumber,
  toFormulaText,
  toFormulaBoolean,
  isEmptyFormulaValue,
  compareFormulaScalars,
} from './formulaValues';

export type {
  FormulaToken,
  FormulaTokenType,
  FormulaTokenizeError,
  FormulaTokenizeResult,
} from './formulaTokenizer';
export { tokenizeFormula } from './formulaTokenizer';

export type { FormulaParseError, FormulaParseResult, FormulaParser } from './formulaParser';
export { parseFormula, createFormulaParser } from './formulaParser';

export { serializeFormulaAst } from './formulaSerializer';

export type {
  FormulaBoundDependencies,
  FormulaColumnIntervalDependency,
  FormulaStaticDependencies,
  FormulaWholeColumnDependency,
} from './formulaDependencies';
export { extractFormulaDependencies, bindFormulaDependencies } from './formulaDependencies';

export type {
  FormulaFunctionArg,
  FormulaFunctionCoercionHelpers,
  FormulaFunctionContext,
  FormulaFunctionDefinition,
  FormulaFunctionEagerArg,
  FormulaFunctionRegistry,
} from './formulaFunctions';
export { FORMULA_BUILT_IN_FUNCTIONS, createFormulaFunctionRegistry } from './formulaFunctions';

export type { FormulaEvaluationContext } from './formulaEvaluator';
export { evaluateFormula } from './formulaEvaluator';

export type { ValidateFormulaExpressionOptions } from './formulaValidation';
export { validateFormulaExpression } from './formulaValidation';

export type { FormulaRecomputeOrder } from './formulaGraph';
export { collectAffectedCells, orderForRecompute } from './formulaGraph';
