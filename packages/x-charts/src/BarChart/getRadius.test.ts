import { expect } from 'chai';
import { getRadius } from './getRadius';

describe('getRadius', () => {
  it('should return 0 if borderRadius is not provided', () => {
    expect(
      getRadius('top-left', { hasNegative: false, hasPositive: false, borderRadius: 0 }),
    ).to.equal(0);
    expect(
      getRadius('top-left', { hasNegative: true, hasPositive: true, borderRadius: 0 }),
    ).to.equal(0);
    expect(
      getRadius('top-left', { hasNegative: true, hasPositive: true, borderRadius: undefined }),
    ).to.equal(0);
  });

  // ╔═─┐
  // │  │
  // └──┘
  it('should return borderRadius for top-left on vertical layout', () => {
    expect(
      getRadius('top-left', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(10);
    expect(
      getRadius('top-left', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(0);
  });

  // ╔═──┐
  // └───┘
  it('should return borderRadius for top-left on horizontal layout', () => {
    expect(
      getRadius('top-left', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(0);
    expect(
      getRadius('top-left', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(10);
  });

  // ┌─═╗
  // │  │
  // └──┘
  it('should return borderRadius for top-right on vertical layout', () => {
    expect(
      getRadius('top-right', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(10);
    expect(
      getRadius('top-right', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(0);
  });

  // ┌──═╗
  // └───┘
  it('should return borderRadius for top-right on horizontal layout', () => {
    expect(
      getRadius('top-right', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(10);
    expect(
      getRadius('top-right', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(0);
  });

  // ┌──┐
  // │  │
  // ╚═─┘
  it('should return borderRadius for bottom-right on vertical layout', () => {
    expect(
      getRadius('bottom-right', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(0);
    expect(
      getRadius('bottom-right', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(10);
  });

  // ┌───┐
  // ╚═──┘
  it('should return borderRadius for bottom-right on horizontal layout', () => {
    expect(
      getRadius('bottom-right', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(10);
    expect(
      getRadius('bottom-right', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(0);
  });

  // ┌──┐
  // │  │
  // └─═╝
  it('should return borderRadius for bottom-left on vertical layout', () => {
    expect(
      getRadius('bottom-left', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(0);
    expect(
      getRadius('bottom-left', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'vertical',
      }),
    ).to.equal(10);
  });

  // ┌───┐
  // └──═╝
  it('should return borderRadius for bottom-left on horizontal layout', () => {
    expect(
      getRadius('bottom-left', {
        hasNegative: false,
        hasPositive: true,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(0);
    expect(
      getRadius('bottom-left', {
        hasNegative: true,
        hasPositive: false,
        borderRadius: 10,
        layout: 'horizontal',
      }),
    ).to.equal(10);
  });
});
