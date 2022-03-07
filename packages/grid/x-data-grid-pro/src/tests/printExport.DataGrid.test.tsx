import * as React from 'react';
import {
  DataGridPro,
  GridToolbar,
  GridApi,
  useGridApiRef,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, screen, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import { getData } from 'storybook/src/data/data-service';

describe('<DataGridPro /> - Print export', () => {
  const { render } = createRenderer();

  const NB_ROWS = 2;
  const defaultData = getData(NB_ROWS, 2);
  let apiRef: React.MutableRefObject<GridApi>;

  const baselineProps = {
    ...defaultData,
    // A hack to remove the warning on print
    rowsPerPageOptions: [NB_ROWS, 100],
  };

  const Test = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  const allBooleanConfigurations = [
    {
      printVisible: true,
      gridVisible: true,
    },
    {
      printVisible: false,
      gridVisible: true,
    },
    {
      printVisible: true,
      gridVisible: false,
    },
    {
      printVisible: false,
      gridVisible: false,
    },
  ];

  describe('Export toolbar', () => {
    it('should display print button by default', () => {
      render(<Test components={{ Toolbar: GridToolbar }} />);
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);

      expect(screen.queryByRole('menuitem', { name: 'Print' })).not.to.equal(null);
    });

    it('should disable print export when passing `printOptions.disableToolbarButton`', () => {
      render(
        <Test
          components={{ Toolbar: GridToolbar }}
          componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
        />,
      );
      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Print' })).to.equal(null);
    });
  });

  describe('column visibility with initialState', () => {
    allBooleanConfigurations.forEach(({ printVisible, gridVisible }) => {
      it(`should have 'currencyPair' ${printVisible ? "'visible'" : "'hidden'"} in print and ${
        gridVisible ? "'visible'" : "'hidden'"
      } in screen`, async function test() {
        const onColumnVisibilityModelChange = spy();

        render(
          <Test
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  currencyPair: gridVisible,
                  id: false,
                },
              },
            }}
          />,
        );

        expect(onColumnVisibilityModelChange.callCount).to.equal(0);

        await apiRef.current.exportDataAsPrint({
          fields: printVisible ? ['currencyPair', 'id'] : ['id'],
        });

        expect(onColumnVisibilityModelChange.callCount).to.equal(2);
        // verify column visibility has been set
        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
          currencyPair: printVisible,
          id: true,
        });

        // verify column visibility has been restored
        expect(onColumnVisibilityModelChange.secondCall.firstArg).to.deep.equal({
          currencyPair: gridVisible,
          id: false,
        });
      });
    });
  });

  describe('column visibility with colDef.hide', () => {
    allBooleanConfigurations.forEach(({ printVisible, gridVisible }) => {
      it(`should have 'currencyPair' ${printVisible ? "'visible'" : "'hidden'"} in print and ${
        gridVisible ? "'visible'" : "'hidden'"
      } in screen`, async function test() {
        const onColumnVisibilityModelChange = spy();

        render(
          <Test
            onColumnVisibilityModelChange={onColumnVisibilityModelChange}
            columns={[
              { field: 'currencyPair', hide: !gridVisible },
              { field: 'id', hide: true },
            ]}
          />,
        );

        expect(onColumnVisibilityModelChange.callCount).to.equal(0);

        await apiRef.current.exportDataAsPrint({
          fields: printVisible ? ['currencyPair', 'id'] : ['id'],
        });

        expect(onColumnVisibilityModelChange.callCount).to.equal(2);

        // verify column visibility has been set
        expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
          currencyPair: printVisible,
          id: true,
        });

        // verify column visibility has been restored
        expect(onColumnVisibilityModelChange.secondCall.firstArg).to.deep.equal({
          currencyPair: gridVisible,
          id: false,
        });
      });
    });
  });

  describe('columns to print', () => {
    it(`should ignore 'allColumns' if 'fields' is provided`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(<Test onColumnVisibilityModelChange={onColumnVisibilityModelChange} />);

      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      await apiRef.current.exportDataAsPrint({ fields: ['id'], allColumns: true });

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        currencyPair: false,
        id: true,
      });
    });

    it(`should ignore 'disableExport' if 'fields' is provided`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <Test
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          columns={[{ field: 'currencyPair' }, { field: 'id', disableExport: true }]}
        />,
      );

      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      await apiRef.current.exportDataAsPrint({ fields: ['id'], allColumns: true });

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        currencyPair: false,
        id: true,
      });
    });

    it(`should apply 'disableExport' even if 'allColumns' is set`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <Test
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          columns={[{ field: 'currencyPair' }, { field: 'id', disableExport: true }]}
        />,
      );

      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      await apiRef.current.exportDataAsPrint({ allColumns: true });

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        currencyPair: true,
        id: false,
      });
    });

    it(`should print hidden columns if 'allColumns' set to true`, async function test() {
      const onColumnVisibilityModelChange = spy();

      render(
        <Test
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          columns={[{ field: 'currencyPair' }, { field: 'id', hide: true }]}
        />,
      );

      expect(onColumnVisibilityModelChange.callCount).to.equal(0);

      await apiRef.current.exportDataAsPrint({ allColumns: true });

      expect(onColumnVisibilityModelChange.firstCall.firstArg).to.deep.equal({
        currencyPair: true,
        id: true,
      });
    });
  });
});
