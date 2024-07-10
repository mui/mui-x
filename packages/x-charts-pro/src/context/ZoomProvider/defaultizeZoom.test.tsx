import { expect } from 'chai';
import { defaultizeZoom } from './defaultizeZoom';

describe('defaultizeZoom errors', () => {
  it('should throw an error when zoom.start is below 0', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { start: -1 } }], 'x')).throws(
      'MUI X Charts: The start value must be between 0 and 100.',
    );
  });

  it('should throw an error when zoom.start is above 100', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { start: 101 } }], 'x')).throws(
      'MUI X Charts: The start value must be between 0 and 100.',
    );
  });

  it('should throw an error when zoom.end is below 0', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { end: -1 } }], 'x')).throws(
      'MUI X Charts: The end value must be between 0 and 100.',
    );
  });

  it('should throw an error when zoom.end is above 100', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { end: 101 } }], 'x')).throws(
      'MUI X Charts: The end value must be between 0 and 100.',
    );
  });

  it('should throw an error when zoom.minSpan is below 1', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { minSpan: 0 } }], 'x')).throws(
      'MUI X Charts: The minSpan value must be between 1 and 100.',
    );
  });

  it('should throw an error when zoom.minSpan is above 100', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { minSpan: 101 } }], 'x')).throws(
      'MUI X Charts: The minSpan value must be between 1 and 100.',
    );
  });

  it('should throw an error when zoom.maxSpan is below 1', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { maxSpan: 0 } }], 'x')).throws(
      'MUI X Charts: The maxSpan value must be between 1 and 100.',
    );
  });

  it('should throw an error when zoom.maxSpan is above 100', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { maxSpan: 101 } }], 'x')).throws(
      'MUI X Charts: The maxSpan value must be between 1 and 100.',
    );
  });

  it('should throw an error when zoom.end is below zoom.start', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { start: 50, end: 40 } }], 'x')).throws(
      'MUI X Charts: The end value must be greater than the start value.',
    );
  });

  it('should throw an error when zoom.step is below 1', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { step: 0 } }], 'x')).throws(
      'MUI X Charts: The step value must be greater than 1.',
    );
  });

  it('should throw an error when minSpan is greater than maxSpan', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: { minSpan: 100, maxSpan: 50 } }], 'x')).throws(
      'MUI X Charts: The minSpan value must be less than or equal to the maxSpan value.',
    );
  });

  it('should not throw an error when zoom is true', async function test() {
    expect(() => defaultizeZoom([{ id: '1', zoom: true }], 'x')).not.to.throw();
  });

  it('should not throw an error when zoom is valid', async function test() {
    expect(() =>
      defaultizeZoom(
        [
          {
            id: '1',
            zoom: { start: 1, end: 99, minSpan: 1, maxSpan: 99, step: 10, panning: false },
          },
        ],
        'x',
      ),
    ).not.to.throw();
  });
});
