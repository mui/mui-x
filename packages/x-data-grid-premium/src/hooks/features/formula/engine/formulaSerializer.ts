import { FORMULA_BINARY_PRECEDENCE } from './formulaAst';
import type { FormulaAstNode, FormulaColumnSelector, FormulaRowSelector } from './formulaAst';

const BARE_FIELD_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

function serializeString(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function serializeFieldRef(field: string): string {
  const upper = field.toUpperCase();
  // TRUE/FALSE parse as boolean literals when bare; other reserved names are
  // only special when followed by `(`, so a bare `REF` round-trips fine.
  if (BARE_FIELD_REGEX.test(field) && upper !== 'TRUE' && upper !== 'FALSE') {
    return field;
  }
  return `FIELD(${serializeString(field)})`;
}

function serializeColumnSelector(selector: FormulaColumnSelector): string {
  if (selector.kind === 'field') {
    return `COLUMN(${serializeString(selector.field)})`;
  }
  return `COLUMN_POSITION(${selector.index})`;
}

function serializeRowSelector(selector: FormulaRowSelector): string {
  if (selector.kind === 'id') {
    return typeof selector.id === 'string'
      ? `ROW(${serializeString(selector.id)})`
      : `ROW(${selector.id})`;
  }
  return `ROW_POSITION(${selector.index})`;
}

/**
 * Wraps the operand in parentheses when its precedence is below the minimum
 * the surrounding context requires. Unary expressions and atoms never need them.
 */
function serializeOperand(node: FormulaAstNode, minPrecedence: number): string {
  const text = serializeNode(node);
  if (
    node.type === 'binaryExpression' &&
    FORMULA_BINARY_PRECEDENCE[node.operator] < minPrecedence
  ) {
    return `(${text})`;
  }
  return text;
}

function serializeNode(node: FormulaAstNode): string {
  switch (node.type) {
    case 'numberLiteral':
      return String(node.value);
    case 'stringLiteral':
      return serializeString(node.value);
    case 'booleanLiteral':
      return node.value ? 'TRUE' : 'FALSE';
    case 'fieldRef':
      return serializeFieldRef(node.field);
    case 'cellRef':
      return `REF(${serializeColumnSelector(node.column)}, ${serializeRowSelector(node.row)})`;
    case 'range':
      return `RANGE(${serializeNode(node.start)}, ${serializeNode(node.end)})`;
    case 'columnValues':
      return `COLUMN_VALUES(${serializeString(node.field)})`;
    case 'unaryExpression': {
      const operand = serializeNode(node.operand);
      // Parenthesize compound operands: `-(1 + 2)`, `-(-1)`.
      if (node.operand.type === 'binaryExpression' || node.operand.type === 'unaryExpression') {
        return `${node.operator}(${operand})`;
      }
      return `${node.operator}${operand}`;
    }
    case 'binaryExpression': {
      const precedence = FORMULA_BINARY_PRECEDENCE[node.operator];
      const left = serializeOperand(node.left, precedence);
      // +1 re-derives left-associativity: an equal-precedence right child
      // needs parentheses (`1 - (2 - 3)`).
      const right = serializeOperand(node.right, precedence + 1);
      return `${left} ${node.operator} ${right}`;
    }
    case 'functionCall':
      return `${node.name}(${node.args.map(serializeNode).join(', ')})`;
    default:
      return '';
  }
}

/**
 * Serializes an AST back to a canonical expression string (without the leading
 * `=`). Stable formatting: uppercase function names, `, ` separators, minimal
 * parentheses re-derived from precedence. `parseFormula(serializeFormulaAst(ast))`
 * yields a structurally identical AST (modulo source spans).
 *
 * The round-trip guarantee covers parser-produced ASTs. Hand-built ASTs must
 * respect the parser's invariants: heights below the parser's depth bound,
 * finite number literals, and negation encoded as a `unaryExpression` over a
 * non-negative `numberLiteral` (negative `numberLiteral` values serialize to
 * text the parser reads as a unary expression).
 */
export function serializeFormulaAst(node: FormulaAstNode): string {
  return serializeNode(node);
}
