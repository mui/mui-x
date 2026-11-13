import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { useAxesTooltip } from '@mui/x-charts/ChartsTooltip';
import { describe, expect, it, vi } from 'vitest';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium';
import { BarChartPremium } from '../BarChartPremium';

function TooltipValues() {
  const axes = useAxesTooltip<'bar' | 'rangeBar' | 'ohlc'>();
  const values = axes?.[0]?.seriesItems.map(({ seriesId, value, formattedValue }) => ({
    seriesId,
    value,
    formattedValue,
  }));
  return <output data-testid="tooltip-values">{JSON.stringify(values)}</output>;
}

describe('Premium composable series', () => {
  const { render } = createRenderer();

  it('includes range bars and OHLC in the axis tooltip alongside community series', async () => {
    render(
      <ChartsDataProviderPremium
        width={400}
        height={300}
        xAxis={[{ id: 'x', scaleType: 'band', data: ['A'] }]}
        series={[
          { type: 'bar', id: 'bar', data: [2], valueFormatter: (value) => `bar: ${value}` },
          {
            type: 'rangeBar',
            id: 'range',
            data: [[1, 4]],
            valueFormatter: (value) => `range: ${value?.join('-')}`,
          },
          {
            type: 'ohlc',
            id: 'candle',
            data: [[2, 4, 1, 3]],
            valueFormatter: (value, { field }) => `${field}: ${value}`,
          },
        ]}
        tooltipAxis={[{ axisId: 'x', dataIndex: 0 }]}
      >
        <TooltipValues />
      </ChartsDataProviderPremium>,
    );

    await waitFor(() => expect(screen.getByTestId('tooltip-values').textContent).not.to.equal(''));
    expect(JSON.parse(screen.getByTestId('tooltip-values').textContent!)).to.deep.equal([
      { seriesId: 'bar', value: 2, formattedValue: 'bar: 2' },
      { seriesId: 'range', value: [1, 4], formattedValue: 'range: 1-4' },
      {
        seriesId: 'candle',
        value: { open: 2, high: 4, low: 1, close: 3 },
        formattedValue: { open: 'open: 2', high: 'high: 4', low: 'low: 1', close: 'close: 3' },
      },
    ]);
  });

  it('navigates between community bars and range bars with the keyboard', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <BarChartPremium
        width={400}
        height={300}
        skipAnimation
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        series={[
          { type: 'bar', id: 'bar', data: [2] },
          { type: 'rangeBar', id: 'range', data: [[1, 4]] },
        ]}
        onItemClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}[ArrowRight][ArrowUp][Enter]');
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'rangeBar',
      seriesId: 'range',
      dataIndex: 0,
    });

    await user.keyboard('[ArrowDown][Enter]');
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'bar',
      seriesId: 'bar',
      dataIndex: 0,
    });
  });
});
