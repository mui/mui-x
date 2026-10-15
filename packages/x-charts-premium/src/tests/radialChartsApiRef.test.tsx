import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { RadialBarChart } from '../RadialBarChart';
import { RadialLineChart } from '../RadialLineChart';

describe('radial charts apiRef', () => {
  const { render } = createRenderer();

  it('forwards apiRef on RadialBarChart', () => {
    const apiRef: React.RefObject<any> = { current: undefined };
    render(
      <RadialBarChart
        apiRef={apiRef}
        width={300}
        height={300}
        series={[{ data: [1, 2] }]}
        rotationAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
      />,
    );

    expect(apiRef.current?.exportAsImage).to.be.a('function');
  });

  it('forwards apiRef on RadialLineChart', () => {
    const apiRef: React.RefObject<any> = { current: undefined };
    render(
      <RadialLineChart
        apiRef={apiRef}
        width={300}
        height={300}
        series={[{ data: [1, 2] }]}
        rotationAxis={[{ scaleType: 'point', data: ['A', 'B'] }]}
      />,
    );

    expect(apiRef.current?.exportAsImage).to.be.a('function');
  });
});
