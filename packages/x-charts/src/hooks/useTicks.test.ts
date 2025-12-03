import { applyTickSpacing, getTicks } from './useTicks';
import { scaleBand } from '../internals';

describe('applyTickSpacing', () => {
  it('should return all domain values when tickSpacing allows it', () => {
    const domain = ['A', 'B', 'C', 'D', 'E'];
    const range: [number, number] = [0, 500];
    const tickSpacing = 100;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A', 'B', 'C', 'D', 'E']);
  });

  it('should filter domain values when tickSpacing requires it', () => {
    const domain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const range: [number, number] = [0, 100];
    const tickSpacing = 50;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A', 'F']);
  });

  it('should handle reversed range', () => {
    const domain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const range: [number, number] = [100, 0];
    const tickSpacing = 50;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A', 'F']);
  });

  it('should handle ticks when range is not entirely divisible by the spacing', () => {
    const domain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const range: [number, number] = [0, 100];
    const tickSpacing = 33;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A', 'E', 'I']);
  });

  it('should return only first element when tickSpacing is very large', () => {
    const domain = ['A', 'B', 'C', 'D', 'E'];
    const range: [number, number] = [0, 100];
    const tickSpacing = 500;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A']);
  });

  it('should handle small ranges with many domain values', () => {
    const domain = Array.from({ length: 100 }, (_, i) => `Item${i}`);
    const range: [number, number] = [0, 100];
    const tickSpacing = 20;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['Item0', 'Item20', 'Item40', 'Item60', 'Item80']);
  });

  it('should handle numeric domain values', () => {
    const domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const range: [number, number] = [0, 100];
    const tickSpacing = 50;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal([0, 5]);
  });

  it('should handle single element domain', () => {
    const domain = ['A'];
    const range: [number, number] = [0, 100];
    const tickSpacing = 50;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A']);
  });

  it('should handle zero range span', () => {
    const domain = ['A', 'B', 'C'];
    const range: [number, number] = [50, 50];
    const tickSpacing = 10;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A']);
  });

  it('should handle zero tick spacing', () => {
    const domain = ['A', 'B', 'C'];
    const range: [number, number] = [0, 100];
    const tickSpacing = 0;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A', 'B', 'C']);
  });

  it('should handle return all domain elements', () => {
    const domain = ['A', 'B', 'C', 'D'];
    const range: [number, number] = [0, 100];
    const tickSpacing = 25;

    const result = applyTickSpacing(domain, range, tickSpacing);

    expect(result).to.deep.equal(['A', 'B', 'C', 'D']);
  });
});

describe('getTicks', () => {
  it('applies tickInterval before tickSpacing', () => {
    const scale = scaleBand<{ toString(): string }>(
      Array.from({ length: 1000 }).map((_, i) => `${i}`),
      [0, 500],
    );

    const ticks = getTicks({
      scale,
      tickInterval: (tick) => tick % 101 === 0,
      tickSpacing: 50,
      tickNumber: 5,
      isInside: () => true,
    });

    expect(ticks.map((t) => t.value)).to.deep.equal([
      '0',
      '101',
      '202',
      '303',
      '404',
      '505',
      '606',
      '707',
      '808',
      '909',
    ]);
  });
});
