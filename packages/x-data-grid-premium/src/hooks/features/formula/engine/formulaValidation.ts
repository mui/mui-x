import { parseFormula } from './formulaParser';
import type { FormulaAstNode } from './formulaAst';
import type { FormulaValidationIssue, FormulaValidationResult } from './formulaTypes';
import { getFormulaFunctionArityError } from './formulaFunctions';
import type { FormulaFunctionRegistry } from './formulaFunctions';

export interface ValidateFormulaExpressionOptions {
  /**
   * When provided, function calls are checked: unknown names are reported as
   * `#NAME?` issues and arity violations as `#VALUE!` issues.
   */
  functions?: FormulaFunctionRegistry;
}

function collectFunctionCallIssues(
  ast: FormulaAstNode,
  functions: FormulaFunctionRegistry,
): FormulaValidationIssue[] {
  const issues: FormulaValidationIssue[] = [];
  const reportedUnknownNames = new Set<string>();
  const stack: FormulaAstNode[] = [ast];
  while (stack.length > 0) {
    const node = stack.pop()!;
    switch (node.type) {
      case 'functionCall': {
        const definition = functions.get(node.name);
        if (definition === undefined) {
          if (!reportedUnknownNames.has(node.name)) {
            reportedUnknownNames.add(node.name);
            issues.push({
              code: '#NAME?',
              message: `Unknown function "${node.name}".`,
              span: node.span,
            });
          }
        } else {
          const arityError = getFormulaFunctionArityError(definition, node.args.length);
          if (arityError !== null) {
            issues.push({ code: '#VALUE!', message: arityError.message!, span: node.span });
          }
        }
        for (let i = node.args.length - 1; i >= 0; i -= 1) {
          stack.push(node.args[i]);
        }
        break;
      }
      case 'unaryExpression':
        stack.push(node.operand);
        break;
      case 'binaryExpression':
        stack.push(node.right);
        stack.push(node.left);
        break;
      default:
        break;
    }
  }
  return issues;
}

/**
 * Static validation of a formula expression (the source without its leading
 * `=`): syntax and, when a registry is provided, function-name resolution and
 * argument arity. This powers editor hints — validation is informative,
 * never commit-blocking.
 */
export function validateFormulaExpression(
  expression: string,
  options: ValidateFormulaExpressionOptions = {},
): FormulaValidationResult {
  const { ast, error } = parseFormula(expression);
  if (ast === null) {
    const issue: FormulaValidationIssue = {
      code: '#ERROR!',
      message: error?.message ?? 'The formula could not be parsed.',
    };
    if (error !== null) {
      issue.span = error.span;
    }
    return { valid: false, issues: [issue] };
  }

  const issues =
    options.functions === undefined ? [] : collectFunctionCallIssues(ast, options.functions);

  return { valid: issues.length === 0, issues };
}
