import * as React from 'react';
import { spy } from 'sinon';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';

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

  describe('prop: showCellRightBorder', () => {
    function expectRightBorder(element: HTMLElement) {
      expect(element).to.have.class(gridClasses.withBorder);

      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.getPropertyValue('border-right-color');
      const width = computedStyle.getPropertyValue('border-right-width');

      expect(width).to.equal('1px');
      // should not be transparent
      expect(color).to.not.equal('rgba(0, 0, 0, 0)');
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
            showCellRightBorder
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
            showCellRightBorder
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

  it('should call the valueFormatter with the correct params', () => {
    const valueFormatter = spy(({ value }) => (value ? 'Yes' : 'No'));
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
    expect(valueFormatter.lastCall.args[0]).to.have.keys('id', 'field', 'value', 'api');
    expect(valueFormatter.lastCall.args[0].id).to.equal(0);
    expect(valueFormatter.lastCall.args[0].field).to.equal('isActive');
    expect(valueFormatter.lastCall.args[0].value).to.equal(true);
  });

  it('should throw when focusing cell without updating the state', function test() {
    // In Firefox, onFocus is not called when calling `cell.focus()`
    if (/firefox/i.test(window.navigator.userAgent)) {
      this.skip();
    }

    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          columns={[{ field: 'brand', cellClassName: 'foobar' }]}
          experimentalFeatures={{ warnIfFocusStateIsNotSynced: true }}
        />
      </div>,
    );

    fireEvent.mouseUp(getCell(0, 0));
    fireEvent.click(getCell(0, 0));

    expect(() => {
      getCell(1, 0).focus();
    }).toWarnDev(['MUI: The cell with id=1 and field=brand received focus.']);
  });
});
