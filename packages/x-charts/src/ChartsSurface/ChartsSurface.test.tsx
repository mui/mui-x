import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { expect } from 'chai';
import { SvgRefProvider } from '../context/SvgRefProvider';
import { SizeProvider } from '../context/SizeProvider';

describe('<ChartsSurface />', () => {
  // JSDOM doesn't implement SVGElement
  if (/jsdom/.test(window.navigator.userAgent)) {
    return;
  }

  const { render } = createRenderer();

  it('should pass ref when it is added directly to component', () => {
    const ref = React.createRef<SVGSVGElement>();

    render(
      <SizeProvider width={100} height={100}>
        <SvgRefProvider>
          <ChartsSurface ref={ref}>
            <rect width={100} height={100} />
          </ChartsSurface>
        </SvgRefProvider>
      </SizeProvider>,
    );

    expect(ref.current instanceof SVGElement, 'ref is a SVGElement').to.equal(true);
    expect(
      ref.current?.lastElementChild instanceof SVGRectElement,
      'ref last child is a SVGRectElement',
    ).to.equal(true);
  });
});
