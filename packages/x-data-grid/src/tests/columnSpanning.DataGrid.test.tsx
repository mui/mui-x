import * as React from 'react';
import { createRenderer, fireEvent, screen, within } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid';
import { getCell, getActiveCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Column spanning', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

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

  it('should support `colSpan` number signature', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: 3 },
            { field: 'category' },
            { field: 'price' },
            { field: 'rating' },
          ]}
          disableVirtualization={isJSDOM}
        />
      </div>,
    );
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.throw(/not found/);
    expect(() => getCell(0, 2)).to.throw(/not found/);
    expect(() => getCell(0, 3)).to.not.throw();
  });

  it('should support `colSpan` function signature', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
            { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
            { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
            { field: 'rating' },
          ]}
          disableVirtualization={isJSDOM}
        />
      </div>,
    );
    // Nike
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.throw(/not found/);
    expect(() => getCell(0, 2)).to.not.throw();
    expect(() => getCell(0, 3)).to.not.throw();

    // Adidas
    expect(() => getCell(1, 0)).to.not.throw();
    expect(() => getCell(1, 1)).to.not.throw();
    expect(() => getCell(1, 2)).to.throw(/not found/);
    expect(() => getCell(1, 3)).to.not.throw();

    // Puma
    expect(() => getCell(2, 0)).to.not.throw();
    expect(() => getCell(2, 1)).to.not.throw();
    expect(() => getCell(2, 2)).to.not.throw();
    expect(() => getCell(2, 3)).to.throw(/not found/);
  });

  it('should treat `colSpan` 0 value as 1', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: 0 },
            { field: 'category', colSpan: () => 0 },
            { field: 'price' },
          ]}
          rows={[{ id: 0, brand: 'Nike', category: 'Shoes', price: '$120' }]}
        />
      </div>,
    );
    // First Nike row
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.not.throw();
    expect(() => getCell(0, 2)).to.not.throw();
  });

  describe('key navigation', () => {
    const columns: GridColDef[] = [
      { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
      { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
      { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
      { field: 'rating' },
    ];

    it('should move to the cell right when pressing "ArrowRight"', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={columns} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 0));
      expect(getActiveCell()).to.equal('0-0');

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('0-2');
    });

    it('should move to the cell left when pressing "ArrowLeft"', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={columns} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 2));
      expect(getActiveCell()).to.equal('0-2');

      fireEvent.keyDown(getCell(0, 2), { key: 'ArrowLeft' });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should move to the cell above when pressing "ArrowUp"', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={columns} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(1, 1));
      expect(getActiveCell()).to.equal('1-1');

      fireEvent.keyDown(getCell(1, 1), { key: 'ArrowUp' });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should move to the cell below when pressing "ArrowDown"', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={columns} disableVirtualization={isJSDOM} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(1, 3));
      expect(getActiveCell()).to.equal('1-3');

      fireEvent.keyDown(getCell(1, 3), { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('2-2');
    });

    it('should move down by the amount of rows visible on screen when pressing "PageDown"', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={columns}
            autoHeight={isJSDOM}
            disableVirtualization={isJSDOM}
          />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 3));
      expect(getActiveCell()).to.equal('0-3');

      fireEvent.keyDown(getCell(0, 3), { key: 'PageDown' });
      expect(getActiveCell()).to.equal('2-2');
    });

    it('should move up by the amount of rows visible on screen when pressing "PageUp"', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={columns} autoHeight={isJSDOM} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(2, 1));
      expect(getActiveCell()).to.equal('2-1');

      fireEvent.keyDown(getCell(2, 1), { key: 'PageUp' });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should move to the cell below when pressing "Enter" after editing', () => {
      const editableColumns = columns.map((column) => ({ ...column, editable: true }));
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={editableColumns}
            autoHeight={isJSDOM}
            disableVirtualization={isJSDOM}
          />
        </div>,
      );

      fireUserEvent.mousePress(getCell(1, 3));
      expect(getActiveCell()).to.equal('1-3');

      // start editing
      fireEvent.keyDown(getCell(1, 3), { key: 'Enter' });

      // commit
      fireEvent.keyDown(getCell(1, 3).querySelector('input')!, { key: 'Enter' });
      expect(getActiveCell()).to.equal('2-2');
    });

    it('should move to the cell on the right when pressing "Tab" after editing', () => {
      const editableColumns = columns.map((column) => ({ ...column, editable: true }));
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={editableColumns} disableVirtualization={isJSDOM} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(1, 1));
      expect(getActiveCell()).to.equal('1-1');

      // start editing
      fireEvent.keyDown(getCell(1, 1), { key: 'Enter' });

      fireEvent.keyDown(getCell(1, 1).querySelector('input')!, { key: 'Tab' });
      expect(getActiveCell()).to.equal('1-3');
    });

    it('should move to the cell on the left when pressing "Shift+Tab" after editing', async () => {
      const editableColumns = columns.map((column) => ({ ...column, editable: true }));
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid {...baselineProps} columns={editableColumns} disableVirtualization={isJSDOM} />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 2));
      expect(getActiveCell()).to.equal('0-2');

      // start editing
      fireEvent.keyDown(getCell(0, 2), { key: 'Enter' });

      fireEvent.keyDown(getCell(0, 2).querySelector('input')!, { key: 'Tab', shiftKey: true });
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should work with row virtualization', function test() {
      if (isJSDOM) {
        // needs virtualization
        this.skip();
      }

      const rows = [
        {
          id: 0,
          brand: 'Nike',
          category: 'Shoes',
          price: '$120',
        },
        {
          id: 1,
          brand: 'Nike',
          category: 'Shoes',
          price: '$120',
        },
        {
          id: 2,
          brand: 'Nike',
          category: 'Shoes',
          price: '$120',
        },

        {
          id: 3,
          brand: 'Adidas',
          category: 'Shoes',
          price: '$100',
        },
      ];

      const rowHeight = 52;

      render(
        <div style={{ width: 500, height: (rows.length + 1) * rowHeight }}>
          <DataGrid
            columns={[
              { field: 'brand', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
              { field: 'category' },
              { field: 'price' },
            ]}
            rows={rows}
            rowBufferPx={rowHeight}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireUserEvent.mousePress(getCell(1, 1));
      expect(getActiveCell()).to.equal('1-1');

      fireEvent.keyDown(getCell(1, 1), { key: 'ArrowDown' });

      const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
      // trigger virtualization
      virtualScroller.dispatchEvent(new Event('scroll'));

      fireEvent.keyDown(getCell(2, 1), { key: 'ArrowDown' });
      const activeCell = getActiveCell();
      expect(activeCell).to.equal('3-0');
    });

    it('should work with column virtualization', function test() {
      if (isJSDOM) {
        this.skip(); // needs layout
      }

      render(
        <div style={{ width: 200, height: 200 }}>
          <DataGrid
            columns={[
              { field: 'col0', width: 100, colSpan: 3 },
              { field: 'col1', width: 100 },
              { field: 'col2', width: 100 },
              { field: 'col3', width: 100 },
            ]}
            rows={[{ id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3' }]}
            columnBufferPx={100}
          />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 0));

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowRight' });
      document.querySelector(`.${gridClasses.virtualScroller}`)!.dispatchEvent(new Event('scroll'));

      expect(() => getCell(0, 3)).to.not.throw();
      // should not be rendered because of first column colSpan
      expect(() => getCell(0, 2)).to.throw(/not found/);
    });

    it('should work with filtering', () => {
      render(
        <div style={{ width: 500, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[
              { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
              { field: 'category' },
              { field: 'price' },
              { field: 'rating' },
            ]}
            rows={[
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
              {
                id: 3,
                brand: 'Nike',
                category: 'Shoes',
                price: '$120',
                rating: '4.5',
              },
              {
                id: 4,
                brand: 'Adidas',
                category: 'Shoes',
                price: '$100',
                rating: '4.5',
              },
              {
                id: 5,
                brand: 'Puma',
                category: 'Shoes',
                price: '$90',
                rating: '4.5',
              },
            ]}
            initialState={{
              filter: {
                filterModel: {
                  items: [{ field: 'brand', operator: 'equals', value: 'Nike' }],
                },
              },
            }}
          />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 0));
      expect(getActiveCell()).to.equal('0-0');

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('1-0');

      fireEvent.keyDown(getCell(1, 0), { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('1-2');
    });

    it('should scroll the whole cell into view when `colSpan` > 1', function test() {
      if (isJSDOM) {
        this.skip(); // needs layout
      }

      render(
        <div style={{ width: 200, height: 200 }}>
          <DataGrid
            columns={[
              { field: 'col0', width: 100, colSpan: 2 },
              { field: 'col1', width: 100 },
              { field: 'col2', width: 100 },
              { field: 'col3', width: 100, colSpan: 2 },
              { field: 'col4', width: 100 },
            ]}
            rows={[{ id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3', col4: '0-4' }]}
            columnBufferPx={100}
          />
        </div>,
      );

      fireUserEvent.mousePress(getCell(0, 0));

      const virtualScroller = document.querySelector<HTMLElement>(
        `.${gridClasses.virtualScroller}`,
      )!;

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowRight' });
      virtualScroller.dispatchEvent(new Event('scroll'));
      fireEvent.keyDown(getCell(0, 2), { key: 'ArrowRight' });
      virtualScroller.dispatchEvent(new Event('scroll'));
      expect(getActiveCell()).to.equal('0-3');
      // should be scrolled to the end of the cell
      expect(virtualScroller.scrollLeft).to.equal(3 * 100);

      fireEvent.keyDown(getCell(0, 3), { key: 'ArrowLeft' });
      virtualScroller.dispatchEvent(new Event('scroll'));
      fireEvent.keyDown(getCell(0, 2), { key: 'ArrowLeft' });
      virtualScroller.dispatchEvent(new Event('scroll'));

      expect(getActiveCell()).to.equal('0-0');
      expect(virtualScroller.scrollLeft).to.equal(0);
    });
  });

  it('should work with filtering', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
            { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
            { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
            { field: 'rating' },
          ]}
          rows={[
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
            {
              id: 3,
              brand: 'Nike',
              category: 'Shoes',
              price: '$120',
              rating: '4.5',
            },
            {
              id: 4,
              brand: 'Adidas',
              category: 'Shoes',
              price: '$100',
              rating: '4.5',
            },
            {
              id: 5,
              brand: 'Puma',
              category: 'Shoes',
              price: '$90',
              rating: '4.5',
            },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'equals', value: 'Nike' }],
              },
            },
          }}
          disableVirtualization={isJSDOM}
        />
      </div>,
    );
    // First Nike row
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.throw(/not found/);
    expect(() => getCell(0, 2)).to.not.throw();
    expect(() => getCell(0, 3)).to.not.throw();

    // Second Nike row
    expect(() => getCell(1, 0)).to.not.throw();
    expect(() => getCell(1, 1)).to.throw(/not found/);
    expect(() => getCell(1, 2)).to.not.throw();
    expect(() => getCell(1, 3)).to.not.throw();
  });

  it('should apply `colSpan` properly after hiding a column', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
            { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
            { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
            { field: 'rating' },
          ]}
        />
      </div>,
    );

    // hide `category` column
    fireEvent.click(within(getColumnHeaderCell(1)).getByLabelText('Menu'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Hide column' }));
    clock.runToLast();

    // Nike row
    expect(() => getCell(0, 0)).to.not.throw();
    expect(() => getCell(0, 1)).to.throw(/not found/);
    expect(() => getCell(0, 2)).to.not.throw();

    // Adidas row
    expect(() => getCell(1, 0)).to.not.throw();
    expect(() => getCell(1, 1)).to.not.throw();
    expect(() => getCell(1, 2)).to.not.throw();

    // Puma row
    expect(() => getCell(2, 0)).to.not.throw();
    expect(() => getCell(2, 1)).to.not.throw();
    expect(() => getCell(2, 2)).to.throw(/not found/);
  });

  it('should add `aria-colspan` attribute when `colSpan` > 1', () => {
    render(
      <div style={{ width: 500, height: 300 }}>
        <DataGrid
          {...baselineProps}
          columns={[
            { field: 'brand', colSpan: 2 },
            { field: 'category' },
            { field: 'price' },
            { field: 'rating' },
          ]}
        />
      </div>,
    );

    expect(getCell(0, 0)).to.have.attribute('aria-colspan', '2');
    expect(getCell(0, 2)).to.have.attribute('aria-colspan', '1');
  });

  it('should work with pagination', () => {
    const rows = [
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
      {
        id: 3,
        brand: 'Nike',
        category: 'Shoes',
        price: '$120',
        rating: '4.5',
      },
      {
        id: 4,
        brand: 'Adidas',
        category: 'Shoes',
        price: '$100',
        rating: '4.5',
      },
      {
        id: 5,
        brand: 'Puma',
        category: 'Shoes',
        price: '$90',
        rating: '4.5',
      },
    ];

    const columns: GridColDef[] = [
      { field: 'brand', colSpan: (value, row) => (row.brand === 'Nike' ? 2 : 1) },
      { field: 'category', colSpan: (value, row) => (row.brand === 'Adidas' ? 2 : 1) },
      { field: 'price', colSpan: (value, row) => (row.brand === 'Puma' ? 2 : 1) },
      { field: 'rating' },
    ];

    const pageSize = 2;

    function checkRows(pageNumber: number, rowsList: Array<'Nike' | 'Adidas' | 'Puma'>) {
      rowsList.forEach((rowName, index) => {
        const rowIndex = pageNumber * pageSize + index;
        if (rowName === 'Nike') {
          expect(() => getCell(rowIndex, 0)).to.not.throw();
          expect(() => getCell(rowIndex, 1)).to.throw(/not found/);
          expect(() => getCell(rowIndex, 2)).to.not.throw();
          expect(() => getCell(rowIndex, 3)).to.not.throw();
        } else if (rowName === 'Adidas') {
          expect(() => getCell(rowIndex, 0)).to.not.throw();
          expect(() => getCell(rowIndex, 1)).to.not.throw();
          expect(() => getCell(rowIndex, 2)).to.throw(/not found/);
          expect(() => getCell(rowIndex, 3)).to.not.throw();
        } else if (rowName === 'Puma') {
          expect(() => getCell(rowIndex, 0)).to.not.throw();
          expect(() => getCell(rowIndex, 1)).to.not.throw();
          expect(() => getCell(rowIndex, 2)).to.not.throw();
          expect(() => getCell(rowIndex, 3)).to.throw(/not found/);
        }
      });
    }

    function TestCase() {
      return (
        <div style={{ width: 500, height: 300 }}>
          <DataGrid
            columns={columns}
            rows={rows}
            initialState={{ pagination: { paginationModel: { pageSize } } }}
            pageSizeOptions={[pageSize]}
            disableVirtualization={isJSDOM}
          />
        </div>
      );
    }

    render(<TestCase />);

    checkRows(0, ['Nike', 'Adidas']);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    checkRows(1, ['Puma', 'Nike']);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    checkRows(2, ['Adidas', 'Puma']);
  });

  it('should work with column virtualization', function test() {
    if (isJSDOM) {
      // Need layouting for column virtualization
      this.skip();
    }

    render(
      <div style={{ width: 390, height: 300 }}>
        <DataGrid
          columns={[
            { field: 'col0', width: 100, colSpan: (value) => (value === '1-0' ? 3 : 1) },
            { field: 'col1', width: 100 },
            { field: 'col2', width: 100 },
            { field: 'col3', width: 100 },
            { field: 'col4', width: 100 },
            { field: 'col5', width: 100 },
          ]}
          rows={[
            { id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3', col4: '0-4', col5: '0-5' },
            { id: 1, col0: '1-0', col1: '1-1', col2: '1-2', col3: '1-3', col4: '1-4', col5: '1-5' },
          ]}
          columnBufferPx={100}
        />
      </div>,
    );

    expect(getCell(0, 4).offsetLeft).to.equal(
      getCell(1, 4).offsetLeft,
      'last cells in both rows should be aligned',
    );

    expect(getColumnHeaderCell(4).offsetLeft).to.equal(
      getCell(1, 4).offsetLeft,
      'last cell and column header cell should be aligned',
    );

    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    // scroll to the very end
    virtualScroller.scrollLeft = 1000;
    virtualScroller.dispatchEvent(new Event('scroll'));

    expect(getCell(0, 5).offsetLeft).to.equal(
      getCell(1, 5).offsetLeft,
      'last cells in both rows should be aligned after scroll',
    );

    expect(getColumnHeaderCell(5).offsetLeft).to.equal(
      getCell(1, 5).offsetLeft,
      'last cell and column header cell should be aligned after scroll',
    );
  });

  it('should work with both column and row virtualization', function test() {
    if (isJSDOM) {
      // Need layouting for column virtualization
      this.skip();
    }

    const rowHeight = 50;

    render(
      <div style={{ width: 390, height: 300 }}>
        <DataGrid
          columns={[
            { field: 'col0', width: 100, colSpan: (value) => (value === '1-0' ? 3 : 1) },
            { field: 'col1', width: 100 },
            { field: 'col2', width: 100 },
            { field: 'col3', width: 100 },
            { field: 'col4', width: 100 },
            { field: 'col5', width: 100 },
          ]}
          rows={[
            { id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3', col4: '0-4', col5: '0-5' },
            { id: 1, col0: '1-0', col1: '1-1', col2: '1-2', col3: '1-3', col4: '1-4', col5: '1-5' },
            { id: 2, col0: '2-0', col1: '2-1', col2: '2-2', col3: '2-3', col4: '2-4', col5: '2-5' },
            { id: 3, col0: '3-0', col1: '3-1', col2: '3-2', col3: '3-3', col4: '3-4', col5: '3-5' },
            { id: 4, col0: '4-0', col1: '4-1', col2: '4-2', col3: '4-3', col4: '4-4', col5: '4-5' },
            { id: 5, col0: '5-0', col1: '5-1', col2: '5-2', col3: '5-3', col4: '5-4', col5: '5-5' },
            { id: 6, col0: '6-0', col1: '6-1', col2: '6-2', col3: '6-3', col4: '6-4', col5: '6-5' },
          ]}
          columnBufferPx={100}
          rowBufferPx={50}
          rowHeight={rowHeight}
        />
      </div>,
    );

    expect(getCell(2, 4).offsetLeft).to.equal(
      getCell(1, 4).offsetLeft,
      'last cells in both rows should be aligned',
    );

    expect(getColumnHeaderCell(4).offsetLeft).to.equal(
      getCell(1, 4).offsetLeft,
      'last cell and column header cell should be aligned',
    );

    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    // scroll to the very end
    virtualScroller.scrollLeft = 1000;
    // hide first row to trigger row virtualization
    virtualScroller.scrollTop = rowHeight + 10;
    virtualScroller.dispatchEvent(new Event('scroll'));
    clock.runToLast();

    expect(getCell(2, 5).offsetLeft).to.equal(
      getCell(1, 5).offsetLeft,
      'last cells in both rows should be aligned after scroll',
    );

    expect(getColumnHeaderCell(5).offsetLeft).to.equal(
      getCell(1, 5).offsetLeft,
      'last cell and column header cell should be aligned after scroll',
    );
  });

  it('should work with pagination and column virtualization', function test() {
    if (isJSDOM) {
      // Need layouting for column virtualization
      this.skip();
    }

    const rowHeight = 50;

    function TestCase() {
      return (
        <div style={{ width: 390, height: 300 }}>
          <DataGrid
            pageSizeOptions={[3]}
            initialState={{ pagination: { paginationModel: { pageSize: 3 } } }}
            columns={[
              { field: 'col0', width: 100, colSpan: (value) => (value === '4-0' ? 3 : 1) },
              { field: 'col1', width: 100 },
              { field: 'col2', width: 100 },
              { field: 'col3', width: 100 },
              { field: 'col4', width: 100 },
              { field: 'col5', width: 100 },
            ]}
            rows={[
              {
                id: 0,
                col0: '0-0',
                col1: '0-1',
                col2: '0-2',
                col3: '0-3',
                col4: '0-4',
                col5: '0-5',
              },
              {
                id: 1,
                col0: '1-0',
                col1: '1-1',
                col2: '1-2',
                col3: '1-3',
                col4: '1-4',
                col5: '1-5',
              },
              {
                id: 2,
                col0: '2-0',
                col1: '2-1',
                col2: '2-2',
                col3: '2-3',
                col4: '2-4',
                col5: '2-5',
              },
              {
                id: 3,
                col0: '3-0',
                col1: '3-1',
                col2: '3-2',
                col3: '3-3',
                col4: '3-4',
                col5: '3-5',
              },
              {
                id: 4,
                col0: '4-0',
                col1: '4-1',
                col2: '4-2',
                col3: '4-3',
                col4: '4-4',
                col5: '4-5',
              },
              {
                id: 5,
                col0: '5-0',
                col1: '5-1',
                col2: '5-2',
                col3: '5-3',
                col4: '5-4',
                col5: '5-5',
              },
            ]}
            columnBufferPx={100}
            rowBufferPx={50}
            rowHeight={rowHeight}
          />
        </div>
      );
    }

    render(<TestCase />);

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    expect(getCell(5, 4).offsetLeft).to.equal(
      getCell(4, 4).offsetLeft,
      'last cells in both rows should be aligned',
    );

    expect(getColumnHeaderCell(4).offsetLeft).to.equal(
      getCell(4, 4).offsetLeft,
      'last cell and column header cell should be aligned',
    );

    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    // scroll to the very end
    virtualScroller.scrollLeft = 1000;
    // hide first row to trigger row virtualization
    virtualScroller.scrollTop = rowHeight + 10;
    virtualScroller.dispatchEvent(new Event('scroll'));

    expect(getCell(5, 5).offsetLeft).to.equal(
      getCell(4, 5).offsetLeft,
      'last cells in both rows should be aligned after scroll',
    );

    expect(getColumnHeaderCell(5).offsetLeft).to.equal(
      getCell(4, 5).offsetLeft,
      'last cell and column header cell should be aligned after scroll',
    );
  });
});
