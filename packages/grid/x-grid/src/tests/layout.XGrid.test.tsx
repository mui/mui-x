import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { XGrid } from '@material-ui/x-grid';

describe('<XGrid /> - Layout', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [{ field: 'brand', width: 100 }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  // Adapation of describeConformance()
  describe('Material-UI component API', () => {
    it(`attaches the ref`, () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} ref={ref} />
        </div>,
      );
      expect(ref.current).to.be.instanceof(window.HTMLDivElement);
      expect(ref.current).to.equal(container.firstChild.firstChild.firstChild);
    });

    function randomStringValue() {
      return `r${Math.random().toString(36).slice(2)}`;
    }

    it('applies the className to the root component', () => {
      const className = randomStringValue();

      const { container } = render(
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} className={className} />
        </div>,
      );

      expect(document.querySelector(`.${className}`)).to.equal(
        container.firstChild.firstChild.firstChild,
      );
    });
  });
});
