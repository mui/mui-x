import type {
  FormulaAstNode,
  FormulaCellRefNode,
  FormulaColumnValuesNode,
  FormulaFieldRefNode,
  FormulaRangeNode,
} from './formulaAst';
import {
  CELL_REF_REGEX,
  IDENTIFIER_REGEX,
  WHITESPACE_REGEX,
  buildCellRefNode,
  buildColumnValuesNode,
  matchColumnRange,
  matchRangeTail,
  readParsedRef,
  scanStringLiteral,
} from './formulaA1';
import { parseFormula } from './formulaParser';
import type { FormulaPositionContext, FormulaSourceSpan } from './formulaTypes';

/**
 * The reference-bearing AST node kinds the editor colors and the grid outlines.
 * A `range`/`cellRef`/`columnValues`/`fieldRef` is one reference: the whole node
 * is one colored chunk, never its inner anchors.
 */
export type FormulaReferenceNode =
  | FormulaFieldRefNode
  | FormulaCellRefNode
  | FormulaRangeNode
  | FormulaColumnValuesNode;

/**
 * A reference scanned from formula source, dialect-agnostic. `spans` are
 * offsets into the EXPRESSION (without the leading `=`), in the shown dialect's
 * coordinates. `node` carries the selectors the grid adapter resolves against a
 * position context to a concrete cell/range/column target. Spans are a list to
 * leave room for the canonical inner-identity refinement (one node, several
 * colored chunks); the producers below emit exactly one span per reference.
 */
export interface FormulaRawReference {
  spans: FormulaSourceSpan[];
  node: FormulaReferenceNode;
}

/**
 * Collects references from a parsed canonical AST. A `range` is taken whole —
 * its anchor `cellRef`s are not walked — so the editor colors the entire
 * `RANGE(...)` chunk (Option A) and the grid draws one rectangle. References are
 * returned in source order (by span start) so palette colors cycle stably.
 */
export function collectCanonicalReferences(ast: FormulaAstNode): FormulaRawReference[] {
  const references: FormulaRawReference[] = [];
  const stack: FormulaAstNode[] = [ast];
  while (stack.length > 0) {
    const node = stack.pop()!;
    switch (node.type) {
      case 'fieldRef':
      case 'cellRef':
      case 'range':
      case 'columnValues':
        references.push({ spans: [node.span], node });
        break;
      case 'functionCall':
        for (let i = node.args.length - 1; i >= 0; i -= 1) {
          stack.push(node.args[i]);
        }
        break;
      case 'unaryExpression':
        stack.push(node.operand);
        break;
      case 'binaryExpression':
        stack.push(node.right);
        stack.push(node.left);
        break;
      default:
        // Literals carry no reference.
        break;
    }
  }
  references.sort((a, b) => a.spans[0].start - b.spans[0].start);
  return references;
}

/**
 * Scans references straight out of A1 source. Forked from the `toCanonicalFormula`
 * scan loop and sharing its tokenization primitives, so the highlighted tokens
 * are exactly the ones the commit transform rewrites — they can never disagree.
 * Unlike the canonical walk, this is textual and robust to a half-typed formula:
 * it colors `B5` even when the rest of the expression does not yet parse.
 *
 * Records A1-source spans directly (the canonical AST built from A1 input has no
 * usable spans — `toCanonicalFormula` stamps `ZERO_SPAN` on every rewritten
 * node). The selector nodes are built with the same `buildCellRefNode` /
 * `buildColumnValuesNode` the commit uses, so resolution is dialect-uniform.
 */
export function scanA1References(
  expression: string,
  positionContext: FormulaPositionContext,
): FormulaRawReference[] {
  const references: FormulaRawReference[] = [];
  let index = 0;

  while (index < expression.length) {
    const rest = expression.slice(index);
    const char = expression[index];

    if (char === '"') {
      index = scanStringLiteral(expression, index);
      continue;
    }

    const whitespace = WHITESPACE_REGEX.exec(rest);
    if (whitespace !== null) {
      index += whitespace[0].length;
      continue;
    }

    const cellMatch = CELL_REF_REGEX.exec(rest);
    if (cellMatch !== null) {
      const startRef = readParsedRef(cellMatch);
      const afterFirst = index + cellMatch[0].length;
      const rangeTail = matchRangeTail(expression, afterFirst);
      if (rangeTail !== null) {
        const span: FormulaSourceSpan = { start: index, end: rangeTail.end };
        const node: FormulaRangeNode = {
          type: 'range',
          start: buildCellRefNode(startRef, positionContext, 0, 0),
          end: buildCellRefNode(rangeTail.endRef, positionContext, 0, 0),
          span,
        };
        references.push({ spans: [span], node });
        index = rangeTail.end;
      } else {
        const span: FormulaSourceSpan = { start: index, end: afterFirst };
        const node = buildCellRefNode(startRef, positionContext, 0, 0);
        // `buildCellRefNode` stamps `ZERO_SPAN`; record the real A1-source span.
        node.span = span;
        references.push({ spans: [span], node });
        index = afterFirst;
      }
      continue;
    }

    const columnRange = matchColumnRange(expression, index);
    if (columnRange !== null) {
      const node = buildColumnValuesNode(columnRange, positionContext, 0);
      if (node !== null) {
        const span: FormulaSourceSpan = { start: index, end: columnRange.end };
        node.span = span;
        references.push({ spans: [span], node });
        index = columnRange.end;
        continue;
      }
      // Out-of-bounds whole-column (`Z:Z` past the last column): no resolvable
      // target, so it is left as plain text — same end state as `unresolved`.
    }

    const identifier = IDENTIFIER_REGEX.exec(rest);
    if (identifier !== null) {
      const end = index + identifier[0].length;
      // A bare identifier is a same-row field reference unless it is a function
      // call. The tokenizer skips whitespace, so `name (` is a call too — skip
      // inline whitespace before the `(` test to match the parser. An identifier
      // naming neither a field nor a function falls out as `unresolved` at
      // resolution time (no color, no rectangle).
      let afterIdentifier = end;
      while (afterIdentifier < expression.length && /\s/.test(expression[afterIdentifier])) {
        afterIdentifier += 1;
      }
      if (expression[afterIdentifier] !== '(') {
        const span: FormulaSourceSpan = { start: index, end };
        const node: FormulaFieldRefNode = { type: 'fieldRef', field: identifier[0], span };
        references.push({ spans: [span], node });
      }
      index = end;
      continue;
    }

    index += 1;
  }

  return references;
}

/**
 * Produces the dialect-appropriate reference list for an expression (without the
 * leading `=`). A1 mode scans the A1 text directly; canonical mode walks the
 * parsed AST. Both yield `FormulaRawReference[]` with expression-relative spans
 * and selector nodes the grid adapter resolves and colors.
 */
export function buildFormulaReferences(
  expression: string,
  options: { a1Notation: boolean; positionContext: FormulaPositionContext },
): FormulaRawReference[] {
  if (options.a1Notation) {
    return scanA1References(expression, options.positionContext);
  }
  const { ast } = parseFormula(expression);
  if (ast === null) {
    return [];
  }
  return collectCanonicalReferences(ast);
}
