import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, act, waitFor } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid, useGridApiRef, GridApi, DataGridProps } from '@mui/x-data-grid';
import { getBasicGridData } from '@mui/x-data-grid-generator/services';
import { spy } from 'sinon';

describe('<DataGrid /> - Events Params', () => {
  const { render } = createRenderer();
  describe('gridReady', () => {
    interface TestGridProps extends Partial<DataGridProps> {
      onGridReady: () => void;
    }

    let apiRef: React.MutableRefObject<GridApi>;

    function TestGrid(props: TestGridProps) {
      apiRef = useGridApiRef();
      React.useEffect(() => {
        return apiRef.current.subscribeEvent('gridReady', () => {
          props.onGridReady();
        });
      }, [props, props.onGridReady]);
      return (
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...props}
            apiRef={apiRef}
            rows={props.rows ?? []}
            columns={props.columns ?? []}
          />
        </div>
      );
    }
    it('gridReady should only be fired once.', async () => {
      const gridReady = spy();
      const { rows, columns } = getBasicGridData(5, 2);

      render(
        <TestGrid
          onGridReady={() => {
            gridReady();
          }}
          rows={rows}
          columns={columns}
        />,
      );
      await waitFor(() => expect(gridReady.callCount).to.equal(1));
    });

    it('gridReady should not be fired if there is no data.', async () => {
      const gridReady = spy();
      render(
        <TestGrid
          onGridReady={() => {
            gridReady();
          }}
        />,
      );

      await waitFor(() => expect(gridReady.callCount).to.equal(0));
    });

    it('gridReady should be triggered after all states are initialized. so that user can start interacting with the gird after the event is published', async () => {
      const gridReady = spy();
      const rowLength = 5;
      const { rows, columns } = getBasicGridData(rowLength, 4);
      const focusedRow = rows[4].id;
      const focusedColumnsField = columns[3].field;

      render(
        <TestGrid
          onGridReady={() => {
            gridReady(apiRef.current.getRowModels().size);
            // user should be able to interact with the grid the `gridReady` event is triggered.
            act(() => apiRef.current.setCellFocus(focusedRow, focusedColumnsField));
          }}
          rows={rows}
          columns={columns}
        />,
      );

      await waitFor(() => expect(gridReady.callCount).to.equal(1));

      // Checking if the user can successfully interact with the grid after gridReady called.
      expect(apiRef.current.state.focus.cell).to.not.equal(null);
      expect(gridReady.args[0][0]).to.equal(rowLength);
    });

    it('gridReady should work with virtualization enabled.', async () => {
      const gridReady = spy();
      const { rows, columns } = getBasicGridData(20, 4);
      render(
        <TestGrid
          onGridReady={() => {
            gridReady();
          }}
          rows={rows}
          columns={columns}
        />,
      );

      await waitFor(() => expect(gridReady.callCount).to.equal(1));
    });

    it('gridReady should not be called every time a state updates.', async () => {
      const gridReady = spy();
      const { rows, columns } = getBasicGridData(20, 4);

      render(
        <TestGrid
          onGridReady={() => {
            gridReady();
          }}
          rows={rows}
          columns={columns}
        />,
      );

      await waitFor(() => {
        expect(gridReady.callCount).to.equal(1);
      });
      act(() => apiRef.current.setState({ ...apiRef.current.state }));
      expect(gridReady.callCount).to.equal(1);
    });

    it('gridReady should work with a predefined initial state.', async () => {
      const gridReady = spy();
      const { rows, columns } = getBasicGridData(20, 4);
      render(
        <TestGrid
          onGridReady={() => {
            gridReady(apiRef.current.getRowModels().size);
          }}
          rows={rows}
          columns={columns}
          initialState={{
            columns: {
              columnVisibilityModel: {
                [columns[0].field]: false,
              },
            },
          }}
        />,
      );

      await waitFor(() => act(() => expect(gridReady.callCount).to.equal(1)));
      expect(apiRef.current.getVisibleColumns().length).to.lessThan(columns.length);
    });
  });
});
