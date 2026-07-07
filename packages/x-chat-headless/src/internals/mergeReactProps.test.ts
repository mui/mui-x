import { describe, expect, it, vi } from 'vitest';
import { mergeReactProps } from './mergeReactProps';

describe('mergeReactProps', () => {
  it('returns an empty object when called with no arguments', () => {
    expect(mergeReactProps()).to.deep.equal({});
  });

  it('returns a shallow copy when given a single props object', () => {
    const original = { id: 'a', tabIndex: 0 };
    const result = mergeReactProps(original);

    expect(result).to.deep.equal({ id: 'a', tabIndex: 0 });
    expect(result).not.toBe(original);
  });

  it('skips undefined props objects', () => {
    const result = mergeReactProps(undefined, { id: 'a' }, undefined);

    expect(result).to.deep.equal({ id: 'a' });
  });

  it('skips null props objects', () => {
    const result = mergeReactProps(null as any, { id: 'a' });

    expect(result).to.deep.equal({ id: 'a' });
  });

  it('skips undefined property values', () => {
    const result = mergeReactProps({ id: 'a', role: undefined });

    expect(result).to.deep.equal({ id: 'a' });
    expect('role' in result).to.equal(false);
  });

  it('last value wins for regular props', () => {
    const result = mergeReactProps({ id: 'a', tabIndex: 0 }, { id: 'b' }, { id: 'c' });

    expect(result.id).to.equal('c');
    expect(result.tabIndex).to.equal(0);
  });

  it('concatenates className with spaces', () => {
    const result = mergeReactProps(
      { className: 'foo' },
      { className: 'bar' },
      { className: 'baz' },
    );

    expect(result.className).to.equal('foo bar baz');
  });

  it('merges style objects left-to-right', () => {
    const result = mergeReactProps(
      { style: { color: 'red', fontSize: 12 } },
      { style: { color: 'blue', margin: 4 } },
    );

    expect(result.style).to.deep.equal({ color: 'blue', fontSize: 12, margin: 4 });
  });

  it('chains event handlers left-to-right', () => {
    const calls: string[] = [];
    const handler1 = vi.fn(() => calls.push('first'));
    const handler2 = vi.fn(() => calls.push('second'));

    const result = mergeReactProps({ onClick: handler1 }, { onClick: handler2 });

    (result.onClick as (...args: any[]) => void)({ defaultPrevented: false });

    expect(calls).to.deep.equal(['first', 'second']);
  });

  it('uses a single handler directly without wrapping', () => {
    const handler = vi.fn();
    const result = mergeReactProps({ onClick: handler });

    expect(result.onClick).toBe(handler);
  });

  it('stops the event handler chain when defaultPrevented is true', () => {
    const handler1 = vi.fn((event: { defaultPrevented: boolean }) => {
      event.defaultPrevented = true;
    });
    const handler2 = vi.fn();

    const result = mergeReactProps({ onClick: handler1 }, { onClick: handler2 });

    const event = { defaultPrevented: false };
    (result.onClick as (...args: any[]) => void)(event);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();
  });

  it('treats a non-function event key as a regular prop', () => {
    const result = mergeReactProps({ onFoo: 'not-a-function' } as any, { onFoo: 'bar' } as any);

    expect(result.onFoo).to.equal('bar');
  });

  it('handles a mixed scenario with className, style, onClick, and regular props', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const result = mergeReactProps(
      { className: 'a', style: { color: 'red' }, onClick: handler1, id: 'first' },
      { className: 'b', style: { margin: 4 }, onClick: handler2, id: 'second' },
    );

    expect(result.className).to.equal('a b');
    expect(result.style).to.deep.equal({ color: 'red', margin: 4 });
    expect(result.id).to.equal('second');
    expect(typeof result.onClick).to.equal('function');

    (result.onClick as (...args: any[]) => void)({ defaultPrevented: false });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
