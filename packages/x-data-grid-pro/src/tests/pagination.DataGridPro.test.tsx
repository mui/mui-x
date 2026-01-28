import { createRenderer, act, waitFor } from '@mui/internal-test-utils';
import { getColumnValues } from 'test/utils/helperFn';
import { RefObject } from '@mui/x-internals/types';
import { DataGridPro, GridApi, useGridApiRef } from '@mui/x-data-grid-pro';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { GridApiPro } from '../models/gridApiPro';

describe('<DataGridPro /> - Pagination', () => {
  const { render } = createRenderer();

  describe('setPage', () => {
    it('should apply valid value', () => {
      let apiRef: RefObject<GridApi | null>;

      function GridTest() {
        const basicData = useBasicDemoData(20, 2);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...basicData}
              apiRef={apiRef}
              pagination
              initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
              pageSizeOptions={[1]}
            />
          </div>
        );
      }

      render(<GridTest />);

      expect(getColumnValues(0)).to.deep.equal(['0']);
      act(() => {
        apiRef.current?.setPage(1);
      });
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should apply last page if trying to go to a non-existing page', () => {
      let apiRef: RefObject<GridApi | null>;
      function GridTest() {
        const basicData = useBasicDemoData(20, 2);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...basicData}
              apiRef={apiRef}
              pagination
              initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
              pageSizeOptions={[1]}
            />
          </div>
        );
      }

      render(<GridTest />);

      expect(getColumnValues(0)).to.deep.equal(['0']);
      act(() => {
        apiRef.current?.setPage(50);
      });
      expect(getColumnValues(0)).to.deep.equal(['19']);
    });
  });

  describe('setPageSize', () => {
    it('should apply value', () => {
      let apiRef: RefObject<GridApiPro | null>;
      function GridTest() {
        const basicData = useBasicDemoData(20, 2);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...basicData}
              apiRef={apiRef}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
              pageSizeOptions={[2, 5]}
              pagination
              disableVirtualization
            />
          </div>
        );
      }

      render(<GridTest />);

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
      act(() => {
        apiRef.current?.setPageSize(2);
      });

      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });
  });

  it('should log an error if rowCount is used with client-side pagination', () => {
    expect(() => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro rows={[]} columns={[]} paginationMode="client" rowCount={100} />
        </div>,
      );
    }).toErrorDev([
      'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect. `rowCount` is only meant to be used with `paginationMode="server"`.',
    ]);
  });

  // Test for https://github.com/mui/mui-x/issues/19281
  it('should sync pagination prop with state properly', async () => {
    const columns = [{ field: 'name' }];
    const rows = [
      { id: 1, name: 'Row 1' },
      { id: 2, name: 'Row 2' },
      { id: 3, name: 'Row 3' },
      { id: 4, name: 'Row 4' },
      { id: 5, name: 'Row 5' },
      { id: 6, name: 'Row 6' },
      { id: 7, name: 'Row 7' },
      { id: 8, name: 'Row 8' },
      { id: 9, name: 'Row 9' },
      { id: 10, name: 'Row 10' },
      { id: 11, name: 'Row 11' },
    ];
    function TestComponent({ pagination = false }: { pagination?: boolean }) {
      return (
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro
            columns={columns}
            rows={rows}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10]}
            pagination={pagination}
            disableVirtualization
          />
        </div>
      );
    }

    const { setProps } = render(<TestComponent />);
    expect(getColumnValues(0)).to.have.length(11);
    setProps({ pagination: true });

    await waitFor(() => {
      const visibleValues = getColumnValues(0);
      expect(visibleValues).to.have.length(5);
    });
  });
});
