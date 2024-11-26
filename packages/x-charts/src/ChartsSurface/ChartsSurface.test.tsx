import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { expect } from 'chai';
import { SizeProvider } from '../context/SizeProvider';
import { ChartProvider } from '../internals';

describe('<ChartsSurface />', () => {
  // JSDOM doesn't implement SVGElement
  if (/jsdom/.test(window.navigator.userAgent)) {
    return;
  }

  const { render } = createRenderer();

  it('should pass ref when it is added directly to component', () => {
    const ref = React.createRef<SVGSVGElement>();

    render(
      <ChartProvider>
        <SizeProvider width={100} height={100}>
          <ChartsSurface
            ref={ref}
            disableAxisListener // TODO: remove during v8 when charts store is always available
          >
            <rect width={100} height={100} />
          </ChartsSurface>
        </SizeProvider>
      </ChartProvider>,
    );

    expect(ref.current instanceof SVGElement, 'ref is a SVGElement').to.equal(true);
    expect(
      ref.current?.lastElementChild instanceof SVGRectElement,
      'ref last child is a SVGRectElement',
    ).to.equal(true);
  });
});
