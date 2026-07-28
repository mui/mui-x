export interface ParsedSx {
  value: Record<string, unknown> | undefined;
  error: string | undefined;
}

const IDENTIFIER_CHAR = /[A-Za-z0-9_$]/;
const DIGIT = /[0-9]/;
const UNSAFE_OBJECT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * A tiny recursive-descent parser for a safe subset of JavaScript object-literal
 * syntax — objects, arrays, strings, numbers, booleans, and `null`, with quoted
 * or bare identifier keys and trailing commas. It does NOT execute the input.
 *
 * The playground Classes editor accepts pasted snippets, so evaluating the text
 * (e.g. via `new Function`/`eval`) would run arbitrary JavaScript in the docs
 * origin. Anything executable — function/arrow values, calls, bare identifiers,
 * template literals — is rejected with an error instead of being run.
 */
class SxParser {
  private pos = 0;

  constructor(private readonly input: string) {}

  parse(): unknown {
    this.skipTrivia();
    // Allow the expression-wrapped form `({ … })` as well as a bare `{ … }`.
    let wrapped = false;
    if (this.peek() === '(') {
      this.pos += 1;
      wrapped = true;
    }
    const value = this.parseValue();
    this.skipTrivia();
    if (wrapped) {
      if (this.peek() !== ')') {
        throw new Error('Expected ")".');
      }
      this.pos += 1;
      this.skipTrivia();
    }
    if (this.pos < this.input.length) {
      throw new Error('Unexpected trailing characters.');
    }
    return value;
  }

  private parseValue(): unknown {
    this.skipTrivia();
    const ch = this.peek();
    if (ch === '{') {
      return this.parseObject();
    }
    if (ch === '[') {
      return this.parseArray();
    }
    if (ch === '"' || ch === "'") {
      return this.parseString(ch);
    }
    if (
      ch === '-' ||
      (ch === '.' && DIGIT.test(this.input[this.pos + 1] ?? '')) ||
      (ch !== undefined && DIGIT.test(ch))
    ) {
      return this.parseNumber();
    }
    if (this.matchKeyword('true')) {
      return true;
    }
    if (this.matchKeyword('false')) {
      return false;
    }
    if (this.matchKeyword('null')) {
      return null;
    }
    // Bare identifiers, calls, arrow/function values, template literals, etc. all
    // land here and are rejected — only non-executable literals are accepted.
    throw new Error('Only object literals with static values are allowed.');
  }

  private parseObject(): Record<string, unknown> {
    this.pos += 1; // consume "{"
    const obj: Record<string, unknown> = {};
    this.skipTrivia();
    if (this.peek() === '}') {
      this.pos += 1;
      return obj;
    }
    for (;;) {
      this.skipTrivia();
      const key = this.parseKey();
      if (UNSAFE_OBJECT_KEYS.has(key)) {
        throw new Error('Unsafe object keys are not allowed.');
      }
      this.skipTrivia();
      if (this.peek() !== ':') {
        throw new Error('Expected ":" after a property key.');
      }
      this.pos += 1;
      obj[key] = this.parseValue();
      this.skipTrivia();
      const next = this.peek();
      if (next === ',') {
        this.pos += 1;
        this.skipTrivia();
        if (this.peek() === '}') {
          this.pos += 1;
          return obj;
        }
        continue;
      }
      if (next === '}') {
        this.pos += 1;
        return obj;
      }
      throw new Error('Expected "," or "}" in object.');
    }
  }

  private parseArray(): unknown[] {
    this.pos += 1; // consume "["
    const arr: unknown[] = [];
    this.skipTrivia();
    if (this.peek() === ']') {
      this.pos += 1;
      return arr;
    }
    for (;;) {
      arr.push(this.parseValue());
      this.skipTrivia();
      const next = this.peek();
      if (next === ',') {
        this.pos += 1;
        this.skipTrivia();
        if (this.peek() === ']') {
          this.pos += 1;
          return arr;
        }
        continue;
      }
      if (next === ']') {
        this.pos += 1;
        return arr;
      }
      throw new Error('Expected "," or "]" in array.');
    }
  }

  private parseKey(): string {
    const ch = this.peek();
    if (ch === '"' || ch === "'") {
      return this.parseString(ch);
    }
    // Bare identifier key. CSS selectors with special characters (e.g. `&:hover`)
    // must be quoted, exactly as in real `sx` objects.
    const start = this.pos;
    while (this.pos < this.input.length && IDENTIFIER_CHAR.test(this.input[this.pos])) {
      this.pos += 1;
    }
    if (this.pos === start) {
      throw new Error('Expected a property key.');
    }
    return this.input.slice(start, this.pos);
  }

  private parseString(quote: string): string {
    this.pos += 1; // consume opening quote
    let out = '';
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === '\\') {
        const esc = this.input[this.pos + 1];
        switch (esc) {
          case 'n':
            out += '\n';
            break;
          case 't':
            out += '\t';
            break;
          case 'r':
            out += '\r';
            break;
          case '\\':
            out += '\\';
            break;
          case "'":
            out += "'";
            break;
          case '"':
            out += '"';
            break;
          case '`':
            out += '`';
            break;
          default:
            // Preserve the backslash for unrecognized escapes (e.g. CSS unicode
            // escapes like `\2022`) so the literal reaches the style engine
            // intact instead of silently dropping the backslash.
            out += esc === undefined ? '\\' : `\\${esc}`;
            break;
        }
        this.pos += 2;
        continue;
      }
      if (ch === quote) {
        this.pos += 1;
        return out;
      }
      out += ch;
      this.pos += 1;
    }
    throw new Error('Unterminated string.');
  }

  private parseNumber(): number {
    const start = this.pos;
    if (this.peek() === '-') {
      this.pos += 1;
    }
    while (this.pos < this.input.length && DIGIT.test(this.input[this.pos])) {
      this.pos += 1;
    }
    if (this.peek() === '.') {
      this.pos += 1;
      while (this.pos < this.input.length && DIGIT.test(this.input[this.pos])) {
        this.pos += 1;
      }
    }
    if (this.peek() === 'e' || this.peek() === 'E') {
      this.pos += 1;
      if (this.peek() === '+' || this.peek() === '-') {
        this.pos += 1;
      }
      while (this.pos < this.input.length && DIGIT.test(this.input[this.pos])) {
        this.pos += 1;
      }
    }
    const text = this.input.slice(start, this.pos);
    const num = Number(text);
    if (text === '' || text === '-' || Number.isNaN(num)) {
      throw new Error('Invalid number.');
    }
    return num;
  }

  private matchKeyword(keyword: string): boolean {
    if (!this.input.startsWith(keyword, this.pos)) {
      return false;
    }
    const after = this.input[this.pos + keyword.length];
    if (after !== undefined && IDENTIFIER_CHAR.test(after)) {
      return false;
    }
    this.pos += keyword.length;
    return true;
  }

  private skipTrivia(): void {
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        this.pos += 1;
        continue;
      }
      if (ch === '/' && this.input[this.pos + 1] === '/') {
        this.pos += 2;
        while (this.pos < this.input.length && this.input[this.pos] !== '\n') {
          this.pos += 1;
        }
        continue;
      }
      if (ch === '/' && this.input[this.pos + 1] === '*') {
        this.pos += 2;
        while (
          this.pos < this.input.length &&
          !(this.input[this.pos] === '*' && this.input[this.pos + 1] === '/')
        ) {
          this.pos += 1;
        }
        if (this.pos >= this.input.length) {
          throw new Error('Unterminated comment.');
        }
        this.pos += 2;
        continue;
      }
      break;
    }
  }

  private peek(): string | undefined {
    return this.input[this.pos];
  }
}

/**
 * Parses a user-typed `sx` object literal without executing it. Returns the
 * parsed value, or an error string when parsing failed. The empty string yields
 * `undefined` (no override).
 *
 * Because the playground editor accepts pasted snippets, the input is parsed by a
 * non-executing parser ({@link SxParser}) rather than evaluated, so a malicious
 * snippet cannot run code in the docs origin.
 */
export function parseSx(raw: string): ParsedSx {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { value: undefined, error: undefined };
  }
  try {
    const result = new SxParser(trimmed).parse();
    if (result === null || typeof result !== 'object' || Array.isArray(result)) {
      return { value: undefined, error: 'sx must be an object literal.' };
    }
    return { value: result as Record<string, unknown>, error: undefined };
  } catch (error) {
    return {
      value: undefined,
      error: error instanceof Error ? error.message : 'Invalid sx expression.',
    };
  }
}
