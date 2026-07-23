import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { vi } from 'vitest';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { RadarChart } from '@mui/x-charts/RadarChart';

describe('keyboard item activation', () => {
  const { render } = createRenderer();

  const barConfig = {
    height: 100,
    width: 100,
    margin: 0,
    skipAnimation: true,
  } as const;

  it('should not fire onItemClick when the experimental feature is off', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <BarChart {...barConfig} series={[{ id: 'A', data: [50, 100] }]} onItemClick={onItemClick} />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(0);
  });

  it('should fire onItemClick with the focused bar on Enter and Space', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <BarChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100] }]}
        onItemClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'bar',
      seriesId: 'A',
      dataIndex: 0,
    });

    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Space]');

    expect(onItemClick.mock.calls.length).to.equal(2);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'bar',
      seriesId: 'A',
      dataIndex: 1,
    });
  });

  it('should fire onAxisClick with the focused axis item', async () => {
    const onAxisClick = vi.fn();
    const { user } = render(
      <BarChart
        {...barConfig}
        series={[
          { id: 'A', data: [50, 100] },
          { id: 'B', data: [10, 20] },
        ]}
        xAxis={[{ data: ['P', 'Q'] }]}
        onAxisClick={onAxisClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onAxisClick.mock.calls.length).to.equal(1);
    expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
      dataIndex: 0,
      axisValue: 'P',
      seriesValues: { A: 50, B: 10 },
    });
  });

  it('should fire onMarkClick once for a line chart rendering area, line and marks', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <LineChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100], area: true }]}
        onAreaClick={onItemClick}
        onLineClick={onItemClick}
        onMarkClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'line',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should fire onItemClick with the pie item as third argument', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <PieChart
        {...barConfig}
        series={[{ id: 'A', data: [{ value: 10 }, { value: 20 }] }]}
        onItemClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'pie',
      seriesId: 'A',
      dataIndex: 0,
    });
    expect(onItemClick.mock.lastCall?.[2].value).to.equal(10);
  });

  it('should fire onItemClick with the focused scatter point', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <ScatterChart
        {...barConfig}
        series={[
          {
            id: 'A',
            data: [
              { x: 1, y: 1, id: 'p1' },
              { x: 2, y: 2, id: 'p2' },
            ],
          },
        ]}
        onItemClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'scatter',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should fire onItemClick with the focused radar item', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <RadarChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100, 20] }]}
        radar={{ metrics: ['M1', 'M2', 'M3'] }}
        onMarkClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'radar',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should fire onAxisClick with the focused rotation axis item on a radar chart', async () => {
    const onAxisClick = vi.fn();
    const { user } = render(
      <RadarChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100, 20] }]}
        radar={{ metrics: ['M1', 'M2', 'M3'] }}
        onAxisClick={onAxisClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onAxisClick.mock.calls.length).to.equal(1);
    expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
      dataIndex: 0,
      axisValue: 'M1',
      seriesValues: { A: 50 },
    });
  });
});
