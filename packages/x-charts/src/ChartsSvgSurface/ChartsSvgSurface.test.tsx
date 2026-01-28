import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { ChartsSvgSurface } from '@mui/x-charts/ChartsSvgSurface';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartProvider } from '../context/ChartProvider';

// JSDOM doesn't implement SVGElement
describe.skipIf(isJSDOM)('<ChartsSvgSurface />', () => {
  const { render } = createRenderer();

  it('should pass ref when it is added directly to component', () => {
    const ref = React.createRef<SVGSVGElement>();

    render(
      <ChartProvider pluginParams={{ width: 100, height: 100, series: [] }}>
        <ChartsSvgSurface ref={ref}>
          <rect width={100} height={100} />
        </ChartsSvgSurface>
      </ChartProvider>,
    );

    expect(ref.current instanceof SVGElement, 'ref is a SVGElement').to.equal(true);
    expect(
      ref.current?.lastElementChild instanceof SVGRectElement,
      'ref last child is a SVGRectElement',
    ).to.equal(true);
  });
});
