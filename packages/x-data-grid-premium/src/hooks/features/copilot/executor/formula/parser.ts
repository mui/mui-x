import { FormulaError, type BinaryOperator, type FormulaNode } from './types';

type Token =
  | { kind: 'number'; value: number; pos: number }
  | { kind: 'string'; value: string; pos: number }
  | { kind: 'ident'; value: string; pos: number }
  | { kind: 'column'; value: string; pos: number }
  | { kind: 'op'; value: string; pos: number }
  | { kind: 'lparen'; pos: number }
  | { kind: 'rparen'; pos: number }
  | { kind: 'comma'; pos: number }
  | { kind: 'eof'; pos: number };

const SINGLE_OPS = new Set(['+', '-', '*', '/', '%', '=', '<', '>', ',']);

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const c = input[i];

    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i += 1;
      continue;
    }

    if (c === '(') {
      tokens.push({ kind: 'lparen', pos: i });
      i += 1;
      continue;
    }
    if (c === ')') {
      tokens.push({ kind: 'rparen', pos: i });
      i += 1;
      continue;
    }
    if (c === ',') {
      tokens.push({ kind: 'comma', pos: i });
      i += 1;
      continue;
    }

    if (c === '[') {
      const end = input.indexOf(']', i + 1);
      if (end === -1) {
        throw new FormulaError(`Unterminated [column] reference at position ${i}`);
      }
      const field = input.slice(i + 1, end).trim();
      if (!field) {
        throw new FormulaError(`Empty column reference at position ${i}`);
      }
      tokens.push({ kind: 'column', value: field, pos: i });
      i = end + 1;
      continue;
    }

    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      let str = '';
      while (j < input.length && input[j] !== quote) {
        if (input[j] === '\\' && j + 1 < input.length) {
          str += input[j + 1];
          j += 2;
        } else {
          str += input[j];
          j += 1;
        }
      }
      if (j >= input.length) {
        throw new FormulaError(`Unterminated string literal at position ${i}`);
      }
      tokens.push({ kind: 'string', value: str, pos: i });
      i = j + 1;
      continue;
    }

    if (c >= '0' && c <= '9') {
      let j = i;
      let hasDot = false;
      while (j < input.length) {
        const ch = input[j];
        if (ch >= '0' && ch <= '9') {
          j += 1;
        } else if (ch === '.' && !hasDot) {
          hasDot = true;
          j += 1;
        } else {
          break;
        }
      }
      tokens.push({ kind: 'number', value: Number(input.slice(i, j)), pos: i });
      i = j;
      continue;
    }

    if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c === '_') {
      let j = i;
      while (j < input.length) {
        const ch = input[j];
        if (
          (ch >= 'A' && ch <= 'Z') ||
          (ch >= 'a' && ch <= 'z') ||
          (ch >= '0' && ch <= '9') ||
          ch === '_' ||
          ch === '.'
        ) {
          j += 1;
        } else {
          break;
        }
      }
      tokens.push({ kind: 'ident', value: input.slice(i, j), pos: i });
      i = j;
      continue;
    }

    if (c === '<' && input[i + 1] === '=') {
      tokens.push({ kind: 'op', value: '<=', pos: i });
      i += 2;
      continue;
    }
    if (c === '>' && input[i + 1] === '=') {
      tokens.push({ kind: 'op', value: '>=', pos: i });
      i += 2;
      continue;
    }
    if (c === '<' && input[i + 1] === '>') {
      tokens.push({ kind: 'op', value: '!=', pos: i });
      i += 2;
      continue;
    }
    if (c === '!' && input[i + 1] === '=') {
      tokens.push({ kind: 'op', value: '!=', pos: i });
      i += 2;
      continue;
    }
    if (c === '=' && input[i + 1] === '=') {
      tokens.push({ kind: 'op', value: '=', pos: i });
      i += 2;
      continue;
    }

    if (SINGLE_OPS.has(c)) {
      tokens.push({ kind: 'op', value: c, pos: i });
      i += 1;
      continue;
    }

    throw new FormulaError(`Unexpected character '${c}' at position ${i}`);
  }

  tokens.push({ kind: 'eof', pos: input.length });
  return tokens;
}

const PRECEDENCE: Record<string, number> = {
  '=': 1,
  '!=': 1,
  '<': 2,
  '<=': 2,
  '>': 2,
  '>=': 2,
  '+': 3,
  '-': 3,
  '*': 4,
  '/': 4,
  '%': 4,
};

const BINARY_OPS: Record<string, BinaryOperator> = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '%': '%',
  '=': '=',
  '!=': '!=',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>=',
};

class Parser {
  private pos = 0;

  constructor(private tokens: Token[]) {}

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    const t = this.tokens[this.pos];
    this.pos += 1;
    return t;
  }

  private expect(kind: Token['kind'], message: string): Token {
    const t = this.peek();
    if (t.kind !== kind) {
      throw new FormulaError(`${message} (got '${describe(t)}' at position ${t.pos})`);
    }
    return this.advance();
  }

  parseExpression(): FormulaNode {
    const node = this.parseBinary(0);
    if (this.peek().kind !== 'eof') {
      const t = this.peek();
      throw new FormulaError(`Unexpected token '${describe(t)}' at position ${t.pos}`);
    }
    return node;
  }

  private parseBinary(minPrec: number): FormulaNode {
    let left = this.parseUnary();
    while (true) {
      const t = this.peek();
      if (t.kind !== 'op') {
        break;
      }
      const prec = PRECEDENCE[t.value];
      if (prec === undefined || prec < minPrec) {
        break;
      }
      this.advance();
      const right = this.parseBinary(prec + 1);
      const op = BINARY_OPS[t.value];
      if (!op) {
        throw new FormulaError(`Unknown operator '${t.value}' at position ${t.pos}`);
      }
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  private parseUnary(): FormulaNode {
    const t = this.peek();
    if (t.kind === 'op' && (t.value === '-' || t.value === '+')) {
      this.advance();
      const operand = this.parseUnary();
      return { type: 'unary', op: t.value as '+' | '-', operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): FormulaNode {
    const t = this.peek();

    if (t.kind === 'number') {
      this.advance();
      return { type: 'literal', value: t.value };
    }
    if (t.kind === 'string') {
      this.advance();
      return { type: 'literal', value: t.value };
    }
    if (t.kind === 'column') {
      this.advance();
      return { type: 'column', field: t.value };
    }
    if (t.kind === 'lparen') {
      this.advance();
      const node = this.parseBinary(0);
      this.expect('rparen', "Expected ')'");
      return node;
    }
    if (t.kind === 'ident') {
      this.advance();
      const upper = t.value.toUpperCase();
      if (upper === 'TRUE') {
        return { type: 'literal', value: true };
      }
      if (upper === 'FALSE') {
        return { type: 'literal', value: false };
      }
      if (upper === 'NULL') {
        return { type: 'literal', value: null };
      }
      if (this.peek().kind === 'lparen') {
        this.advance();
        const args: FormulaNode[] = [];
        if (this.peek().kind !== 'rparen') {
          args.push(this.parseBinary(0));
          while (this.peek().kind === 'comma') {
            this.advance();
            args.push(this.parseBinary(0));
          }
        }
        this.expect('rparen', `Expected ')' to close ${upper}(...)`);
        return { type: 'call', name: upper, args };
      }
      // Bare identifier: treat as column ref (field id).
      return { type: 'column', field: t.value };
    }

    throw new FormulaError(`Unexpected token '${describe(t)}' at position ${t.pos}`);
  }
}

function describe(t: Token): string {
  switch (t.kind) {
    case 'number':
      return String(t.value);
    case 'string':
      return `"${t.value}"`;
    case 'ident':
      return t.value;
    case 'column':
      return `[${t.value}]`;
    case 'op':
      return t.value;
    case 'lparen':
      return '(';
    case 'rparen':
      return ')';
    case 'comma':
      return ',';
    case 'eof':
      return '<end>';
    default:
      return '?';
  }
}

export function parseFormula(input: string): FormulaNode {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new FormulaError('Formula is empty');
  }
  const tokens = tokenize(input);
  return new Parser(tokens).parseExpression();
}
