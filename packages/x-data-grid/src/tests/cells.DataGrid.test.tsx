import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGrid, GridValueFormatter } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { getBasicGridData } from '@mui/x-data-grid-generator';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Cells', () => {
  const { render } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
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
  };

  describe('cellClassName', () => {
    it('should append the CSS class defined in cellClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} columns={[{ field: 'brand', cellClassName: 'foobar' }]} />
        </div>,
      );
      expect(getCell(0, 0)).to.have.class('foobar');
    });

    it('should append the CSS class returned by cellClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'brand', cellClassName: () => 'foobar' }]}
          />
        </div>,
      );
      expect(getCell(0, 0)).to.have.class('foobar');
    });
  });

  describe('prop: showCellVerticalBorder', () => {
    function expectRightBorder(element: HTMLElement) {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.getPropertyValue('border-right-color');
      const width = computedStyle.getPropertyValue('border-right-width');

      expect(width).to.equal('1px');
      // should not be transparent
      expect(color).not.to.equal('rgba(0, 0, 0, 0)');
    }

    it('should add right border to cells', function test() {
      if (isJSDOM) {
        // Doesn't work with mocked window.getComputedStyle
        this.skip();
      }

      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand' }]}
            showCellVerticalBorder
          />
        </div>,
      );

      expectRightBorder(getCell(0, 0));
      expectRightBorder(getCell(1, 0));
      expectRightBorder(getCell(2, 0));
    });

    // See https://github.com/mui/mui-x/issues/4122
    it('should add right border to cells in the last row', function test() {
      if (isJSDOM) {
        // Doesn't work with mocked window.getComputedStyle
        this.skip();
      }

      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            autoHeight
            columns={[{ field: 'id' }, { field: 'brand' }]}
            showCellVerticalBorder
          />
        </div>,
      );
      expectRightBorder(getCell(2, 0));
    });
  });

  it('should append the CSS class returned by cellClassName', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          columns={[{ field: 'brand' }]}
          getCellClassName={() => 'foobar'}
        />
      </div>,
    );
    expect(getCell(0, 0)).to.have.class('foobar');
  });

  it('should allow renderCell to return a false-ish value', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          autoHeight={isJSDOM}
          columns={[{ field: 'brand', renderCell: () => 0 }]}
          rows={[{ id: 1, brand: 'Nike' }]}
        />
      </div>,
    );
    expect(getCell(0, 0)).to.have.text('0');
  });

  it('should render nothing in cell when renderCell returns a `null` value', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          autoHeight={isJSDOM}
          columns={[{ field: 'brand', renderCell: () => null }]}
          rows={[{ id: 1, brand: 'Nike' }]}
        />
      </div>,
    );
    expect(getCell(0, 0)).to.have.text('');
  });

  it('should call the valueFormatter with the correct params', () => {
    const valueFormatter = spy<GridValueFormatter<{ id: number; isActive: boolean }>>((value) =>
      value ? 'Yes' : 'No',
    );
    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          columns={[
            {
              field: 'isActive',
              valueFormatter,
              width: 200,
            },
          ]}
          rows={[{ id: 0, isActive: true }]}
        />
      </div>,
    );
    expect(getCell(0, 0)).to.have.text('Yes');
    // expect(valueFormatter.lastCall.args[0]).to.have.keys('id', 'field', 'value', 'api');
    expect(valueFormatter.lastCall.args[0]).to.equal(true);
    expect(valueFormatter.lastCall.args[1]).to.deep.equal({ id: 0, isActive: true });
    expect(valueFormatter.lastCall.args[2].field).to.equal('isActive');
  });

  it('should throw when focusing cell without updating the state', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          columns={[{ field: 'brand', cellClassName: 'foobar' }]}
          experimentalFeatures={{ warnIfFocusStateIsNotSynced: true }}
        />
      </div>,
    );

    fireUserEvent.mousePress(getCell(0, 0));

    expect(() => {
      getCell(1, 0).focus();
    }).toWarnDev(['MUI X: The cell with id=1 and field=brand received focus.']);
  });

  it('should keep the focused cell/row rendered in the DOM if it scrolls outside the viewport', function test() {
    if (isJSDOM) {
      this.skip();
    }
    const rowHeight = 50;
    const defaultData = getBasicGridData(20, 20);

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid columns={defaultData.columns} rows={defaultData.rows} rowHeight={rowHeight} />
      </div>,
    );

    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;

    const cell = getCell(1, 3);
    fireUserEvent.mousePress(cell);

    const activeElementTextContent = document.activeElement?.textContent;
    const columnWidth = document.activeElement!.clientWidth;

    const scrollTop = 10 * rowHeight;
    fireEvent.scroll(virtualScroller, { target: { scrollTop } });
    expect(document.activeElement?.textContent).to.equal(activeElementTextContent);

    const scrollLeft = 10 * columnWidth;
    fireEvent.scroll(virtualScroller, { target: { scrollLeft } });

    expect(document.activeElement?.textContent).to.equal(activeElementTextContent);
  });

  // See https://github.com/mui/mui-x/issues/6378
  it('should not cause scroll jump when focused cell mounts in the render zone', async function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }

    const rowHeight = 50;
    const columns = [{ field: 'id' }];
    const rows = [];
    for (let i = 0; i < 20; i += 1) {
      rows.push({ id: i });
    }

    render(
      <div style={{ width: 300, height: 300 }}>
        <DataGrid columns={columns} rows={rows} rowHeight={rowHeight} />
      </div>,
    );

    const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;

    const thirdRowCell = getCell(2, 0);
    fireUserEvent.mousePress(thirdRowCell);

    let scrollTop = 6 * rowHeight;
    virtualScroller.scrollTop = scrollTop;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(virtualScroller.scrollTop).to.equal(scrollTop);

    scrollTop = 2 * rowHeight;
    virtualScroller.scrollTop = scrollTop;
    virtualScroller.dispatchEvent(new Event('scroll'));
    expect(virtualScroller.scrollTop).to.equal(scrollTop);
  });
});
