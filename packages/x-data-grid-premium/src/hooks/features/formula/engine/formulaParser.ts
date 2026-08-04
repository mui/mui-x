import { tokenizeFormula } from './formulaTokenizer';
import type { FormulaToken } from './formulaTokenizer';
import { FORMULA_BINARY_PRECEDENCE, FORMULA_RESERVED_NAMES } from './formulaAst';
import type {
  FormulaAstNode,
  FormulaBinaryOperator,
  FormulaCellRefNode,
  FormulaColumnSelector,
  FormulaRowSelector,
} from './formulaAst';
import type { FormulaSourceSpan } from './formulaTypes';

export interface FormulaParseError {
  message: string;
  span: FormulaSourceSpan;
}

export interface FormulaParseResult {
  /**
   * `null` when the source could not be parsed — the cell evaluates to `#ERROR!`.
   */
  ast: FormulaAstNode | null;
  error: FormulaParseError | null;
}

// Special forms are the reserved names minus the boolean literal keywords.
const SPECIAL_FORM_NAMES = new Set(
  FORMULA_RESERVED_NAMES.filter((name) => name !== 'TRUE' && name !== 'FALSE'),
);

/**
 * Bounds both parser recursion depth and constructed AST height, so that the
 * recursive evaluator and serializer can never overflow the JS stack on a
 * parser-produced AST. Hostile inputs (thousands of nested parentheses or
 * `1+1+...` chains) become ordinary parse errors instead of RangeErrors.
 */
const MAX_FORMULA_DEPTH = 500;

class ParseFailure {
  message: string;

  span: FormulaSourceSpan;

  constructor(message: string, span: FormulaSourceSpan) {
    this.message = message;
    this.span = span;
  }
}

class Parser {
  private tokens: FormulaToken[];

  private index = 0;

  private endSpan: FormulaSourceSpan;

  private recursionDepth = 0;

  private heights = new WeakMap<FormulaAstNode, number>();

  constructor(tokens: FormulaToken[], expressionLength: number) {
    this.tokens = tokens;
    this.endSpan = { start: expressionLength, end: expressionLength };
  }

  private peek(): FormulaToken | null {
    return this.tokens[this.index] ?? null;
  }

  private next(): FormulaToken | null {
    const token = this.tokens[this.index] ?? null;
    if (token !== null) {
      this.index += 1;
    }
    return token;
  }

  private currentSpan(): FormulaSourceSpan {
    return this.peek()?.span ?? this.endSpan;
  }

  private failure(message: string, span?: FormulaSourceSpan): ParseFailure {
    return new ParseFailure(message, span ?? this.currentSpan());
  }

  private enterRecursion(): void {
    this.recursionDepth += 1;
    if (this.recursionDepth > MAX_FORMULA_DEPTH) {
      throw this.failure('The formula is too deeply nested.');
    }
  }

  private exitRecursion(): void {
    this.recursionDepth -= 1;
  }

  /**
   * Records the height of a constructed node and rejects ASTs that would be
   * too tall for the recursive evaluator/serializer.
   */
  private withHeight<T extends FormulaAstNode>(node: T, height: number): T {
    if (height > MAX_FORMULA_DEPTH) {
      throw this.failure('The formula is too complex.', node.span);
    }
    this.heights.set(node, height);
    return node;
  }

  private heightOf(node: FormulaAstNode): number {
    return this.heights.get(node) ?? 1;
  }

  private expectPunctuation(value: '(' | ')' | ','): FormulaToken {
    const token = this.peek();
    if (token === null || token.type !== 'punctuation' || token.value !== value) {
      throw this.failure(`Expected "${value}".`);
    }
    return this.next()!;
  }

  parse(): FormulaAstNode {
    if (this.tokens.length === 0) {
      throw this.failure('The formula is empty.');
    }
    const node = this.parseExpression(1);
    const trailing = this.peek();
    if (trailing !== null) {
      throw this.failure(`Unexpected "${trailing.value}" after the expression.`, trailing.span);
    }
    return node;
  }

  private parseExpression(minPrecedence: number): FormulaAstNode {
    this.enterRecursion();
    let left = this.parseUnary();
    while (true) {
      const token = this.peek();
      if (token === null || token.type !== 'operator') {
        break;
      }
      const operator = token.value as FormulaBinaryOperator;
      const precedence = FORMULA_BINARY_PRECEDENCE[operator];
      if (precedence === undefined || precedence < minPrecedence) {
        break;
      }
      this.next();
      // +1 keeps every operator left-associative.
      const right = this.parseExpression(precedence + 1);
      left = this.withHeight(
        {
          type: 'binaryExpression',
          operator,
          left,
          right,
          span: { start: left.span.start, end: right.span.end },
        },
        Math.max(this.heightOf(left), this.heightOf(right)) + 1,
      );
    }
    this.exitRecursion();
    return left;
  }

  private parseUnary(): FormulaAstNode {
    const token = this.peek();
    if (
      token !== null &&
      token.type === 'operator' &&
      (token.value === '-' || token.value === '+')
    ) {
      this.enterRecursion();
      this.next();
      const operand = this.parseUnary();
      this.exitRecursion();
      return this.withHeight(
        {
          type: 'unaryExpression',
          operator: token.value,
          operand,
          span: { start: token.span.start, end: operand.span.end },
        },
        this.heightOf(operand) + 1,
      );
    }
    return this.parsePrimary();
  }

  private parsePrimary(): FormulaAstNode {
    const token = this.peek();
    if (token === null) {
      throw this.failure('Unexpected end of formula.');
    }

    if (token.type === 'number') {
      const value = parseFloat(token.value);
      if (!Number.isFinite(value)) {
        throw this.failure('The number literal is out of range.', token.span);
      }
      this.next();
      return { type: 'numberLiteral', value, span: token.span };
    }

    if (token.type === 'string') {
      this.next();
      return { type: 'stringLiteral', value: token.value, span: token.span };
    }

    if (token.type === 'punctuation' && token.value === '(') {
      const open = this.next()!;
      const node = this.parseExpression(1);
      const close = this.expectPunctuation(')');
      // The span widens to include the parentheses; the height is unchanged.
      return this.withHeight(
        { ...node, span: { start: open.span.start, end: close.span.end } },
        this.heightOf(node),
      );
    }

    if (token.type === 'identifier') {
      return this.parseIdentifier();
    }

    throw this.failure(`Unexpected "${token.value}".`, token.span);
  }

  private parseIdentifier(): FormulaAstNode {
    const token = this.next()!;
    const upperName = token.value.toUpperCase();
    const nextToken = this.peek();
    const isCall =
      nextToken !== null && nextToken.type === 'punctuation' && nextToken.value === '(';

    if (!isCall) {
      if (upperName === 'TRUE' || upperName === 'FALSE') {
        return { type: 'booleanLiteral', value: upperName === 'TRUE', span: token.span };
      }
      // Any other bare identifier is a same-row field reference. The field's
      // existence is an evaluation concern (#REF!), never a parse concern.
      return { type: 'fieldRef', field: token.value, span: token.span };
    }

    if (SPECIAL_FORM_NAMES.has(upperName)) {
      return this.parseSpecialForm(upperName, token);
    }

    if (upperName === 'TRUE' || upperName === 'FALSE') {
      throw this.failure(`"${upperName}" is not a function.`, token.span);
    }

    this.expectPunctuation('(');
    const args: FormulaAstNode[] = [];
    const closingForEmpty = this.peek();
    if (
      closingForEmpty !== null &&
      closingForEmpty.type === 'punctuation' &&
      closingForEmpty.value === ')'
    ) {
      const closing = this.next()!;
      return {
        type: 'functionCall',
        name: upperName,
        args,
        span: { start: token.span.start, end: closing.span.end },
      };
    }
    while (true) {
      args.push(this.parseExpression(1));
      const separator = this.peek();
      if (separator !== null && separator.type === 'punctuation' && separator.value === ',') {
        this.next();
        continue;
      }
      break;
    }
    const closing = this.expectPunctuation(')');
    return this.withHeight(
      {
        type: 'functionCall',
        name: upperName,
        args,
        span: { start: token.span.start, end: closing.span.end },
      },
      Math.max(...args.map((arg) => this.heightOf(arg))) + 1,
    );
  }

  /**
   * Special forms enforce literal-only arguments so that static dependency
   * extraction stays decidable. Computed references are parse errors.
   */
  private parseSpecialForm(name: string, nameToken: FormulaToken): FormulaAstNode {
    switch (name) {
      case 'FIELD': {
        this.expectPunctuation('(');
        const field = this.expectStringLiteral('FIELD');
        const closing = this.expectPunctuation(')');
        return {
          type: 'fieldRef',
          field,
          span: { start: nameToken.span.start, end: closing.span.end },
        };
      }
      case 'REF':
        return this.parseRef(nameToken);
      case 'RANGE': {
        this.expectPunctuation('(');
        const start = this.parseRefAnchor();
        this.expectPunctuation(',');
        const end = this.parseRefAnchor();
        const closing = this.expectPunctuation(')');
        return {
          type: 'range',
          start,
          end,
          span: { start: nameToken.span.start, end: closing.span.end },
        };
      }
      case 'COLUMN_VALUES': {
        this.expectPunctuation('(');
        const field = this.expectStringLiteral('COLUMN_VALUES');
        const closing = this.expectPunctuation(')');
        return {
          type: 'columnValues',
          field,
          span: { start: nameToken.span.start, end: closing.span.end },
        };
      }
      default:
        // COLUMN, ROW, COLUMN_POSITION, ROW_POSITION
        throw this.failure(`"${name}" can only be used inside REF().`, nameToken.span);
    }
  }

  private parseRefAnchor(): FormulaCellRefNode {
    const token = this.peek();
    if (token === null || token.type !== 'identifier' || token.value.toUpperCase() !== 'REF') {
      throw this.failure('RANGE() anchors must be REF() references.');
    }
    const nameToken = this.next()!;
    return this.parseRef(nameToken);
  }

  private parseRef(nameToken: FormulaToken): FormulaCellRefNode {
    this.expectPunctuation('(');
    const column = this.parseColumnSelector();
    this.expectPunctuation(',');
    const row = this.parseRowSelector();
    const closing = this.expectPunctuation(')');
    return {
      type: 'cellRef',
      column,
      row,
      span: { start: nameToken.span.start, end: closing.span.end },
    };
  }

  private parseColumnSelector(): FormulaColumnSelector {
    const token = this.peek();
    if (token !== null && token.type === 'identifier') {
      const upper = token.value.toUpperCase();
      if (upper === 'COLUMN') {
        this.next();
        this.expectPunctuation('(');
        const field = this.expectStringLiteral('COLUMN');
        this.expectPunctuation(')');
        return { kind: 'field', field };
      }
      if (upper === 'COLUMN_POSITION') {
        this.next();
        this.expectPunctuation('(');
        const index = this.expectPositionLiteral('COLUMN_POSITION');
        this.expectPunctuation(')');
        return { kind: 'position', index };
      }
    }
    throw this.failure('Expected COLUMN("field") or COLUMN_POSITION(index).');
  }

  private parseRowSelector(): FormulaRowSelector {
    const token = this.peek();
    if (token !== null && token.type === 'identifier') {
      const upper = token.value.toUpperCase();
      if (upper === 'ROW') {
        this.next();
        this.expectPunctuation('(');
        // A sign before a number literal is still a literal: numeric row ids
        // may be negative and the serializer must be able to round-trip them.
        let negate = false;
        let idToken = this.peek();
        if (idToken !== null && idToken.type === 'operator' && idToken.value === '-') {
          const afterSign = this.tokens[this.index + 1];
          if (afterSign !== undefined && afterSign.type === 'number') {
            this.next();
            negate = true;
            idToken = this.peek();
          }
        }
        if (idToken === null || (idToken.type !== 'string' && idToken.type !== 'number')) {
          throw this.failure('ROW() expects a row id as a string or number literal.');
        }
        this.next();
        let id: string | number;
        if (idToken.type === 'string') {
          id = idToken.value;
        } else {
          const numericId = parseFloat(idToken.value);
          if (!Number.isFinite(numericId)) {
            throw this.failure('ROW() expects a finite number literal.', idToken.span);
          }
          id = negate ? -numericId : numericId;
        }
        this.expectPunctuation(')');
        return { kind: 'id', id };
      }
      if (upper === 'ROW_POSITION') {
        this.next();
        this.expectPunctuation('(');
        const index = this.expectPositionLiteral('ROW_POSITION');
        this.expectPunctuation(')');
        return { kind: 'position', index };
      }
    }
    throw this.failure('Expected ROW(id) or ROW_POSITION(index).');
  }

  private expectStringLiteral(formName: string): string {
    const token = this.peek();
    if (token === null || token.type !== 'string') {
      throw this.failure(`${formName}() expects a string literal.`);
    }
    this.next();
    return token.value;
  }

  private expectPositionLiteral(formName: string): number {
    const token = this.peek();
    if (token === null || token.type !== 'number') {
      throw this.failure(`${formName}() expects a number literal.`);
    }
    const index = parseFloat(token.value);
    if (!Number.isInteger(index) || index < 1) {
      throw this.failure(
        `${formName}() expects a positive integer (1-based position).`,
        token.span,
      );
    }
    this.next();
    return index;
  }
}

/**
 * Parses a formula expression (the source without its leading `=`).
 * Never throws: malformed input yields `{ ast: null, error }`.
 */
export function parseFormula(expression: string): FormulaParseResult {
  const { tokens, error } = tokenizeFormula(expression);
  if (error !== null) {
    return { ast: null, error };
  }
  try {
    const ast = new Parser(tokens, expression.length).parse();
    return { ast, error: null };
  } catch (failure) {
    if (failure instanceof ParseFailure) {
      return { ast: null, error: { message: failure.message, span: failure.span } };
    }
    if (failure instanceof RangeError) {
      // Backstop for the never-throws contract; the depth/height bounds
      // should make this unreachable.
      return {
        ast: null,
        error: {
          message: 'The formula is too complex.',
          span: { start: 0, end: expression.length },
        },
      };
    }
    throw failure;
  }
}

export interface FormulaParser {
  parse: (expression: string) => FormulaParseResult;
  clear: () => void;
}

/**
 * Parser with AST interning: identical source strings share one immutable
 * parse result. With computed columns the same formula repeats once per row,
 * so this turns N parses into 1 parse + N cache hits.
 */
export function createFormulaParser(): FormulaParser {
  const cache = new Map<string, FormulaParseResult>();
  return {
    parse(expression: string): FormulaParseResult {
      let result = cache.get(expression);
      if (result === undefined) {
        result = parseFormula(expression);
        cache.set(expression, result);
      }
      return result;
    },
    clear() {
      cache.clear();
    },
  };
}
