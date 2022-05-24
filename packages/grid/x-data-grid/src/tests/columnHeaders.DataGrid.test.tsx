import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen, within } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid } from '@mui/x-data-grid';
import { getColumnHeaderCell, getColumnHeadersTextContent } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Column Headers', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

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

  describe('headerClassName', () => {
    it('should append the CSS class defined in headerClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} columns={[{ field: 'brand', headerClassName: 'foobar' }]} />
        </div>,
      );
      expect(getColumnHeaderCell(0)).to.have.class('foobar');
    });

    it('should append the CSS class returned by headerClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'brand', headerClassName: () => 'foobar' }]}
          />
        </div>,
      );
      expect(getColumnHeaderCell(0)).to.have.class('foobar');
    });
  });

  describe('GridColumnHeaderMenu', () => {
    it('should allow to hide column', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar' }]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(within(getColumnHeaderCell(0)).getByLabelText('Menu'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Hide' }));
      clock.runToLast();

      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should not allow to hide the only visible column', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar', hide: true }]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      fireEvent.click(within(getColumnHeaderCell(0)).getByLabelText('Menu'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Hide' }));
      clock.runToLast();

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);
    });

    it('should not allow to hide the only visible column that has menu', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[
              { field: 'id', disableColumnMenu: true },
              { field: 'brand', headerClassName: 'foobar' },
            ]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(within(getColumnHeaderCell(1)).getByLabelText('Menu'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Hide' }));
      clock.runToLast();

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
    });
  });
});
