import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { DataGrid, DATA_GRID_PROPS_DEFAULT_VALUES } from '@mui/x-data-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid />', () => {
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

  it('should accept aria & data attributes props', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          {...baselineProps}
          columns={[{ field: 'brand' }]}
          data-custom-id="grid-1"
          aria-label="Grid one"
        />
      </div>,
    );

    const gridElement = document.querySelector<HTMLElement>(`[role="grid"]`);
    expect(gridElement!.getAttribute('data-custom-id')).to.equal('grid-1');
    expect(gridElement!.getAttribute('aria-label')).to.equal('Grid one');
  });

  it('should not fail when row have IDs match Object prototype keys (constructor, hasOwnProperty, etc)', () => {
    const rows = [
      { id: 'a', col1: 'Hello', col2: 'World' },
      { id: 'constructor', col1: 'DataGridPro', col2: 'is Awesome' },
      { id: 'hasOwnProperty', col1: 'MUI', col2: 'is Amazing' },
    ];

    const columns = [
      { field: 'col1', headerName: 'Column 1', width: 150 },
      { field: 'col2', headerName: 'Column 2', width: 150 },
    ];

    render(
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
      </div>,
    );
  });

  it('should not cause unexpected behavior when props are explictly set to undefined', () => {
    const rows = [
      { id: 'a', col1: 'Hello', col2: 'World' },
      { id: 'constructor', col1: 'DataGridPro', col2: 'is Awesome' },
      { id: 'hasOwnProperty', col1: 'MUI', col2: 'is Amazing' },
    ];

    const columns = [
      { field: 'col1', headerName: 'Column 1', width: 150 },
      { field: 'col2', headerName: 'Column 2', width: 150 },
    ];
    expect(() => {
      render(
        <div style={{ height: 300, width: 300 }}>
          <DataGrid
            {...(
              Object.keys(DATA_GRID_PROPS_DEFAULT_VALUES) as Array<
                keyof typeof DATA_GRID_PROPS_DEFAULT_VALUES
              >
            ).reduce((acc, key) => {
              // @ts-ignore
              acc[key] = undefined;
              return acc;
            }, {})}
            rows={rows}
            columns={columns}
          />
        </div>,
      );
    }).not.toErrorDev();
  });
});
