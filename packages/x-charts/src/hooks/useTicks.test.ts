import { scaleLog } from '@mui/x-charts-vendor/d3-scale';
import { expect } from 'vitest';
import { getTicks } from './useTicks';

describe('getTicks', () => {
  it('returns ticks without a formatted value in a log scale', () => {
    const scale = scaleLog();
    scale.domain([100, 10000]);
    scale.range([100, 0]);
    const tickNumber = 4;

    const ticks = getTicks({
      scale,
      tickNumber,
      isInside: () => true,
    });

    expect(ticks.map((t) => t.formattedValue).filter((v) => v !== '')).to.deep.eq([
      '100',
      '200',
      '1k',
      '2k',
      '10k',
    ]);
    expect(ticks.map((t) => t.value)).to.deep.eq([
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
      9000, 10000,
    ]);
  });

  it('returns ticks without a formatted value in a log scale with a custom value formatter', () => {
    // https://github.com/mui/mui-x/issues/18239
    const scale = scaleLog();
    scale.domain([100, 10000]);
    scale.range([100, 0]);
    const tickNumber = 4;

    const ticks = getTicks({
      scale,
      tickNumber,
      isInside: () => true,
      valueFormatter: (value) => value.toString(),
    });

    expect(ticks.map((t) => t.formattedValue).filter((v) => v !== '')).to.deep.eq([
      '100',
      '200',
      '1000',
      '2000',
      '10000',
    ]);
    expect(ticks.map((t) => t.value)).to.deep.eq([
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
      9000, 10000,
    ]);
  });
});
