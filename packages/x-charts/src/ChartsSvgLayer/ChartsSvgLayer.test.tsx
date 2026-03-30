import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartsProvider } from '../context/ChartsProvider';

// JSDOM doesn't implement SVGElement
describe.skipIf(isJSDOM)('<ChartsSurface />', () => {
  const { render } = createRenderer();

  it('should pass ref when it is added directly to component', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <ChartsProvider pluginParams={{ width: 100, height: 100, series: [] }}>
        <ChartsSurface ref={ref}>
          <rect width={100} height={100} />
        </ChartsSurface>
      </ChartsProvider>,
    );

    expect(ref.current instanceof HTMLDivElement, 'ref is a HTMLDivElement').to.equal(true);
    expect(
      ref.current?.lastElementChild?.lastElementChild instanceof SVGRectElement,
      'ref last child is a SVGRectElement',
    ).to.equal(true);
  });
});
