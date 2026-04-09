import { describe, expect, it } from 'vitest';
import { getDataAttributes } from './getDataAttributes';

describe('getDataAttributes', () => {
  it('returns an empty object for empty input', () => {
    expect(getDataAttributes({})).to.deep.equal({});
  });

  it('converts true to data-key="true"', () => {
    expect(getDataAttributes({ active: true })).to.deep.equal({ 'data-active': 'true' });
  });

  it('omits false values', () => {
    expect(getDataAttributes({ active: false })).to.deep.equal({});
  });

  it('omits null values', () => {
    expect(getDataAttributes({ active: null })).to.deep.equal({});
  });

  it('omits undefined values', () => {
    expect(getDataAttributes({ active: undefined })).to.deep.equal({});
  });

  it('converts string values to data-key="value"', () => {
    expect(getDataAttributes({ status: 'ready' })).to.deep.equal({ 'data-status': 'ready' });
  });

  it('converts number values to data-key="42"', () => {
    expect(getDataAttributes({ count: 42 })).to.deep.equal({ 'data-count': '42' });
  });

  it('converts camelCase keys to kebab-case', () => {
    expect(getDataAttributes({ isSubmitting: true })).to.deep.equal({
      'data-is-submitting': 'true',
    });
  });

  it('handles a mixed input of booleans, strings, numbers, null, and undefined', () => {
    const result = getDataAttributes({
      active: true,
      disabled: false,
      status: 'loading',
      count: 3,
      missing: null,
      extra: undefined,
    });

    expect(result).to.deep.equal({
      'data-active': 'true',
      'data-status': 'loading',
      'data-count': '3',
    });
  });
});
