import * as React from 'react';
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

    const getPieSeries = (
      props: Partial<React.ComponentProps<typeof ChartsRenderer>>,
    ): Record<string, any>[] => {
      const onRenderSpy = vi.fn();
      render(
        <ChartsRenderer
          dimensions={nestedDimensions}
          values={hours}
          chartType="pie"
          configuration={{}}
          onRender={onRenderSpy}
          {...props}
        />,
      );
      return onRenderSpy.mock.lastCall?.[1].series;
    };

    const toLabelValue = (series: Record<string, any>) =>
      series.data.map((item: any) => ({ label: item.label, value: item.value }));

    it('should draw one ring per value series when there is one dimension', () => {
      const series = getPieSeries({
        dimensions: [{ id: 'member', label: 'Member', data: ['Ana', 'Bea'] }],
        values: [
          { id: 'hours', label: 'Hours', data: [2, 3] },
          { id: 'count', label: 'Count', data: [1, 1] },
        ],
      });

      expect(series).to.have.length(2);
      expect(series[0].data.map((item: any) => item.label)).to.deep.equal([
        'Ana - Hours',
        'Bea - Hours',
      ]);
      expect(series[1].data.map((item: any) => item.label)).to.deep.equal([
        'Ana - Count',
        'Bea - Count',
      ]);
    });

    it('should number repeated items when there is one dimension', () => {
      const [ring] = getPieSeries({
        dimensions: [{ id: 'member', label: 'Member', data: ['Ana', 'Ana'] }],
        values: [{ id: 'hours', label: 'Hours', data: [2, 3] }],
      });

      expect(ring.data.map((item: any) => item.label)).to.deep.equal([
        'Ana - Hours',
        'Ana (2) - Hours',
      ]);
      expect(ring.data.map((item: any) => item.id)).to.deep.equal(['hours-0', 'hours-1']);
    });

    it('should draw one ring per dimension level when there are several dimensions', () => {
      const series = getPieSeries({});

      expect(series).to.have.length(2);
      expect(toLabelValue(series[0])).to.deep.equal([
        { label: 'Design - Hours', value: 5 },
        { label: 'Engineering - Hours', value: 5 },
      ]);
      expect(toLabelValue(series[1])).to.deep.equal([
        { label: 'Design - Ana - Hours', value: 2 },
        { label: 'Design - Bea - Hours', value: 3 },
        { label: 'Engineering - Carl - Hours', value: 5 },
      ]);
    });

    it('should place the first dimension in the innermost ring', () => {
      const [root, leaf] = getPieSeries({
        configuration: { innerRadius: 50, outerRadius: 150, seriesGap: 10 },
      });

      expect(root.data.map((item: any) => item.label)).to.deep.equal([
        'Design - Hours',
        'Engineering - Hours',
      ]);
      expect([root.innerRadius, root.outerRadius]).to.deep.equal([50, 89.5]);
      expect([leaf.innerRadius, leaf.outerRadius]).to.deep.equal([99.5, 139]);
    });

    it('should group the children under their parent even when the rows are interleaved', () => {
      const [root, leaf] = getPieSeries({
        dimensions: [
          { id: 'team', label: 'Team', data: ['Design', 'Engineering', 'Design'] },
          { id: 'member', label: 'Member', data: ['Ana', 'Carl', 'Bea'] },
        ],
      });

      expect(toLabelValue(root)).to.deep.equal([
        { label: 'Design - Hours', value: 7 },
        { label: 'Engineering - Hours', value: 3 },
      ]);
      expect(toLabelValue(leaf)).to.deep.equal([
        { label: 'Design - Ana - Hours', value: 2 },
        { label: 'Design - Bea - Hours', value: 5 },
        { label: 'Engineering - Carl - Hours', value: 3 },
      ]);
    });

    it('should sum the rows that share the same path', () => {
      const [root, leaf] = getPieSeries({
        dimensions: [
          { id: 'team', label: 'Team', data: ['Design', 'Design', 'Engineering'] },
          { id: 'member', label: 'Member', data: ['Ana', 'Ana', 'Carl'] },
        ],
      });

      expect(toLabelValue(root)).to.deep.equal([
        { label: 'Design - Hours', value: 5 },
        { label: 'Engineering - Hours', value: 5 },
      ]);
      expect(toLabelValue(leaf)).to.deep.equal([
        { label: 'Design - Ana - Hours', value: 5 },
        { label: 'Engineering - Carl - Hours', value: 5 },
      ]);
    });

    it('should keep children with the same label apart when their parents differ', () => {
      const [, leaf] = getPieSeries({
        dimensions: [
          { id: 'team', label: 'Team', data: ['Design', 'Engineering'] },
          { id: 'member', label: 'Member', data: ['Other', 'Other'] },
        ],
        values: [{ id: 'hours', label: 'Hours', data: [2, 3] }],
      });

      expect(toLabelValue(leaf)).to.deep.equal([
        { label: 'Design - Other - Hours', value: 2 },
        { label: 'Engineering - Other - Hours', value: 3 },
      ]);
    });

    it('should group the intermediate levels by their full path', () => {
      const series = getPieSeries({
        dimensions: [
          { id: 'team', label: 'Team', data: ['A', 'A', 'B'] },
          { id: 'dept', label: 'Dept', data: ['x', 'x', 'x'] },
          { id: 'member', label: 'Member', data: ['p', 'q', 'r'] },
        ],
        values: [{ id: 'hours', label: 'Hours', data: [1, 2, 4] }],
      });

      expect(series).to.have.length(3);
      expect(toLabelValue(series[0])).to.deep.equal([
        { label: 'A - Hours', value: 3 },
        { label: 'B - Hours', value: 4 },
      ]);
      expect(toLabelValue(series[1])).to.deep.equal([
        { label: 'A - x - Hours', value: 3 },
        { label: 'B - x - Hours', value: 4 },
      ]);
      expect(series[2].data.map((item: any) => item.value)).to.deep.equal([1, 2, 4]);
      expect(series.map((ring: any) => [ring.innerRadius, ring.outerRadius])).to.deep.equal([
        [50, 73],
        [83, 106],
        [116, 139],
      ]);
    });

    it('should ignore the padding angle when there are several dimensions', () => {
      const series = getPieSeries({ configuration: { paddingAngle: 10 } });

      expect(series.map((ring) => ring.paddingAngle)).to.deep.equal([0, 0]);
    });

    it('should apply the padding angle when there is one dimension', () => {
      const [ring] = getPieSeries({
        dimensions: [{ id: 'member', label: 'Member', data: ['Ana', 'Bea'] }],
        values: [{ id: 'hours', label: 'Hours', data: [2, 3] }],
        configuration: { paddingAngle: 10 },
      });

      expect(ring.paddingAngle).to.equal(10);
    });

    it('should not give the rings a negative radius when they do not fit', () => {
      const series = getPieSeries({
        values: Array.from({ length: 5 }, (_, index) => ({
          id: `value-${index}`,
          label: `Value ${index}`,
          data: [2, 3, 5],
        })),
      });

      expect(series).to.have.length(10);
      series.forEach((ring) => {
        expect(ring.outerRadius).to.equal(ring.innerRadius);
      });
    });

    it('should count null values as zero in every ring', () => {
      const [root, leaf] = getPieSeries({
        values: [{ id: 'hours', label: 'Hours', data: [2, null, 5] }],
      });

      expect(root.data.map((item: any) => item.value)).to.deep.equal([2, 5]);
      expect(leaf.data.map((item: any) => item.value)).to.deep.equal([2, 0, 5]);
    });

    it('should draw the dimension levels of each value series as consecutive rings', () => {
      const series = getPieSeries({
        values: [...hours, { id: 'count', label: 'Count', data: [1, 1, 1] }],
        configuration: { itemLabel: 'value' },
      });

      expect(series.map((ring: any) => ring.data[0].label)).to.deep.equal([
        'Design - Hours',
        'Design - Ana - Hours',
        'Design - Count',
        'Design - Ana - Count',
      ]);
      expect(series.every((ring: any) => ring.arcLabel === 'value')).to.equal(true);

      const ids = series.flatMap((ring: any) => ring.data.map((item: any) => item.id));
      expect(new Set(ids).size).to.equal(ids.length);
    });
  });
});
