import { createRenderer, fireEvent } from '@mui/internal-test-utils/createRenderer';
import { vi, describe, it, expect } from 'vitest';
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

  it('should not move the focused item with modified arrow keys', async () => {
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
    // Modified arrows are reserved for other interactions, such as keyboard zoom and pan.
    await user.keyboard('{Shift>}[ArrowRight]{/Shift}');
    await user.keyboard('{Alt>}[ArrowRight]{/Alt}');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'bar',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should ignore the auto-repeat keydown while the key is held down', async () => {
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

    const target = document.activeElement!;
    // The browser marks every keydown after the first as a repeat while the key is held.
    fireEvent.keyDown(target, { key: 'Enter', repeat: true });
    expect(onItemClick.mock.calls.length).to.equal(0);

    fireEvent.keyDown(target, { key: 'Enter' });
    expect(onItemClick.mock.calls.length).to.equal(1);
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

  it('should skip onMarkClick and fall back to onLineClick when marks are hidden', async () => {
    const onMarkClick = vi.fn();
    const onLineClick = vi.fn();
    const { user } = render(
      <LineChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100], showMark: false }]}
        onMarkClick={onMarkClick}
        onLineClick={onLineClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    // The mark is not rendered, so a pointer could not click it; activation falls through to the line.
    expect(onMarkClick.mock.calls.length).to.equal(0);
    expect(onLineClick.mock.calls.length).to.equal(1);
    expect(onLineClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'line',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should not fire onAreaClick when the area is disabled', async () => {
    const onAreaClick = vi.fn();
    const { user } = render(
      <LineChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100], area: false, showMark: false }]}
        onAreaClick={onAreaClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    // No area is drawn, so a pointer could not click it and neither can the keyboard.
    expect(onAreaClick.mock.calls.length).to.equal(0);
  });

  it('should fire onAreaClick when the area is enabled', async () => {
    const onAreaClick = vi.fn();
    const { user } = render(
      <LineChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100], area: true, showMark: false }]}
        onAreaClick={onAreaClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onAreaClick.mock.calls.length).to.equal(1);
  });

  it('should fire onMarkClick when marks are shown', async () => {
    const onMarkClick = vi.fn();
    const onLineClick = vi.fn();
    const { user } = render(
      <LineChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100], showMark: true }]}
        onMarkClick={onMarkClick}
        onLineClick={onLineClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onMarkClick.mock.calls.length).to.equal(1);
    expect(onLineClick.mock.calls.length).to.equal(0);
  });

  it('should fall back to onAreaClick when it is the only line callback', async () => {
    const onAreaClick = vi.fn();
    const { user } = render(
      <LineChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100], area: true }]}
        onAreaClick={onAreaClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onAreaClick.mock.calls.length).to.equal(1);
  });

  it('should fall back to onAreaClick when it is the only radar callback', async () => {
    const onAreaClick = vi.fn();
    const { user } = render(
      <RadarChart
        {...barConfig}
        series={[{ id: 'A', data: [50, 100, 20] }]}
        radar={{ metrics: ['M1', 'M2', 'M3'] }}
        onAreaClick={onAreaClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onAreaClick.mock.calls.length).to.equal(1);
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
});
