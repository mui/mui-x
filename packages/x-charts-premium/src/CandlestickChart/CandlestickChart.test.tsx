import { vi } from 'vitest';
import { createRenderer, screen, within } from '@mui/internal-test-utils';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { CandlestickChart } from './CandlestickChart';

const sampleData: Array<[number, number, number, number]> = [
  [100, 110, 90, 105],
  [105, 115, 95, 110],
  [110, 120, 100, 108],
];

describe('<CandlestickChart /> - Visibility', () => {
  const { render } = createRenderer();

  it('should toggle legend item hidden class when clicking on legend item', async () => {
    const { user } = render(
      <CandlestickChart
        height={300}
        width={300}
        series={[{ id: 'series-1', label: 'Series 1', data: sampleData }]}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        slotProps={{ legend: { toggleVisibilityOnClick: true } }}
      />,
    );

    const series1Button = screen.getByRole('button', { name: /Series 1/ });
    expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(false);

    await user.click(series1Button);
    expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(true);

    await user.click(series1Button);
    expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(false);
  });

  it('should call onHiddenItemsChange when toggling visibility via legend click', async () => {
    const onHiddenItemsChange = vi.fn();
    const { user } = render(
      <CandlestickChart
        height={300}
        width={300}
        series={[{ id: 'series-1', label: 'Series 1', data: sampleData }]}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        onHiddenItemsChange={onHiddenItemsChange}
        slotProps={{ legend: { toggleVisibilityOnClick: true } }}
      />,
    );

    const series1Button = screen.getByRole('button', { name: /Series 1/ });

    await user.click(series1Button);
    expect(onHiddenItemsChange).toHaveBeenCalledTimes(1);
    expect(onHiddenItemsChange.mock.lastCall?.[0]).to.deep.equal([
      { type: 'ohlc', seriesId: 'series-1', dataIndex: undefined },
    ]);

    await user.click(series1Button);
    expect(onHiddenItemsChange).toHaveBeenCalledTimes(2);
    expect(onHiddenItemsChange.mock.lastCall?.[0]).to.deep.equal([]);
  });

  it('should respect controlled hiddenItems', () => {
    const { setProps } = render(
      <CandlestickChart
        height={300}
        width={300}
        series={[
          { id: 'series-1', label: 'Series 1', data: sampleData },
        ]}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        hiddenItems={[{ type: 'ohlc', seriesId: 'series-1' }]}
      />,
    );

    const legend = screen.getByRole('list');
    const series1Item = within(legend)
      .getByText('Series 1')
      .closest(`.${legendClasses.series}`);

    expect(series1Item?.classList.contains(legendClasses.hidden)).to.equal(true);

    setProps({ hiddenItems: [] });
    expect(series1Item?.classList.contains(legendClasses.hidden)).to.equal(false);
  });

  it('should hide items on initial render with initialHiddenItems', () => {
    render(
      <CandlestickChart
        height={300}
        width={300}
        series={[
          { id: 'series-1', label: 'Series 1', data: sampleData },
        ]}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        initialHiddenItems={[{ type: 'ohlc', seriesId: 'series-1' }]}
      />,
    );

    const legend = screen.getByRole('list');
    const series1Item = within(legend)
      .getByText('Series 1')
      .closest(`.${legendClasses.series}`);

    expect(series1Item?.classList.contains(legendClasses.hidden)).to.equal(true);
  });

  it('should allow toggling visibility when using initialHiddenItems', async () => {
    const { user } = render(
      <CandlestickChart
        height={300}
        width={300}
        series={[
          { id: 'series-1', label: 'Series 1', data: sampleData },
        ]}
        xAxis={[{ data: ['A', 'B', 'C'] }]}
        initialHiddenItems={[{ type: 'ohlc', seriesId: 'series-1' }]}
        slotProps={{ legend: { toggleVisibilityOnClick: true } }}
      />,
    );

    const series1Button = screen.getByRole('button', { name: /Series 1/ });
    expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(true);

    await user.click(series1Button);
    expect(series1Button.classList.contains(legendClasses.hidden)).to.equal(false);
  });
});

describe('<CandlestickChart /> - Dataset', () => {
  const { render } = createRenderer();

  it('should render without error when using dataset with datasetKeys', () => {
    expect(() =>
      render(
        <CandlestickChart
          height={300}
          width={300}
          dataset={[
            { o: 100, h: 110, l: 90, c: 105 },
            { o: 105, h: 115, l: 95, c: 110 },
          ]}
          series={[
            {
              id: 'series-1',
              label: 'Series 1',
              datasetKeys: { open: 'o', high: 'h', low: 'l', close: 'c' },
            },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
        />,
      ),
    ).not.toThrow();
  });

  it('should throw when series has no data and no dataset', () => {
    expect(() =>
      render(
        <CandlestickChart
          height={300}
          width={300}
          series={[{ id: 'series-1', label: 'Series 1' }]}
          xAxis={[{ data: ['A', 'B'] }]}
        />,
      ),
    ).toThrow("OHLC series with id='series-1' has no data");
  });

  it('should throw when datasetKeys is incomplete', () => {
    expect(() =>
      render(
        <CandlestickChart
          height={300}
          width={300}
          dataset={[{ o: 100, h: 110, l: 90, c: 105 }]}
          series={[
            {
              id: 'series-1',
              label: 'Series 1',
              datasetKeys: { open: 'o', high: 'h' } as any,
            },
          ]}
          xAxis={[{ data: ['A'] }]}
        />,
      ),
    ).toThrow('incomplete datasetKeys');
  });
});
