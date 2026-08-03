import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { BarChart } from '@mui/x-charts/BarChart';
import type { BarChartProps } from '@mui/x-charts/BarChart';
import { useYAxis } from '@mui/x-charts/hooks';

describe('<BarChart /> - value domain', () => {
  const { render } = createRenderer();

  function getYAxisDomain(props: Partial<BarChartProps> & Pick<BarChartProps, 'series'>) {
    const yAxisDomainRef: { current: any[] } = { current: [] };

    function DomainSpy() {
      const yAxis = useYAxis();
      React.useEffect(() => {
        yAxisDomainRef.current = yAxis.scale.domain();
      });
      return null;
    }

    render(
      <BarChart
        xAxis={[{ data: ['A', 'B'] }]}
        width={500}
        height={300}
        {...props}
        series={props.series}
      >
        <DomainSpy />
      </BarChart>,
    );

    return yAxisDomainRef;
  }

  it('should include 0 in the domain by default', () => {
    const yAxisDomainRef = getYAxisDomain({ series: [{ data: [100, 200] }] });

    expect(yAxisDomainRef.current).to.deep.equal([0, 200]);
  });

  describe('min/max constraints', () => {
    it('should respect the `min` constraint', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [100, 200] }],
        yAxis: [{ min: -100 }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([-100, 200]);
    });

    it('should respect the `max` constraint', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [100, 200] }],
        yAxis: [{ max: 300 }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([0, 300]);
    });

    it('should respect both `min` and `max` constraints', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [100, 200] }],
        yAxis: [{ min: -100, max: 300 }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([-100, 300]);
    });

    it('should allow `max` in the data extrema', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [100, 200] }],
        yAxis: [{ max: 150 }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([0, 150]);
    });

    it('should allow `min` in the data extrema', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [100, 200] }],
        yAxis: [{ min: 50 }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([50, 200]);
    });
  });

  describe('domainLimit', () => {
    it("should round the domain to nice values with `domainLimit: 'nice'`", () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [33, 187] }],
        yAxis: [{ domainLimit: 'nice' }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([0, 200]);
    });

    it("should keep the exact data extrema with `domainLimit: 'strict'`", () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [33, 187] }],
        yAxis: [{ domainLimit: 'strict' }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([0, 187]);
    });

    it('should use the custom bounds returned by a `domainLimit` function', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [100, 200] }],
        yAxis: [{ domainLimit: (min, max) => ({ min: Number(min) - 10, max: Number(max) + 10 }) }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([-10, 210]);
    });

    it('should let `min`/`max` take precedence over `domainLimit`', () => {
      const yAxisDomainRef = getYAxisDomain({
        series: [{ data: [33, 187] }],
        yAxis: [{ domainLimit: 'nice', min: 0, max: 187 }],
      });

      expect(yAxisDomainRef.current).to.deep.equal([0, 187]);
    });
  });
});
