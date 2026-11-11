import { vi, describe, it, expect } from 'vitest';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import { screen } from '@mui/internal-test-utils';
import { colorPaletteLookup } from './colors';

describe('<ChartsRenderer />', () => {
  const { render } = createRenderer();

  it('should not render anything if the chart type is not supported', () => {
    render(
      <div data-testid="container">
        <ChartsRenderer dimensions={[]} values={[]} chartType="unsupported" configuration={{}} />
      </div>,
    );

    expect(screen.queryByTestId('container')!.querySelector('svg')).to.equal(null);
  });

  it('should render a bar chart if the chart type is supported', () => {
    render(
      <div data-testid="container">
        <ChartsRenderer dimensions={[]} values={[]} chartType="bar" configuration={{}} />
      </div>,
    );

    expect(screen.queryByTestId('container')!.querySelector('svg')).not.to.equal(null);
  });

  it('should pass the rendering to the onRender callback', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    expect(onRenderSpy.mock.lastCall?.[0]).to.equal('line');
  });

  it('should compute props for the chart', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.mock.lastCall?.[1];
    expect(props.colors).to.equal(colorPaletteLookup.get('rainbowSurgePalette'));
  });

  it('should override the props if the configuration has an updated value', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{
            colors: 'mangoFusionPalette',
          }}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.mock.lastCall?.[1];
    expect(props.colors).to.equal(colorPaletteLookup.get('mangoFusionPalette'));
  });

  it('should place dimensions and values to the correct place in the props', () => {
    const onRenderSpy = vi.fn();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[{ id: 'dimension', label: 'Dimension', data: ['A'] }]}
          values={[{ id: 'value', label: 'Value', data: [1, 2, 3] }]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.mock.lastCall?.[1];
    expect(props.series[0].data).to.deep.equal([1, 2, 3]);
  });

  describe('pie chart', () => {
    const nestedDimensions = [
      { id: 'team', label: 'Team', data: ['Design', 'Design', 'Engineering'] },
      { id: 'member', label: 'Member', data: ['Ana', 'Bea', 'Carl'] },
    ];
    const hours = [{ id: 'hours', label: 'Hours', data: [2, 3, 5] }];

    it('should draw one ring per value series when there is one dimension', () => {
      const onRenderSpy = vi.fn();
      render(
        <ChartsRenderer
          dimensions={[{ id: 'member', label: 'Member', data: ['Ana', 'Bea'] }]}
          values={[
            { id: 'hours', label: 'Hours', data: [2, 3] },
            { id: 'count', label: 'Count', data: [1, 1] },
          ]}
          chartType="pie"
          configuration={{}}
          onRender={onRenderSpy}
        />,
      );

      const props = onRenderSpy.mock.lastCall?.[1];
      expect(props.series).to.have.length(2);
      expect(props.series[0].data.map((item: any) => item.label)).to.deep.equal([
        'Ana - Hours',
        'Bea - Hours',
      ]);
      expect(props.series[1].data.map((item: any) => item.label)).to.deep.equal([
        'Ana - Count',
        'Bea - Count',
      ]);
    });

    it('should draw one ring per dimension level when there are several dimensions', () => {
      const onRenderSpy = vi.fn();
      render(
        <ChartsRenderer
          dimensions={nestedDimensions}
          values={hours}
          chartType="pie"
          configuration={{}}
          onRender={onRenderSpy}
        />,
      );

      const props = onRenderSpy.mock.lastCall?.[1];
      expect(props.series).to.have.length(2);
      expect(
        props.series[0].data.map((item: any) => ({ label: item.label, value: item.value })),
      ).to.deep.equal([
        { label: 'Design - Hours', value: 5 },
        { label: 'Engineering - Hours', value: 5 },
      ]);
      expect(
        props.series[1].data.map((item: any) => ({ label: item.label, value: item.value })),
      ).to.deep.equal([
        { label: 'Ana - Hours', value: 2 },
        { label: 'Bea - Hours', value: 3 },
        { label: 'Carl - Hours', value: 5 },
      ]);
    });

    it('should place the first dimension in the innermost ring', () => {
      const onRenderSpy = vi.fn();
      render(
        <ChartsRenderer
          dimensions={nestedDimensions}
          values={hours}
          chartType="pie"
          configuration={{ innerRadius: 50, outerRadius: 150, seriesGap: 10 }}
          onRender={onRenderSpy}
        />,
      );

      const [root, leaf] = onRenderSpy.mock.lastCall![1].series;
      expect(root.innerRadius).to.equal(50);
      expect(root.outerRadius).to.be.lessThan(leaf.innerRadius);
      expect(leaf.outerRadius).to.be.lessThanOrEqual(150);
    });

    it('should keep children with the same label apart when their parents differ', () => {
      const onRenderSpy = vi.fn();
      render(
        <ChartsRenderer
          dimensions={[
            { id: 'team', label: 'Team', data: ['Design', 'Engineering'] },
            { id: 'member', label: 'Member', data: ['Other', 'Other'] },
          ]}
          values={[{ id: 'hours', label: 'Hours', data: [2, 3] }]}
          chartType="pie"
          configuration={{}}
          onRender={onRenderSpy}
        />,
      );

      const [, leaf] = onRenderSpy.mock.lastCall![1].series;
      expect(leaf.data.map((item: any) => item.value)).to.deep.equal([2, 3]);
    });

    it('should draw the dimension levels of each value series as consecutive rings', () => {
      const onRenderSpy = vi.fn();
      render(
        <ChartsRenderer
          dimensions={nestedDimensions}
          values={[...hours, { id: 'count', label: 'Count', data: [1, 1, 1] }]}
          chartType="pie"
          configuration={{}}
          onRender={onRenderSpy}
        />,
      );

      const props = onRenderSpy.mock.lastCall?.[1];
      expect(props.series.map((series: any) => series.data[0].label)).to.deep.equal([
        'Design - Hours',
        'Ana - Hours',
        'Design - Count',
        'Ana - Count',
      ]);
    });
  });
});
