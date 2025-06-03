import { expect } from 'chai';
import { calculateZoom } from './calculateZoom';

describe('calculateZoom', () => {
  const defaultOptions = {
    minSpan: 10,
    maxSpan: 100,
    minStart: 0,
    maxEnd: 100,
  };

  it('should zoom in with positive step', () => {
    const result = calculateZoom({ start: 20, end: 80 }, 0.1, defaultOptions);
    expect(result).to.deep.equal({ start: 23, end: 77 });

    const result2 = calculateZoom({ start: 10, end: 90 }, 0.2, defaultOptions);
    expect(result2).to.deep.equal({ start: 18, end: 82 });
  });

  it('should zoom out with negative step', () => {
    const result = calculateZoom({ start: 30, end: 70 }, -0.1, defaultOptions);
    expect(result).to.deep.equal({ start: 28, end: 72 });

    const result2 = calculateZoom({ start: 20, end: 80 }, -0.2, defaultOptions);
    expect(result2).to.deep.equal({ start: 14, end: 86 });
  });

  it('should respect minSpan', () => {
    const result = calculateZoom({ start: 40, end: 50 }, 0.4, { ...defaultOptions, minSpan: 0 });
    expect(result).to.deep.equal({ start: 42, end: 48 });

    const result2 = calculateZoom({ start: 40, end: 50 }, 0.4, { ...defaultOptions, minSpan: 8 });
    expect(result2).to.deep.equal({ start: 41, end: 49 });
  });

  it('should respect maxSpan', () => {
    const result = calculateZoom({ start: 30, end: 70 }, -0.4, { ...defaultOptions, maxSpan: 100 });
    expect(result).to.deep.equal({ start: 22, end: 78 });

    const result2 = calculateZoom({ start: 30, end: 70 }, -0.4, { ...defaultOptions, maxSpan: 50 });
    expect(result2).to.deep.equal({ start: 25, end: 75 });
  });

  it('should respect minStart', () => {
    const result = calculateZoom({ start: 25, end: 75 }, -0.4, { ...defaultOptions, minStart: 0 });
    expect(result).to.deep.equal({ start: 15, end: 85 });

    const result2 = calculateZoom({ start: 25, end: 75 }, -0.4, {
      ...defaultOptions,
      minStart: 20,
    });
    expect(result2).to.deep.equal({ start: 20, end: 85 });
  });

  it('should respect maxEnd', () => {
    const result = calculateZoom({ start: 25, end: 75 }, -0.4, { ...defaultOptions, maxEnd: 100 });
    expect(result).to.deep.equal({ start: 15, end: 85 });

    const result2 = calculateZoom({ start: 25, end: 75 }, -0.4, { ...defaultOptions, maxEnd: 80 });
    expect(result2).to.deep.equal({ start: 15, end: 80 });
  });

  it('spreads the received zoomData', () => {
    const result = calculateZoom({ testProp: true, start: 20, end: 80 }, 0.1, defaultOptions);
    expect(result).to.deep.equal({ testProp: true, start: 23, end: 77 });
  });
});
