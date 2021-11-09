import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer } from '@material-ui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Cells', () => {
  const { render } = createRenderer();

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
});
