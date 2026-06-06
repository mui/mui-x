import { describe, expect, it, vi } from 'vitest';
import { parseSx } from './parseSx';

describe('parseSx', () => {
  it('returns undefined (no error) for empty input', () => {
    expect(parseSx('')).to.deep.equal({ value: undefined, error: undefined });
    expect(parseSx('   ')).to.deep.equal({ value: undefined, error: undefined });
  });

  it('parses a static object literal with bare keys, quoted selectors, and nesting', () => {
    const { value, error } = parseSx(
      "{ color: 'red', borderRadius: 8, '&:hover': { color: \"blue\" } }",
    );
    expect(error).to.equal(undefined);
    expect(value).to.deep.equal({ color: 'red', borderRadius: 8, '&:hover': { color: 'blue' } });
  });

  it('accepts the expression-wrapped form, trailing commas, numbers, booleans, null, and arrays', () => {
    const { value, error } = parseSx(
      '({ p: 1.5, m: -2, opacity: 0.5, hidden: false, x: null, padding: [1, 2, 3,], })',
    );
    expect(error).to.equal(undefined);
    expect(value).to.deep.equal({
      p: 1.5,
      m: -2,
      opacity: 0.5,
      hidden: false,
      x: null,
      padding: [1, 2, 3],
    });
  });

  it('ignores comments', () => {
    const { value, error } = parseSx('{ /* c */ color: "red", // trailing\n gap: 1 }');
    expect(error).to.equal(undefined);
    expect(value).to.deep.equal({ color: 'red', gap: 1 });
  });

  it('rejects non-object top-level values', () => {
    expect(parseSx('42').error).to.not.equal(undefined);
    expect(parseSx("'red'").error).to.not.equal(undefined);
    expect(parseSx('[1, 2]').error).to.not.equal(undefined);
  });

  it('does NOT execute the input — function/arrow values are rejected', () => {
    // A getter/IIFE-style payload must never run; parsing returns an error.
    const spy = vi.fn();
    (globalThis as any).parseSxProbe = spy;
    // Build the `${…}` interpolation marker via a real template so the test source
    // itself doesn't contain a template expression inside a quoted string.
    const dollar = '$';
    const templatePayload = `{ x: \`${dollar}{globalThis.parseSxProbe()}\` }`;
    try {
      expect(parseSx('{ p: (theme) => theme.spacing(2) }').error).to.not.equal(undefined);
      expect(parseSx('{ x: globalThis.parseSxProbe() }').error).to.not.equal(undefined);
      expect(parseSx('(function(){ globalThis.parseSxProbe(); return {}; })()').error).to.not.equal(
        undefined,
      );
      expect(parseSx(templatePayload).error).to.not.equal(undefined);
      expect(spy).not.toHaveBeenCalled();
    } finally {
      delete (globalThis as any).parseSxProbe;
    }
  });

  it('rejects bare identifier values (CSS values must be quoted)', () => {
    expect(parseSx('{ color: red }').error).to.not.equal(undefined);
  });

  it('rejects object keys that could mutate prototypes', () => {
    expect(parseSx('{ __proto__: { polluted: true } }').error).to.equal(
      'Unsafe object keys are not allowed.',
    );
    expect(parseSx('{ constructor: { prototype: { polluted: true } } }').error).to.equal(
      'Unsafe object keys are not allowed.',
    );
  });

  it('rejects unterminated block comments', () => {
    expect(parseSx('{ color: "red" /* missing end }').error).to.equal('Unterminated comment.');
  });

  it('preserves the backslash in unrecognized escapes (CSS unicode) while collapsing standard ones', () => {
    // Input text: { content: '\2022' } — the CSS bullet escape must round-trip
    // with its backslash intact, not become "2022".
    expect(parseSx("{ content: '\\2022' }")).to.deep.equal({
      value: { content: '\\2022' },
      error: undefined,
    });
    // Standard escapes still collapse to a single character.
    expect(parseSx("{ content: '\\\\' }")).to.deep.equal({
      value: { content: '\\' },
      error: undefined,
    });
    expect(parseSx("{ content: '\\'' }")).to.deep.equal({
      value: { content: "'" },
      error: undefined,
    });
  });

  it('parses leading-dot decimals consistently with their negative form', () => {
    expect(parseSx('{ opacity: .5 }')).to.deep.equal({
      value: { opacity: 0.5 },
      error: undefined,
    });
    expect(parseSx('{ x: -.5 }')).to.deep.equal({ value: { x: -0.5 }, error: undefined });
  });
});
