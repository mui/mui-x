import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { expect } from 'chai';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import { ChartProvider } from '../context/ChartProvider';

// JSDOM doesn't implement SVGElement
describeSkipIf(isJSDOM)('<ChartsSurface />', () => {
  const { render } = createRenderer();

  it('should pass ref when it is added directly to component', () => {
    const ref = React.createRef<SVGSVGElement>();

    render(
      <ChartProvider pluginParams={{ width: 100, height: 100, series: [] }}>
        <ChartsSurface ref={ref}>
          <rect width={100} height={100} />
        </ChartsSurface>
      </ChartProvider>,
    );

    expect(ref.current instanceof SVGElement, 'ref is a SVGElement').to.equal(true);
    expect(
      ref.current?.lastElementChild instanceof SVGRectElement,
      'ref last child is a SVGRectElement',
    ).to.equal(true);
  });
});
