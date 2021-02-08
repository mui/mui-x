import * as React from 'react';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, screen, createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import { getCell, getRow } from 'test/utils/helperFn';

describe('<DataGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  describe('prop: checkboxSelection', () => {
    it('should check and uncheck when double clicking the row', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            checkboxSelection
            hideFooter
          />
        </div>,
      );
      const row = getRow(0);
      const checkbox = row!.querySelector('input');
      expect(row).to.not.have.class('Mui-selected');
      expect(checkbox).to.have.property('checked', false);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row!.classList.contains('Mui-selected')).to.equal(true, 'class mui-selected 1');
      expect(checkbox).to.have.property('checked', true);

      fireEvent.click(screen.getByRole('cell', { name: 'Nike' }));
      expect(row!.classList.contains('Mui-selected')).to.equal(false, 'class mui-selected 2');
      expect(checkbox).to.have.property('checked', false);
    });
  });

  describe('props: selectionModel', () => {
    it('should select rows when initialised', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Hugo Boss',
              },
            ]}
            columns={[{ field: 'brand', width: 100 }]}
            selectionModel={[1]}
          />
        </div>,
      );
      const row = getRow(1);
      expect(row).to.have.class('Mui-selected');
    });

    it('should deselect other selected rows', () => {
      const data = {
        rows: [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Hugo Boss',
          },
        ],
        columns: [{ field: 'brand', width: 100 }],
      };
      function Demo(props) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...data} selectionModel={props.selectionModel} />
          </div>
        );
      }

      const { setProps } = render(<Demo />);

      const row1 = getRow(1);
      expect(row1).to.not.have.class('Mui-selected');

      fireEvent.click(getCell(0, 0));
      const row0 = getRow(0);
      expect(row0).to.have.class('Mui-selected');

      setProps({ selectionModel: [1] });
      // TODO fix this assertion. The model is forced from the outside, hence shouldn't change.
      // https://github.com/mui-org/material-ui-x/issues/190
      expect(row0).to.not.have.class('Mui-selected');
      expect(row1).to.have.class('Mui-selected');
    });
  });
});
