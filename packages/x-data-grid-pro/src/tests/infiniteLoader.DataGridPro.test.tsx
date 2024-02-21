import * as React from 'react';
import { createRenderer, waitFor } from '@mui-internal/test-utils';
import { expect } from 'chai';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Infnite loader', () => {
  const { render } = createRenderer();

  it('call onRowsScrollEnd when viewport scroll reaches the bottom', async function test() {
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
    const { container, setProps } = render(<TestCase rows={baseRows} />);
    const virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller')!;
    // arbitrary number to make sure that the bottom of the grid window is reached.
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(handleRowsScrollEnd.callCount).to.equal(1);
    });
    setProps({
      rows: baseRows.concat(
        { id: 6, brand: 'Gucci' },
        { id: 7, brand: "Levi's" },
        { id: 8, brand: 'Ray-Ban' },
      ),
    });
    // Trigger a scroll again to notify the grid that we're not in the bottom area anymore
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(handleRowsScrollEnd.callCount).to.equal(1);
    virtualScroller.scrollTop = 12345;
    virtualScroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(handleRowsScrollEnd.callCount).to.equal(2);
    });
  });
});
