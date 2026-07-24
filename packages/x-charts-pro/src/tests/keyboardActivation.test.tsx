import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';

describe('keyboard item activation - pro charts', () => {
  const { render } = createRenderer();

  const config = {
    height: 100,
    width: 100,
    margin: 0,
    skipAnimation: true,
    hideLegend: true,
  } as const;

  it('should fire onItemClick with the focused funnel section', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <FunnelChart
        {...config}
        series={[{ id: 'A', data: [{ value: 200 }, { value: 100 }] }]}
        onItemClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'funnel',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should fire onItemClick with the focused heatmap cell', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <Heatmap
        {...config}
        xAxis={[{ data: ['A', 'B'] }]}
        yAxis={[{ data: ['X', 'Y'] }]}
        series={[
          {
            id: 'S',
            data: [
              [0, 0, 1],
              [0, 1, 2],
              [1, 0, 3],
              [1, 1, 4],
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
      type: 'heatmap',
      seriesId: 'S',
      xIndex: 0,
      yIndex: 0,
      value: 1,
    });
  });

  it('should fire onNodeClick with the focused sankey node', async () => {
    const onNodeClick = vi.fn();
    const { user } = render(
      <SankeyChart
        height={100}
        width={100}
        margin={0}
        series={{
          data: {
            links: [
              { source: 'a', target: 'b', value: 5 },
              { source: 'b', target: 'c', value: 5 },
            ],
          },
        }}
        onNodeClick={onNodeClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onNodeClick.mock.calls.length).to.equal(1);
    expect(onNodeClick.mock.lastCall?.[1].subType).to.equal('node');
  });
});
