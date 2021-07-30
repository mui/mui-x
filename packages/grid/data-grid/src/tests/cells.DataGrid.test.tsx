import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import { getCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Cells', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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

  describe('type `boolean`', () => {
    it('able to render number from provided `renderCell`', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            autoHeight={isJSDOM}
            columns={[
              {
                field: 'number',
                headerName: 'Number',
                type: 'boolean',
                renderCell: (params) => (params.value ? 1 : 0),
              },
            ]}
            rows={[
              {
                id: 1,
                number: false,
              },
              {
                id: 2,
                number: true,
              },
            ]}
          />
        </div>,
      );
      expect(getCell(0, 0)).to.have.text('0');
      expect(getCell(1, 0)).to.have.text('1');
    });

    it('formattedValue to string by default', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            autoHeight={isJSDOM}
            columns={[
              {
                field: 'text',
                headerName: 'Text',
                type: 'boolean',
                renderCell: (params) => params.formattedValue,
              },
            ]}
            rows={[
              {
                id: 1,
                text: false,
              },
              {
                id: 2,
                text: true,
              },
            ]}
          />
        </div>,
      );
      expect(getCell(0, 0)).to.have.text('false');
      expect(getCell(1, 0)).to.have.text('true');
    });
  });
});
