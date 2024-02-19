import * as React from 'react';
import { createRenderer } from '@mui-internal/test-utils';
import { expect } from 'chai';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Infnite loader', () => {
  const { render } = createRenderer();

  function IntersectionObserverMock(callback: (entries: IntersectionObserverEntry[]) => void) {
    return {
      observe: (element: HTMLElement) => {
        callback([
          {
            // @ts-ignore
            boundingClientRect: {
              y: element.getBoundingClientRect().y,
            },
            intersectionRatio: 1,
            isIntersecting: true,
          },
        ]);
      },
      disconnect: () => null,
    };
  }

  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    window.IntersectionObserver = IntersectionObserverMock as any;
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it('call onRowsScrollEnd when viewport scroll reaches the bottom', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const baseRows = [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
      { id: 3, brand: 'Under Armor' },
      { id: 4, brand: 'Jordan' },
      { id: 5, brand: 'Reebok' },
    ];
    const handleRowsScrollEnd = spy();
    function TestCase({ rows }: { rows: typeof baseRows }) {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[{ field: 'brand', width: 100 }]}
            rows={rows}
            onRowsScrollEnd={handleRowsScrollEnd}
          />
        </div>
      );
    }
    const { container } = render(<TestCase rows={baseRows} />);
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller')!;
    // arbitrary number to make sure that the bottom of the grid window is reached.
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(1);
  });
});
