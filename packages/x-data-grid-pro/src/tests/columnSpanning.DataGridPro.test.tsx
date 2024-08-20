import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGridPro, GridApi, useGridApiRef, GridColDef, gridClasses } from '@mui/x-data-grid-pro';
import { getActiveCell, getCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Column spanning', () => {
  const { render } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
        category: 'Shoes',
        price: '$120',
        rating: '4.5',
      },
      {
        id: 1,
        brand: 'Adidas',
        category: 'Shoes',
        price: '$100',
        rating: '4.5',
      },
      {
        id: 2,
        brand: 'Puma',
        category: 'Shoes',
        price: '$90',
        rating: '4.5',
      },
    ],
  };

  it('should not apply `colSpan` in pinned columns section if there is only one column there', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGridPro
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: 2, width: 110 },
            { field: 'category' },
            { field: 'price' },
          ]}
          initialState={{ pinnedColumns: { left: ['brand'], right: [] } }}
        />
      </div>,
    );

    expect(getCell(0, 0).offsetWidth).to.equal(110);
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.not.throw();
    expect(() => getCell(0, 2)).to.not.throw();
  });

  it('should apply `colSpan` inside pinned columns section', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGridPro
          {...baselineProps}
          columns={[{ field: 'brand', colSpan: 2 }, { field: 'category' }, { field: 'price' }]}
          initialState={{ pinnedColumns: { left: ['brand', 'category'], right: [] } }}
        />
      </div>,
    );

    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.throw(/not found/);
    expect(() => getCell(0, 2)).to.not.throw();
  });

  describe('key navigation', () => {
    const columns: GridColDef[] = [
      { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
      { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
      { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
      { field: 'rating' },
    ];

    it('should work after column reordering', () => {
      let apiRef: React.MutableRefObject<GridApi>;

      function Test() {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 500, height: 300 }}>
            <DataGridPro apiRef={apiRef} {...baselineProps} columns={columns} />
          </div>
        );
      }

      render(<Test />);

      act(() => apiRef!.current.setColumnIndex('price', 1));

      fireUserEvent.mousePress(getCell(1, 1));
      fireEvent.keyDown(getCell(1, 1), { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-2');
    });
  });

  it('should recalculate cells after column reordering', () => {
    let apiRef: React.MutableRefObject<GridApi>;

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 500, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            {...baselineProps}
            columns={[
              { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
              { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
              { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
              { field: 'rating' },
            ]}
            disableVirtualization={isJSDOM}
          />
        </div>
      );
    }

    render(<Test />);

    act(() => apiRef!.current.setColumnIndex('brand', 1));

    // Nike row
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.not.throw();
    expect(() => getCell(0, 2)).to.throw(/not found/);
    expect(() => getCell(0, 3)).to.not.throw();

    // Adidas row
    expect(() => getCell(1, 0)).to.not.throw();
    expect(() => getCell(1, 1)).to.throw(/not found/);
    expect(() => getCell(1, 2)).to.not.throw();
    expect(() => getCell(1, 3)).to.not.throw();

    // Puma row
    expect(() => getCell(2, 0)).to.not.throw();
    expect(() => getCell(2, 1)).to.not.throw();
    expect(() => getCell(2, 2)).to.not.throw();
    expect(() => getCell(2, 3)).to.throw(/not found/);
  });

  it('should work with column resizing', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    const columns = [{ field: 'brand', colSpan: 2 }, { field: 'category' }, { field: 'price' }];

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGridPro {...baselineProps} columns={columns} />
      </div>,
    );

    expect(getColumnHeaderCell(0).offsetWidth).to.equal(100);
    expect(getColumnHeaderCell(1).offsetWidth).to.equal(100);
    expect(getCell(0, 0).offsetWidth).to.equal(200);

    const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 200, buttons: 1 });
    fireEvent.mouseUp(separator);

    expect(getColumnHeaderCell(0).offsetWidth).to.equal(200);
    expect(getColumnHeaderCell(1).offsetWidth).to.equal(100);
    expect(getCell(0, 0).offsetWidth).to.equal(300);
  });

  it('should apply `colSpan` correctly on GridApiRef setRows', () => {
    const columns: GridColDef[] = [
      { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
      { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
      { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
      { field: 'rating' },
    ];

    let apiRef: React.MutableRefObject<GridApi>;

    function Test() {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 500, height: 300 }}>
          <DataGridPro
            apiRef={apiRef}
            {...baselineProps}
            columns={columns}
            disableVirtualization={isJSDOM}
          />
        </div>
      );
    }

    render(<Test />);

    act(() =>
      apiRef!.current.setRows([
        {
          id: 0,
          brand: 'Adidas',
          category: 'Shoes',
          price: '$100',
          rating: '4.5',
        },
        {
          id: 1,
          brand: 'Nike',
          category: 'Shoes',
          price: '$120',
          rating: '4.5',
        },
        {
          id: 2,
          brand: 'Reebok',
          category: 'Shoes',
          price: '$90',
          rating: '4.5',
        },
      ]),
    );

    // Adidas row
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.not.throw();
    expect(() => getCell(0, 2)).to.throw(/not found/);
    expect(() => getCell(0, 3)).to.not.throw();

    // Nike row
    expect(() => getCell(1, 0)).to.not.throw();
    expect(() => getCell(1, 1)).to.throw(/not found/);
    expect(() => getCell(1, 2)).to.not.throw();
    expect(() => getCell(1, 3)).to.not.throw();

    // Reebok row
    expect(() => getCell(2, 0)).to.not.throw();
    expect(() => getCell(2, 1)).to.not.throw();
    expect(() => getCell(2, 2)).to.not.throw();
    expect(() => getCell(2, 3)).to.not.throw();
  });
});
