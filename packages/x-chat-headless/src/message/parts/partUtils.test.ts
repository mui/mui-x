import { describe, expect, it } from 'vitest';
import {
  extractLanguage,
  formatStructuredValue,
  normalizeCodeContent,
  normalizeMarkdownForRender,
  safeUri,
  shouldCollapsePayload,
} from './partUtils';

describe('formatStructuredValue', () => {
  it('returns a string value as-is', () => {
    expect(formatStructuredValue('hello')).to.equal('hello');
  });

  it('converts an object to pretty JSON', () => {
    expect(formatStructuredValue({ a: 1 })).to.equal('{\n  "a": 1\n}');
  });

  it('converts an array to pretty JSON', () => {
    expect(formatStructuredValue([1, 2])).to.equal('[\n  1,\n  2\n]');
  });

  it('falls back to String(value) for non-serializable values', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(formatStructuredValue(circular)).to.equal('[object Object]');
  });

  it('converts a number to pretty JSON', () => {
    expect(formatStructuredValue(42)).to.equal('42');
  });

  it('converts null to pretty JSON', () => {
    expect(formatStructuredValue(null)).to.equal('null');
  });
});

describe('shouldCollapsePayload', () => {
  it('returns false for short text', () => {
    expect(shouldCollapsePayload('short')).to.equal(false);
  });

  it('returns true when text exceeds 320 characters', () => {
    expect(shouldCollapsePayload('a'.repeat(321))).to.equal(true);
  });

  it('returns false when text is exactly 320 characters', () => {
    expect(shouldCollapsePayload('a'.repeat(320))).to.equal(false);
  });

  it('returns true when text has more than 8 lines', () => {
    const text = Array.from({ length: 9 }, (_, i) => `line ${i + 1}`).join('\n');

    expect(shouldCollapsePayload(text)).to.equal(true);
  });

  it('returns false when text has exactly 8 lines', () => {
    const text = Array.from({ length: 8 }, (_, i) => `line ${i + 1}`).join('\n');

    expect(shouldCollapsePayload(text)).to.equal(false);
  });
});

describe('safeUri', () => {
  it('returns empty string for null', () => {
    expect(safeUri(null)).to.equal('');
  });

  it('returns empty string for undefined', () => {
    expect(safeUri(undefined)).to.equal('');
  });

  it('returns empty string for empty string', () => {
    expect(safeUri('')).to.equal('');
  });

  it('returns trimmed fragment (#x)', () => {
    expect(safeUri(' #section ')).to.equal('#section');
  });

  it('returns trimmed absolute path (/path)', () => {
    expect(safeUri(' /my/path ')).to.equal('/my/path');
  });

  it('allows http: protocol', () => {
    expect(safeUri('http://example.com')).to.equal('http://example.com');
  });

  it('allows https: protocol', () => {
    expect(safeUri('https://example.com')).to.equal('https://example.com');
  });

  it('allows mailto: protocol', () => {
    expect(safeUri('mailto:test@example.com')).to.equal('mailto:test@example.com');
  });

  it('allows tel: protocol', () => {
    expect(safeUri('tel:+1234567890')).to.equal('tel:+1234567890');
  });

  it('blocks javascript: protocol', () => {
    // eslint-disable-next-line no-script-url
    expect(safeUri('javascript:alert(1)')).to.equal('');
  });

  it('blocks data: protocol', () => {
    expect(safeUri('data:text/html,<h1>Hi</h1>')).to.equal('');
  });
});

describe('normalizeMarkdownForRender', () => {
  it('returns unchanged markdown when fence count is even', () => {
    const md = '```js\nconsole.log("hi")\n```';

    expect(normalizeMarkdownForRender(md)).to.equal(md);
  });

  it('appends closing fence when fence count is odd', () => {
    const md = '```js\nconsole.log("hi")';

    expect(normalizeMarkdownForRender(md)).to.equal('```js\nconsole.log("hi")\n```');
  });

  it('returns unchanged markdown with no backticks', () => {
    const md = 'plain text';

    expect(normalizeMarkdownForRender(md)).to.equal(md);
  });
});

describe('extractLanguage', () => {
  it('extracts language from "language-typescript"', () => {
    expect(extractLanguage('language-typescript')).to.equal('typescript');
  });

  it('returns empty string when no match', () => {
    expect(extractLanguage('no-match')).to.equal('');
  });

  it('returns empty string for undefined', () => {
    expect(extractLanguage(undefined)).to.equal('');
  });

  it('returns lowercase language', () => {
    expect(extractLanguage('language-TypeScript')).to.equal('typescript');
  });
});

describe('normalizeCodeContent', () => {
  it('joins children and strips trailing newline', () => {
    expect(normalizeCodeContent(['hello', ' world\n'])).to.equal('hello world');
  });

  it('preserves content without trailing newline', () => {
    expect(normalizeCodeContent('hello world')).to.equal('hello world');
  });
});
