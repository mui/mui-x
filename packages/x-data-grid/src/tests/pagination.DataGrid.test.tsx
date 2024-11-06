import * as React from 'react';
import { spy, stub, SinonStub, SinonSpy } from 'sinon';
import { expect } from 'chai';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import {
  DataGrid,
  DataGridProps,
  gridClasses,
  GridLogicOperator,
  GridRowsProp,
  GridApi,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useBasicDemoData } from '@mui/x-data-grid-generator';
import { getCell, getColumnValues, getRows } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Pagination', () => {
  const { render } = createRenderer();

  function BaselineTestCase(props: Omit<DataGridProps, 'rows' | 'columns'> & { height?: number }) {
    const { height = 300, ...other } = props;

    const basicData = useBasicDemoData(20, 2);

    return (
      <div style={{ width: 300, height }}>
        <DataGrid {...basicData} autoHeight={isJSDOM} {...other} />
      </div>
    );
  }

  describe('prop: paginationModel and onPaginationModelChange', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    it('should display the rows of page given in props', () => {
      render(<BaselineTestCase paginationModel={{ page: 1, pageSize: 1 }} pageSizeOptions={[1]} />);
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should not call onPaginationModelChange on initialisation', () => {
      const onPaginationModelChange = spy();

      render(
        <BaselineTestCase
          paginationModel={{ page: 0, pageSize: 1 }}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[1]}
        />,
      );

      expect(onPaginationModelChange.callCount).to.equal(0);
    });

    it('should allow to update the paginationModel from the outside', () => {
      const { setProps } = render(
        <BaselineTestCase paginationModel={{ page: 0, pageSize: 1 }} pageSizeOptions={[1]} />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0']);
      setProps({ paginationModel: { page: 1, pageSize: 1 } });
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should not apply new page when clicking on next / previous button and onPaginationModelChange is not defined and paginationModel is controlled', () => {
      render(<BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1]} />);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['0']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should call onPaginationModelChange and apply new page when clicking on next / previous button', () => {
      const onPaginationModelChange = spy();

      render(
        <BaselineTestCase
          onPaginationModelChange={onPaginationModelChange}
          initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
          pageSizeOptions={[1]}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPaginationModelChange.callCount).to.equal(1);
      expect(onPaginationModelChange.lastCall.args[0].page).to.equal(1);
      expect(getColumnValues(0)).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPaginationModelChange.callCount).to.equal(2);
      expect(onPaginationModelChange.lastCall.args[0].page).to.equal(0);
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should apply the new pageSize when clicking on a page size option and onPaginationModelChange is not defined and paginationModel is not controlled', () => {
      render(<BaselineTestCase pageSizeOptions={[1, 2, 3, 100]} />);
      fireEvent.mouseDown(screen.getByLabelText('Rows per page:'));
      expect(screen.queryAllByRole('option').length).to.equal(4);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });

    it('should call onPaginationModelChange and apply the new pageSize when clicking on a page size option and paginationModel is not controlled', () => {
      const onPaginationModelChange = spy();

      render(
        <BaselineTestCase
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[1, 2, 3, 100]}
        />,
      );
      fireEvent.mouseDown(screen.getByLabelText('Rows per page:'));
      expect(screen.queryAllByRole('option').length).to.equal(4);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(onPaginationModelChange.callCount).to.equal(1);
      expect(onPaginationModelChange.lastCall.args[0].pageSize).to.equal(2);
      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });

    it('should call onPaginationModelChange with the correct paginationModel when clicking on next / previous button when paginationModel is controlled', () => {
      const onPaginationModelChange = spy();

      function TestCase({
        handlePaginationModelChange,
      }: {
        handlePaginationModelChange: SinonSpy;
      }) {
        const [paginationModel, setPaginationModel] = React.useState({ pageSize: 1, page: 0 });
        return (
          <BaselineTestCase
            onPaginationModelChange={(newModel) => {
              handlePaginationModelChange(newModel);
              setPaginationModel(newModel);
            }}
            paginationModel={paginationModel}
            pageSizeOptions={[1]}
          />
        );
      }

      render(<TestCase handlePaginationModelChange={onPaginationModelChange} />);

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 1, pageSize: 1 });
      expect(getColumnValues(0)).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 0, pageSize: 1 });
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should call onPaginationModelChange when clicking on next / previous button in "server" mode', () => {
      const onPaginationModelChange = spy();

      render(
        <BaselineTestCase
          onPaginationModelChange={onPaginationModelChange}
          initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
          pageSizeOptions={[1]}
          paginationMode="server"
          rowCount={4}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPaginationModelChange.callCount).to.equal(1);
      expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 1, pageSize: 1 });
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 0, pageSize: 1 });
    });

    it('should not change the state when clicking on next button and a `paginationModel` prop is provided', () => {
      render(<BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1]} />);
      expect(getColumnValues(0)).to.deep.equal(['0']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should control `paginationModel` state when the prop and the onChange are set', () => {
      function ControlCase() {
        const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 1 });

        return (
          <BaselineTestCase
            paginationModel={paginationModel}
            onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
            pageSizeOptions={[1]}
          />
        );
      }

      render(<ControlCase />);

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['1']);

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should go to last page when paginationModel is controlled and the current page is greater than the last page', () => {
      const onPaginationModelChange = spy();
      function TestCasePaginationFilteredData(props: Partial<DataGridProps>) {
        const [paginationModel, setPaginationModel] = React.useState({ page: 1, pageSize: 5 });

        const handlePaginationModelChange: DataGridProps['onPaginationModelChange'] = (
          newPaginationModel,
        ) => {
          onPaginationModelChange(newPaginationModel);
          setPaginationModel(newPaginationModel);
        };

        return (
          <BaselineTestCase
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[5]}
            {...props}
          />
        );
      }
      const { setProps } = render(<TestCasePaginationFilteredData />);
      expect(onPaginationModelChange.callCount).to.equal(0);

      setProps({
        filterModel: {
          logicOperator: GridLogicOperator.And,
          items: [
            {
              field: 'id',
              operator: '<=',
              value: '3',
            },
          ],
        },
      });

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3']);
      expect(onPaginationModelChange.callCount).to.equal(1);
      expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ page: 0, pageSize: 5 });
    });

    it('should scroll to the top of the page when changing page', () => {
      const { setProps } = render(
        <BaselineTestCase paginationModel={{ page: 0, pageSize: 5 }} pageSizeOptions={[5]} />,
      );
      const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
      virtualScroller.scrollTop = 100;
      setProps({ paginationModel: { page: 1, pageSize: 5 } });
      expect(virtualScroller.scrollTop).to.equal(0);
    });

    it('should display the amount of rows given in props', () => {
      render(<BaselineTestCase paginationModel={{ page: 0, pageSize: 2 }} pageSizeOptions={[2]} />);
      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });

    it('should throw if pageSize exceeds 100', () => {
      let apiRef: React.MutableRefObject<GridApi>;
      function TestCase() {
        apiRef = useGridApiRef();
        return (
          <BaselineTestCase
            apiRef={apiRef}
            paginationModel={{ pageSize: 1, page: 0 }}
            pageSizeOptions={[1, 2, 101]}
          />
        );
      }
      render(<TestCase />);
      expect(() => apiRef.current.setPageSize(101)).to.throw(
        /`pageSize` cannot exceed 100 in the MIT version of the DataGrid./,
      );
    });

    it('should call onPaginationModelChange with the correct page when clicking on a page size option when paginationModel is controlled', () => {
      const onPaginationModelChange = spy();

      render(
        <BaselineTestCase
          onPaginationModelChange={onPaginationModelChange}
          paginationModel={{ pageSize: 1, page: 0 }}
          pageSizeOptions={[1, 2, 3]}
        />,
      );

      fireEvent.mouseDown(screen.getByLabelText('Rows per page:'));
      expect(screen.queryAllByRole('option').length).to.equal(3);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(onPaginationModelChange.callCount).to.equal(1);
      expect(onPaginationModelChange.lastCall.args[0]).to.deep.equal({ pageSize: 2, page: 0 });
    });

    it('should not change the pageSize state when clicking on a page size option when paginationModel prop is provided', () => {
      render(
        <BaselineTestCase paginationModel={{ pageSize: 1, page: 0 }} pageSizeOptions={[1, 2, 3]} />,
      );

      fireEvent.mouseDown(screen.getByLabelText('Rows per page:'));
      expect(screen.queryAllByRole('option').length).to.equal(3);

      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(getColumnValues(0)).to.deep.equal(['0']);
    });

    it('should display a warning if the prop pageSize is not in the prop pageSizeOptions', () => {
      const pageSize = 12;

      expect(() => {
        render(
          <BaselineTestCase
            paginationModel={{ pageSize, page: 0 }}
            pageSizeOptions={[25, 50, 100]}
          />,
        );
      }).toWarnDev([
        `MUI X: The page size \`${pageSize}\` is not present in the \`pageSizeOptions\``,
        `MUI X: The page size \`${pageSize}\` is not present in the \`pageSizeOptions\``,
      ]);
    });

    it('should not display a warning if the prop pageSize is in the prop pageSizeOptions when it is an array of objects.', () => {
      const pageSize = 10;

      expect(() => {
        render(
          <BaselineTestCase
            paginationModel={{ pageSize, page: 0 }}
            pageSizeOptions={[
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '30', value: 30 },
            ]}
          />,
        );
      }).not.toWarnDev();
    });

    it('should display a warning if the prop pageSize is not in the default pageSizeOptions', () => {
      const pageSize = 12;

      expect(() => {
        render(<BaselineTestCase paginationModel={{ pageSize, page: 0 }} />);
      }).toWarnDev([
        `MUI X: The page size \`${pageSize}\` is not present in the \`pageSizeOptions\``,
        `MUI X: The page size \`${pageSize}\` is not present in the \`pageSizeOptions\``,
      ]);
    });

    it('should display a warning if the default pageSize given as props is not in the prop pageSizeOptions', () => {
      expect(() => {
        render(<BaselineTestCase pageSizeOptions={[25, 50]} />);
      }).toWarnDev([
        `MUI X: The page size \`100\` is not present in the \`pageSizeOptions\``,
        `MUI X: The page size \`100\` is not present in the \`pageSizeOptions\``,
      ]);
    });

    it('should update the pageCount state when updating the paginationModel prop with a lower pageSize value', () => {
      function TestCase(props: Partial<DataGridProps>) {
        const [paginationModel, setPaginationModel] = React.useState({ pageSize: 20, page: 0 });

        return (
          <BaselineTestCase
            pageSizeOptions={[10, 20]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableVirtualization
            {...props}
          />
        );
      }

      const { setProps } = render(<TestCase />);
      expect(getColumnValues(0)).to.have.length(20);
      setProps({ paginationModel: { pageSize: 10, page: 0 } });
      expect(getColumnValues(0)).to.have.length(10);
      expect(getCell(0, 0)).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.have.length(10);
    });
  });

  describe('prop: autoPageSize', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    function TestCaseAutoPageSize(
      props: Omit<DataGridProps, 'rows' | 'columns'> & { height: number; nbRows: number },
    ) {
      const { height, nbRows, ...other } = props;

      const data = useBasicDemoData(nbRows, 10);

      return (
        <div style={{ width: 300, height: props.height }}>
          <DataGrid columns={data.columns} rows={data.rows} autoPageSize {...other} />
        </div>
      );
    }

    it('should give priority to the controlled paginationModel', () => {
      render(
        <BaselineTestCase
          autoPageSize
          paginationModel={{ pageSize: 3, page: 2 }}
          pageSizeOptions={[3]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['6', '7', '8']);
    });

    it('should always render the same amount of rows and fit the viewport', () => {
      const nbRows = 27;
      const height = 780;
      const columnHeaderHeight = 56;
      const rowHeight = 52;

      render(
        <TestCaseAutoPageSize
          nbRows={nbRows}
          height={height}
          columnHeaderHeight={columnHeaderHeight}
          rowHeight={rowHeight}
        />,
      );

      const footerHeight = document.querySelector('.MuiDataGrid-footerContainer')!.clientHeight;
      const expectedFullPageRowsLength = Math.floor(
        (height - columnHeaderHeight - footerHeight) / rowHeight,
      );

      let rows = getRows();
      expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows));

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      rows = getRows();
      expect(rows.length).to.equal(
        Math.min(expectedFullPageRowsLength, nbRows - expectedFullPageRowsLength),
      );

      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      rows = getRows();
      expect(rows.length).to.equal(Math.min(expectedFullPageRowsLength, nbRows));

      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      rows = getRows();

      expect(rows.length).to.equal(
        Math.min(expectedFullPageRowsLength, nbRows - 2 * expectedFullPageRowsLength),
      );

      // make sure there is no more pages.
      const nextPageBtn = document.querySelector('.MuiTablePagination-actions button:last-child');
      expect(nextPageBtn!).not.to.have.attribute('disabled', 'false'); // next page should be disabled
    });

    it('should update the amount of rows rendered and call onPageSizeChange when changing the table height', async () => {
      // Using a fake clock also affects `requestAnimationFrame`
      // Calling clock.tick() should call the callback passed, but it doesn't work
      stub(window, 'requestAnimationFrame').callsFake((fn: any) => fn());
      stub(window, 'cancelAnimationFrame');

      const onPaginationModelChange = spy();

      const nbRows = 27;

      const heightBefore = 780;
      const heightAfter = 360;
      const columnHeaderHeight = 56;
      const rowHeight = 52;

      const { setProps } = render(
        <TestCaseAutoPageSize
          nbRows={nbRows}
          height={heightBefore}
          columnHeaderHeight={columnHeaderHeight}
          rowHeight={rowHeight}
          onPaginationModelChange={onPaginationModelChange}
        />,
      );

      const footerHeight = document.querySelector('.MuiDataGrid-footerContainer')!.clientHeight;
      const expectedViewportRowsLengthBefore = Math.floor(
        (heightBefore - columnHeaderHeight - footerHeight) / rowHeight,
      );
      const expectedViewportRowsLengthAfter = Math.floor(
        (heightAfter - columnHeaderHeight - footerHeight) / rowHeight,
      );

      let rows = document.querySelectorAll('.MuiDataGrid-virtualScrollerRenderZone [role="row"]');
      expect(rows.length).to.equal(expectedViewportRowsLengthBefore);

      setProps({ height: heightAfter });

      await waitFor(() => {
        expect(document.querySelector('.MuiTablePagination-displayedRows')!.innerHTML).to.equal(
          `1–${expectedViewportRowsLengthAfter} of ${nbRows}`, // "–" is not a hyphen, it's an "en dash"
        );
      });

      rows = document.querySelectorAll('.MuiDataGrid-virtualScrollerRenderZone [role="row"]');
      expect(rows.length).to.equal(expectedViewportRowsLengthAfter);

      expect(onPaginationModelChange.lastCall.args[0].pageSize).to.equal(
        expectedViewportRowsLengthAfter,
      );

      (window.requestAnimationFrame as SinonStub).restore();
      (window.cancelAnimationFrame as SinonStub).restore();
    });
  });

  it('should react to an update of rowCount when `paginationMode = server`', () => {
    const { setProps } = render(
      <BaselineTestCase
        rowCount={5}
        paginationModel={{ page: 0, pageSize: 1 }}
        pageSizeOptions={[1]}
        paginationMode="server"
      />,
    );
    expect(document.querySelector('.MuiTablePagination-root')).to.have.text('1–1 of 5'); // "–" is not a hyphen, it's an "en dash"
    setProps({ rowCount: 21 });
    expect(document.querySelector('.MuiTablePagination-root')).to.have.text('1–1 of 21');
  });

  describe('server-side pagination', () => {
    function ServerPaginationGrid(props: Partial<DataGridProps>) {
      const [rows, setRows] = React.useState<GridRowsProp>([]);
      const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 1 });

      const handlePaginationModelChange: DataGridProps['onPaginationModelChange'] = (
        newPaginationModel,
      ) => {
        setPaginationModel(newPaginationModel);
      };

      React.useEffect(() => {
        let active = true;

        (async () => {
          const newRows = [
            {
              id: paginationModel.page,
            },
          ];

          if (!active) {
            return;
          }

          setRows(newRows);
        })();

        return () => {
          active = false;
        };
      }, [paginationModel.page]);

      return (
        <div style={{ height: 300, width: 300 }}>
          <DataGrid
            columns={[{ field: 'id' }]}
            rows={rows}
            paginationMeta={{ hasNextPage: props.rowCount === -1 }}
            paginationModel={paginationModel}
            pageSizeOptions={[1]}
            paginationMode="server"
            onPaginationModelChange={handlePaginationModelChange}
            {...props}
          />
        </div>
      );
    }

    it('should support server side pagination with known row count', () => {
      render(<ServerPaginationGrid rowCount={3} />);
      expect(getColumnValues(0)).to.deep.equal(['0']);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['1']);
    });

    it('should support server side pagination with unknown row count', () => {
      const { setProps } = render(<ServerPaginationGrid rowCount={-1} />);
      expect(getColumnValues(0)).to.deep.equal(['0']);
      expect(screen.getByText('1–1 of more than 1')).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(screen.getByText('2–2 of more than 2')).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      setProps({ rowCount: 3 });
      expect(getColumnValues(0)).to.deep.equal(['2']);
      expect(screen.getByText('3–3 of 3')).not.to.equal(null);
    });

    it('should support server side pagination with estimated row count', () => {
      const { setProps } = render(<ServerPaginationGrid rowCount={-1} estimatedRowCount={2} />);
      expect(getColumnValues(0)).to.deep.equal(['0']);
      expect(screen.getByText('1–1 of more than 2')).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['1']);
      expect(screen.getByText('2–2 of more than 2')).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getColumnValues(0)).to.deep.equal(['2']);
      expect(screen.getByText('3–3 of more than 3')).not.to.equal(null);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      setProps({ rowCount: 4 });
      expect(getColumnValues(0)).to.deep.equal(['3']);
      expect(screen.getByText('4–4 of 4')).not.to.equal(null);
    });
  });

  it('should make the first cell focusable after changing the page', () => {
    render(
      <BaselineTestCase
        initialState={{ pagination: { paginationModel: { pageSize: 1 } } }}
        pageSizeOptions={[1]}
      />,
    );
    fireUserEvent.mousePress(getCell(0, 0));
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(getCell(1, 0)).to.have.attr('tabindex', '0');
  });

  describe('prop: initialState.pagination', () => {
    before(function beforeHook() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }
    });

    it('should allow to initialize the paginationModel', () => {
      render(
        <BaselineTestCase
          initialState={{
            pagination: {
              paginationModel: { pageSize: 2, page: 0 },
            },
          }}
          pageSizeOptions={[2, 5]}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });

    it('should use the paginationModel control state upon the initialize state when both are defined', () => {
      render(
        <BaselineTestCase
          paginationModel={{ pageSize: 5, page: 0 }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 2, page: 0 },
            },
          }}
          pageSizeOptions={[2, 5]}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });

    it('should not update the paginationModel when updating the initial state', () => {
      const { setProps } = render(
        <BaselineTestCase
          initialState={{
            pagination: {
              paginationModel: { pageSize: 2, page: 0 },
            },
          }}
          pageSizeOptions={[2, 5]}
        />,
      );

      setProps({
        initialState: {
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        },
      });

      expect(getColumnValues(0)).to.deep.equal(['0', '1']);
    });

    it('should allow to update the paginationModel when initialized with initialState', () => {
      render(
        <BaselineTestCase
          initialState={{
            pagination: {
              paginationModel: { pageSize: 2, page: 0 },
            },
          }}
          pageSizeOptions={[2, 5]}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['0', '1']);

      fireEvent.mouseDown(screen.getByLabelText('Rows per page:'));
      expect(screen.queryAllByRole('option').length).to.equal(2);
      fireEvent.click(screen.queryAllByRole('option')[1]);
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    });
  });

  // See https://github.com/mui/mui-x/issues/11247
  it('should not throw on deleting the last row of a page > 0', () => {
    const columns = [{ field: 'name' }];
    const rows = [
      { id: 0, name: 'a' },
      { id: 1, name: 'b' },
      { id: 2, name: 'c' },
      { id: 3, name: 'd' },
    ];
    expect(() => {
      const { setProps } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            columns={columns}
            rows={rows}
            initialState={{ pagination: { paginationModel: { pageSize: 2, page: 1 } } }}
            pageSizeOptions={[2]}
          />
        </div>,
      );
      setProps({ rows: rows.slice(0, 2) });
    }).not.to.throw();
  });

  it('should log an error if rowCount is used with client-side pagination', () => {
    expect(() => {
      render(<BaselineTestCase paginationMode="client" rowCount={100} />);
    }).toErrorDev(
      [
        'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect.',
        '`rowCount` is only meant to be used with `paginationMode="server"`.',
      ].join('\n'),
    );
  });
});
