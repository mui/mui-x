import { scaleLog } from '@mui/x-charts-vendor/d3-scale';
import { expect } from 'vitest';
import { getTicks } from './useTicks';

describe('getTicks', () => {
  // https://github.com/mui/mui-x/issues/18239
  it('returns ticks without a formatted value in a zoomed-in log scale', () => {
    const scale = scaleLog();
    scale.domain([100, 1000000]);
    // Simulates a zoomed-in chart
    scale.range([253.6304588762152, 19.46312654505016]);
    const tickNumber = 4.0200400400200005;

    const ticks = getTicks({
      scale,
      tickNumber,
      isInside: () => true,
    });

    expect(ticks.map((t) => t.formattedValue).filter((v) => v !== '')).to.deep.eq([
      '100',
      '1k',
      '10k',
      '100k',
      '1M',
    ]);
    expect(ticks.map((t) => t.value)).to.deep.eq([
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
      9000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 200000, 300000,
      400000, 500000, 600000, 700000, 800000, 900000, 1000000,
    ]);
  });

  it('returns ticks without a formatted value in a zoomed-in log scale with a custom value formatter', () => {
    const scale = scaleLog();
    scale.domain([100, 1000000]);
    // Simulates a zoomed-in chart
    scale.range([253.6304588762152, 19.46312654505016]);
    const tickNumber = 4.0200400400200005;

    const ticks = getTicks({
      scale,
      tickNumber,
      isInside: () => true,
      valueFormatter: (value) => value.toString(),
    });

    expect(ticks.map((t) => t.formattedValue).filter((v) => v !== '')).to.deep.eq([
      '100',
      '1000',
      '10000',
      '100000',
      '1000000',
    ]);
    expect(ticks.map((t) => t.value)).to.deep.eq([
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
      9000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 200000, 300000,
      400000, 500000, 600000, 700000, 800000, 900000, 1000000,
    ]);
  });
});
