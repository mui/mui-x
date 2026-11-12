import * as React from 'react';
import { act, createRenderer, waitFor, within } from '@mui/internal-test-utils';
import type { RefObject } from '@mui/x-internals/types';
import { DataGridPremium, GRID_ROOT_GROUP_ID, useGridApiRef } from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridDataSource,
  GridGetRowsParams,
  GridDataSourceGroupNode,
  GridGetRowsResponse,
  GridGroupNode,
  GridRowId,
} from '@mui/x-data-grid-premium';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

describe('<DataGridPremium /> - Data source row grouping selection', () => {
  const { render } = createRenderer();
  type TestProps = Partial<DataGridPremiumProps> & { activityMode?: 'visible' | 'hidden' };

  async function renderGroupedGrid(props: TestProps = {}) {
    let apiRef!: RefObject<GridApi | null>;
    const rowsByPath: Record<string, GridGetRowsResponse['rows']> = {
      '': [{ id: 'G', name: 'G', childrenCount: 1 }],
      G: [{ id: 'P', name: 'P', childrenCount: 2 }],
      'G/P': [
        { id: 'L1', name: 'First', childrenCount: 0 },
        { id: 'L2', name: 'Second', childrenCount: 0 },
      ],
    };
    const getRows = vi.fn(async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      const rows = rowsByPath[params.groupKeys!.join('/')];
      return { rows, rowCount: rows.length };
    });
    const dataSource: GridDataSource = {
      getRows,
      getGroupKey: (row) => row.name,
      getChildrenCount: (row) => row.childrenCount,
    };
    const columns = [{ field: 'name' }, { field: 'company' }, { field: 'department' }];
    function Test({ activityMode, ...other }: TestProps) {
      apiRef = useGridApiRef();
      const grid = (
        <div style={{ width: 600, height: 500 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={columns}
            dataSource={dataSource}
            dataSourceCache={null}
            initialState={{ rowGrouping: { model: ['company', 'department'] } }}
            checkboxSelection
            keepNonExistentRowsSelected
            disableVirtualization
            autoHeight={isJSDOM}
            {...other}
          />
        </div>
      );
      return activityMode ? <React.Activity mode={activityMode}>{grid}</React.Activity> : grid;
    }
    const view = render(<Test {...props} />);
    const checkbox = (id: GridRowId) =>
      within(apiRef.current!.getRowElement(id)!).getByRole('checkbox') as HTMLInputElement;
    const toggle = async (id: GridRowId) => {
      await view.user.click(within(apiRef.current!.getRowElement(id)!).getByRole('button'));
    };
    await waitFor(() => expect(apiRef.current!.getRowElement('G')).not.to.equal(null));
    await toggle('G');
    await waitFor(() => expect(apiRef.current!.getRowElement('P')).not.to.equal(null));
    await toggle('P');
    await waitFor(() => expect(apiRef.current!.getRowElement('L2')).not.to.equal(null));
    return { ...view, apiRef, checkbox, toggle, getRows, rowsByPath };
  }

  // https://github.com/mui/mui-x/issues/23868
  it('should keep collapsed groups and their ancestors indeterminate', async () => {
    const { user, apiRef, checkbox, toggle, getRows } = await renderGroupedGrid();
    await user.click(checkbox('L1'));
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
    const selection = apiRef.current!.state.rowSelection;
    const callsBeforeCollapse = getRows.mock.calls.length;

    await toggle('P');
    expect(apiRef.current!.getRow('L1')).to.equal(null);
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
    await toggle('G');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
    expect(apiRef.current!.state.rowSelection).to.deep.equal(selection);
    expect(getRows.mock.calls.length).to.equal(callsBeforeCollapse);

    await toggle('G');
    await waitFor(() => expect(apiRef.current!.getRowElement('P')).not.to.equal(null));
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
    await toggle('P');
    await waitFor(() => expect(apiRef.current!.getRowElement('L2')).not.to.equal(null));
    expect(checkbox('L1').checked).to.equal(true);
    expect(checkbox('L2').checked).to.equal(false);
    expect(apiRef.current!.state.rowSelection).to.deep.equal(selection);
  });

  it('should update collapsed groups when the controlled selection changes', async () => {
    const { setProps, checkbox, toggle } = await renderGroupedGrid({
      rowSelectionModel: { type: 'include', ids: new Set(['L1']) },
    });
    await toggle('P');
    await toggle('G');

    setProps({ rowSelectionModel: { type: 'include', ids: new Set(['L2']) } });
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
    setProps({ rowSelectionModel: { type: 'include', ids: new Set() } });
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'false');
    expect(checkbox('G').checked).to.equal(false);
    setProps({ rowSelectionModel: { type: 'include', ids: new Set(['L1']) } });
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
  });

  it('should preserve retained selection when isRowSelectable gets a new reference', async () => {
    const { user, apiRef, checkbox, toggle, setProps } = await renderGroupedGrid({
      isRowSelectable: () => true,
    });
    await user.click(checkbox('L1'));
    await toggle('P');

    setProps({ isRowSelectable: () => true });

    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
    expect(apiRef.current!.state.rowSelection.ids).to.deep.equal(new Set(['L1']));
  });

  it.skipIf(!('Activity' in React))(
    'should preserve retained selection when Activity becomes visible again',
    async () => {
      const { user, apiRef, checkbox, toggle, setProps, getRows } = await renderGroupedGrid({
        activityMode: 'visible',
      });
      await user.click(checkbox('L1'));
      await toggle('P');
      const callsBeforeHiding = getRows.mock.calls.length;

      await act(async () => setProps({ activityMode: 'hidden' }));
      await act(async () => setProps({ activityMode: 'visible' }));

      expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
      expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
      expect(apiRef.current!.state.rowSelection.ids).to.deep.equal(new Set(['L1']));
      expect(getRows.mock.calls.length).to.equal(callsBeforeHiding);
    },
  );

  it.each([false, true])(
    'should preserve retained selection when a refetch resets expansion (already collapsed: %s)',
    async (alreadyCollapsed) => {
      const { user, apiRef, checkbox, toggle } = await renderGroupedGrid();
      await user.click(checkbox('L1'));
      if (alreadyCollapsed) {
        await toggle('P');
      }

      await act(async () =>
        apiRef.current!.dataSource.fetchRows(undefined, { keepChildrenExpanded: false }),
      );

      expect(apiRef.current!.getRow('P')).to.equal(null);
      expect(apiRef.current!.getRow('L1')).to.equal(null);
      expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
      expect(apiRef.current!.state.rowSelection.ids).to.deep.equal(new Set(['L1']));
    },
  );

  it('should propagate selection changes to known descendants of a collapsed group', async () => {
    const { user, apiRef, checkbox, toggle, getRows } = await renderGroupedGrid();
    await user.click(checkbox('L1'));
    await toggle('G');
    const callsBeforeSelection = getRows.mock.calls.length;

    await user.click(checkbox('G'));
    expect(checkbox('G').checked).to.equal(true);
    expect(apiRef.current!.isRowSelected('L1')).to.equal(true);
    expect(apiRef.current!.isRowSelected('L2')).to.equal(true);
    await user.click(checkbox('G'));
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'false');
    expect(apiRef.current!.state.rowSelection.ids.size).to.equal(0);
    expect(getRows.mock.calls.length).to.equal(callsBeforeSelection);
  });

  it('should not propagate a collapsed group selection when propagation is disabled', async () => {
    const { user, apiRef, checkbox, toggle } = await renderGroupedGrid({
      rowSelectionPropagation: { parents: false, descendants: false },
    });
    await user.click(checkbox('L1'));
    await toggle('P');
    await user.click(checkbox('P'));
    expect(apiRef.current!.isRowSelected('L2')).to.equal(false);
    await user.click(checkbox('P'));
    expect(apiRef.current!.state.rowSelection.ids).to.deep.equal(new Set(['L1']));
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
  });

  it('should discard the child selection on collapse without keepNonExistentRowsSelected', async () => {
    const { user, apiRef, checkbox, toggle } = await renderGroupedGrid({
      keepNonExistentRowsSelected: false,
    });
    await user.click(checkbox('L1'));
    await toggle('P');
    expect(apiRef.current!.state.rowSelection.ids.size).to.equal(0);
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'false');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'false');
  });

  it.each([false, true])(
    'should preserve an exclude model after collapse (excluded child: %s)',
    async (excludeChild) => {
      const { apiRef, checkbox, toggle } = await renderGroupedGrid();
      act(() => apiRef.current!.setRowSelectionModel({ type: 'exclude', ids: new Set() }));
      if (excludeChild) {
        act(() => apiRef.current!.selectRow('L1', false));
      }
      const selection = apiRef.current!.state.rowSelection;

      await toggle('P');
      expect(apiRef.current!.state.rowSelection).to.deep.equal(selection);
      expect(checkbox('P')).to.have.attribute('data-indeterminate', String(excludeChild));
      expect(checkbox('G')).to.have.attribute('data-indeterminate', String(excludeChild));
      await toggle('P');
      await waitFor(() => expect(apiRef.current!.getRowElement('L2')).not.to.equal(null));
      expect(apiRef.current!.state.rowSelection.type).to.equal('exclude');
      expect(checkbox('L1').checked).to.equal(!excludeChild);
      expect(checkbox('L2').checked).to.equal(true);
    },
  );

  it('should not include non-selectable cached rows when selecting a collapsed group', async () => {
    const { user, apiRef, checkbox, toggle } = await renderGroupedGrid({
      isRowSelectable: ({ id }) => id !== 'L2',
    });
    await toggle('G');
    await user.click(checkbox('G'));
    expect(apiRef.current!.isRowSelected('L1')).to.equal(true);
    expect(apiRef.current!.isRowSelected('L2')).to.equal(false);
  });

  it('should stop using descendants missing from the next group response', async () => {
    const { user, apiRef, checkbox, toggle, rowsByPath } = await renderGroupedGrid();
    await user.click(checkbox('L1'));
    await toggle('P');
    rowsByPath['G/P'] = rowsByPath['G/P'].filter((row) => row.id !== 'L1');

    await toggle('P');
    await waitFor(() => expect(apiRef.current!.getRowElement('L2')).not.to.equal(null));
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'false');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'false');
    expect(apiRef.current!.isRowSelected('L1')).to.equal(true);
  });

  it('should preserve partial selection on a root refetch and a failed children request', async () => {
    const onDataSourceError = vi.fn();
    const { user, apiRef, checkbox, toggle, getRows } = await renderGroupedGrid({
      onDataSourceError,
    });
    await user.click(checkbox('L1'));
    await toggle('P');
    await act(async () => apiRef.current!.dataSource.fetchRows());
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');

    getRows.mockRejectedValueOnce(new Error('Failed to load children'));
    await toggle('P');
    await waitFor(() => expect(onDataSourceError).toHaveBeenCalledTimes(1));
    expect(checkbox('P')).to.have.attribute('data-indeterminate', 'true');
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'true');
    expect(apiRef.current!.state.rowSelection.ids).to.deep.equal(new Set(['L1']));
  });

  it.each([
    { rowGroupingModel: ['department', 'company'] },
    { filterModel: { items: [{ field: 'name', operator: 'contains', value: 'Second' }] } },
  ])('should discard cached group membership after query changes: %j', async (newProps) => {
    const { user, apiRef, checkbox, toggle, setProps, getRows } = await renderGroupedGrid();
    await user.click(checkbox('L1'));
    await toggle('P');
    const callsBeforeChange = getRows.mock.calls.length;
    setProps(newProps);

    await waitFor(() => {
      expect(getRows.mock.calls.length).to.be.greaterThan(callsBeforeChange);
      expect(apiRef.current!.getRowElement('G')).not.to.equal(null);
    });
    expect(checkbox('G')).to.have.attribute('data-indeterminate', 'false');
    expect(apiRef.current!.isRowSelected('L1')).to.equal(true);
  });
});

describe('<DataGridPremium /> - Data source row grouping (loading state)', () => {
  const { render } = createRenderer();

  it('should toggle loading state on row grouping model change', async () => {
    let resolveSecond: (response: GridGetRowsResponse) => void = () => {};
    const responses: GridGetRowsResponse[] = [{ rows: [{ id: 'A', group: 'A' }], rowCount: 1 }];
    let callIndex = 0;
    const getRows = vi.fn(() => {
      const index = callIndex;
      callIndex += 1;
      if (index === 0) {
        return Promise.resolve(responses[0]);
      }
      return new Promise<GridGetRowsResponse>((resolve) => {
        resolveSecond = resolve;
      });
    });
    const dataSource: GridDataSource = {
      getRows: getRows as unknown as GridDataSource['getRows'],
      getGroupKey: (row) => row.group,
      getChildrenCount: () => 0,
    };
    let apiRef: RefObject<GridApi | null> = { current: null };
    function Test(props: Partial<DataGridPremiumProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[{ field: 'group' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            disableVirtualization
            rowGroupingModel={['group']}
            {...props}
          />
        </div>
      );
    }

    const { setProps } = render(<Test />);

    await waitFor(() => {
      expect(getRows.mock.calls.length).to.equal(1);
    });
    await waitFor(() => {
      expect(apiRef.current?.state.rows.loading).to.equal(false);
    });

    setProps({ rowGroupingModel: ['group', 'category'] });

    await waitFor(() => {
      expect(getRows.mock.calls.length).to.equal(2);
    });
    expect(apiRef.current?.state.rows.loading).to.equal(true);

    await act(async () => {
      resolveSecond({ rows: [{ id: 'A', group: 'A' }], rowCount: 1 });
    });

    await waitFor(() => {
      expect(apiRef.current?.state.rows.loading).to.equal(false);
    });
  });

  it('should warn when `dataSourceKeepPreviousData` is used with row grouping', async () => {
    const getRows = vi.fn(() => Promise.resolve({ rows: [{ id: 'A', group: 'A' }], rowCount: 1 }));
    const dataSource: GridDataSource = {
      getRows: getRows as unknown as GridDataSource['getRows'],
      getGroupKey: (row) => row.group,
      getChildrenCount: () => 0,
    };
    function Test() {
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            columns={[{ field: 'group' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            dataSourceKeepPreviousData
            disableVirtualization
            rowGroupingModel={['group']}
          />
        </div>
      );
    }

    await expect(async () => {
      render(<Test />);
      await waitFor(() => {
        expect(getRows.mock.calls.length).to.be.greaterThan(0);
      });
    }).toWarnDev(
      [
        'MUI X: The `dataSourceKeepPreviousData` prop only applies to flat data.',
        'It is ignored when tree data or row grouping is enabled, because the rows are always reset on refetch to keep their order consistent with the response.',
        'For more details, see https://mui.com/x/react-data-grid/server-side-data/#keep-previous-data-while-fetching.',
      ].join('\n'),
    );
  });
});

describe.skipIf(isJSDOM)('<DataGridPremium /> - Data source row grouping', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;
  const rowHeight = 50;
  const columnHeaderHeight = 50;
  const gridHeight = 4 * rowHeight + columnHeaderHeight + 2;

  it('should reset the rows after row grouping model change when children are expanded', async () => {
    const getRowsSpy = vi.fn();

    function TestComponent(props: { rowGroupingModel: DataGridPremiumProps['rowGroupingModel'] }) {
      apiRef = useGridApiRef();
      const { rowGroupingModel } = props;

      const dataSource: GridDataSource = React.useMemo(() => {
        const rootRows = [{ id: 'company-A', group: 'A', descendantCount: 1 }];
        const companyChildren = [{ id: 'A-leaf', group: 'Trader 1', descendantCount: 0 }];

        return {
          getRows: async (params: GridGetRowsParams) => {
            getRowsSpy(params);

            if (params.groupKeys!.length === 0) {
              return { rows: rootRows, rowCount: rootRows.length };
            }

            if (params.groupKeys![0] === 'A') {
              return { rows: companyChildren, rowCount: companyChildren.length };
            }

            return { rows: [], rowCount: 0 };
          },
          getGroupKey: (row) => row.group,
          getChildrenCount: (row) => row.descendantCount,
        };
      }, []);

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[{ field: 'company' }, { field: 'trader' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            disableVirtualization
            rowGroupingModel={rowGroupingModel}
          />
        </div>
      );
    }

    const { user, setProps } = render(<TestComponent rowGroupingModel={['company']} />);

    await waitFor(() => {
      const rootChildren = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
        .children;
      expect(rootChildren).to.deep.equal(['company-A']);
    });

    await user.click(within(getCell(0, 0)).getByRole('button'));

    await waitFor(() => {
      expect(apiRef.current!.state.rows.tree['A-leaf']).not.to.equal(undefined);
    });

    setProps({ rowGroupingModel: ['company', 'trader'] });

    await waitFor(() => {
      expect(getRowsSpy.mock.lastCall?.[0].groupFields).to.deep.equal(['company', 'trader']);
    });

    await waitFor(() => {
      const companyGroup = apiRef.current!.state.rows.tree['company-A'] as GridGroupNode;

      expect(apiRef.current!.state.rows.tree['A-leaf']).to.equal(undefined);
      expect(companyGroup.children).to.deep.equal([]);
      expect(companyGroup.childrenExpanded).to.equal(false);
    });
  });

  // https://github.com/mui/mui-x/issues/23009
  it('should keep an updated leaf row under its group', async () => {
    const dataSource: GridDataSource = {
      getRows: async (params: GridGetRowsParams) => {
        if (params.groupKeys!.length === 0) {
          const rootRows = [
            { id: 'company-A', group: 'A', descendantCount: 2 },
            { id: 'company-B', group: 'B', descendantCount: 0 },
          ];
          return { rows: rootRows, rowCount: rootRows.length };
        }
        if (params.groupKeys![0] === 'A') {
          const companyChildren = [
            { id: 'A-1', trader: 'Trader 1', descendantCount: 0 },
            { id: 'A-2', trader: 'Trader 2', descendantCount: 0 },
          ];
          return { rows: companyChildren, rowCount: companyChildren.length };
        }
        return { rows: [], rowCount: 0 };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
    };

    function TestComponent() {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[{ field: 'company' }, { field: 'trader' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            disableVirtualization
            rowGroupingModel={['company']}
          />
        </div>
      );
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(apiRef.current!.state.rows.tree['company-A']).not.to.equal(undefined);
    });

    const getCompanyChildren = () =>
      (apiRef.current!.state.rows.tree['company-A'] as GridGroupNode).children;
    act(() => {
      apiRef.current!.dataSource.fetchRows('company-A');
    });
    await waitFor(() => {
      expect(getCompanyChildren()).to.deep.equal(['A-1', 'A-2']);
    });

    act(() => {
      apiRef.current!.updateRows([{ id: 'A-1', trader: 'Trader 1 (edited)' }]);
    });

    expect(apiRef.current!.state.rows.tree['A-1'].parent).to.equal('company-A');
    expect(getCompanyChildren()).to.deep.equal(['A-1', 'A-2']);
    expect(
      (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children,
    ).to.deep.equal(['company-A', 'company-B']);
  });

  // https://github.com/mui/mui-x/issues/23635
  it('should insert a new leaf row at the position returned by the data source', async () => {
    const companyChildren = [
      { id: 'A-1', trader: 'Trader 1', descendantCount: 0 },
      { id: 'A-3', trader: 'Trader 3', descendantCount: 0 },
    ];
    const dataSource: GridDataSource = {
      getRows: async (params: GridGetRowsParams) => {
        if (params.groupKeys!.length === 0) {
          const rootRows = [{ id: 'company-A', group: 'A', descendantCount: 2 }];
          return { rows: rootRows, rowCount: rootRows.length };
        }
        if (params.groupKeys![0] === 'A') {
          return { rows: companyChildren, rowCount: companyChildren.length };
        }
        return { rows: [], rowCount: 0 };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
    };

    function TestComponent() {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[{ field: 'company' }, { field: 'trader' }]}
            dataSource={dataSource}
            dataSourceCache={null}
            disableVirtualization
            rowGroupingModel={['company']}
          />
        </div>
      );
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(apiRef.current!.state.rows.tree['company-A']).not.to.equal(undefined);
    });

    const getCompanyChildren = () =>
      (apiRef.current!.state.rows.tree['company-A'] as GridGroupNode).children;
    act(() => {
      apiRef.current!.dataSource.fetchRows('company-A');
    });
    await waitFor(() => {
      expect(getCompanyChildren()).to.deep.equal(['A-1', 'A-3']);
    });

    companyChildren.splice(1, 0, { id: 'A-2', trader: 'Trader 2', descendantCount: 0 });
    act(() => {
      apiRef.current!.dataSource.fetchRows('company-A');
    });

    await waitFor(() => {
      expect(getCompanyChildren()).to.deep.equal(['A-1', 'A-2', 'A-3']);
    });
  });

  describe('Nested lazy loading', () => {
    type RowGroupingRow = {
      id: string;
      group: string;
      sector?: string;
      industry?: string;
      company?: string;
      value?: number;
      childrenCount: number;
    };

    const rowsByGroupKeys: Record<string, RowGroupingRow[]> = {
      '[]': [
        { id: 'sector-tech', group: 'Technology', sector: 'Technology', childrenCount: 2 },
        { id: 'sector-finance', group: 'Finance', sector: 'Finance', childrenCount: 1 },
      ],
      '["Technology"]': [
        {
          id: 'industry-software',
          group: 'Software',
          sector: 'Technology',
          industry: 'Software',
          childrenCount: 2,
        },
        {
          id: 'industry-hardware',
          group: 'Hardware',
          sector: 'Technology',
          industry: 'Hardware',
          childrenCount: 1,
        },
      ],
      '["Finance"]': [
        {
          id: 'industry-banking',
          group: 'Banking',
          sector: 'Finance',
          industry: 'Banking',
          childrenCount: 0,
        },
      ],
      '["Technology","Software"]': [
        {
          id: 'stock-msft',
          group: 'Microsoft',
          sector: 'Technology',
          industry: 'Software',
          company: 'Microsoft',
          value: 430,
          childrenCount: 0,
        },
        {
          id: 'stock-adbe',
          group: 'Adobe',
          sector: 'Technology',
          industry: 'Software',
          company: 'Adobe',
          value: 560,
          childrenCount: 0,
        },
      ],
    };

    function TestNestedLazyRowGrouping(
      props: Partial<DataGridPremiumProps> & {
        onFetchRows: (params: GridGetRowsParams) => void;
      },
    ) {
      const { onFetchRows, ...other } = props;
      apiRef = useGridApiRef();

      const dataSource: GridDataSource = React.useMemo(
        () => ({
          getRows: async (params: GridGetRowsParams) => {
            onFetchRows(params);

            const groupKeys = params.groupKeys ?? [];
            const rows = rowsByGroupKeys[JSON.stringify(groupKeys)] ?? [];
            const start = typeof params.start === 'number' ? params.start : 0;
            const end = typeof params.end === 'number' ? params.end : rows.length - 1;

            return {
              rows: rows.slice(start, end + 1),
              rowCount: rows.length,
            };
          },
          getGroupKey: (row) => row.group,
          getChildrenCount: (row) => row.childrenCount,
        }),
        [onFetchRows],
      );

      return (
        <div style={{ width: 400, height: gridHeight }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[
              { field: 'sector', width: 120 },
              { field: 'industry', width: 120 },
              { field: 'company', width: 120 },
              { field: 'value', width: 80 },
            ]}
            dataSource={dataSource}
            dataSourceCache={null}
            lazyLoading
            rowGroupingModel={['sector', 'industry']}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
            }}
            rowHeight={rowHeight}
            columnHeaderHeight={columnHeaderHeight}
            {...other}
          />
        </div>
      );
    }

    it('should create row grouping nodes with the grouping field for each lazy-loaded level', async () => {
      const getRowsSpy = vi.fn();
      const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

      await waitFor(() => {
        const rootChildren = (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode)
          .children;
        expect(rootChildren).to.deep.equal(['sector-tech', 'sector-finance']);
      });

      const techNode = apiRef.current!.getRowNode<GridDataSourceGroupNode>('sector-tech')!;
      expect(techNode.groupingField).to.equal('sector');
      expect(techNode.path).to.deep.equal(['Technology']);
      expect(
        (apiRef.current!.state.rows.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).childrenFromPath
          .sector.Technology,
      ).to.equal('sector-tech');

      await user.click(within(getCell(0, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('industry-software')).not.to.equal(null);
      });

      const softwareNode =
        apiRef.current!.getRowNode<GridDataSourceGroupNode>('industry-software')!;
      expect(softwareNode.groupingField).to.equal('industry');
      expect(softwareNode.path).to.deep.equal(['Technology', 'Software']);
      const updatedTechNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
      expect(updatedTechNode.childrenFromPath.industry.Software).to.equal('industry-software');

      const technologyRequest = getRowsSpy.mock.calls.find((call) => {
        const params = call[0] as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['Technology']);
      })?.[0] as GridGetRowsParams | undefined;

      expect(technologyRequest?.groupFields).to.deep.equal(['sector', 'industry']);
    });

    it('should lazy load children for default-expanded row grouping groups', async () => {
      const getRowsSpy = vi.fn();
      render(
        <TestNestedLazyRowGrouping defaultGroupingExpansionDepth={1} onFetchRows={getRowsSpy} />,
      );

      await waitFor(() => {
        expect(apiRef.current!.getRow('industry-software')).not.to.equal(null);
      });

      const sectorNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
      expect(sectorNode.childrenExpanded).to.equal(true);

      const technologyRequest = getRowsSpy.mock.calls.find((call) => {
        const params = call[0] as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['Technology']);
      })?.[0] as GridGetRowsParams | undefined;
      expect(technologyRequest?.groupFields).to.deep.equal(['sector', 'industry']);
    });

    it('should use isGroupExpandedByDefault for lazy-loaded row grouping groups', async () => {
      const getRowsSpy = vi.fn();
      const isGroupExpandedByDefault = vi.fn(
        (node: GridGroupNode) => node.groupingField === 'sector' && node.groupingKey === 'Finance',
      );
      render(
        <TestNestedLazyRowGrouping
          isGroupExpandedByDefault={isGroupExpandedByDefault}
          onFetchRows={getRowsSpy}
        />,
      );

      await waitFor(() => {
        expect(apiRef.current!.getRow('industry-banking')).not.to.equal(null);
      });

      const technologyNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
      const financeNode = apiRef.current!.getRowNode<GridGroupNode>('sector-finance')!;
      expect(technologyNode.childrenExpanded).to.equal(false);
      expect(financeNode.childrenExpanded).to.equal(true);
      expect(apiRef.current!.getRow('industry-software')).to.equal(null);
      expect(isGroupExpandedByDefault.mock.calls.length).to.be.greaterThan(0);
    });

    [
      {
        label: 'sorting',
        updateModel: () => apiRef.current!.setSortModel([{ field: 'sector', sort: 'desc' }]),
        isMatchingRequest: (params: GridGetRowsParams) =>
          params.sortModel[0]?.field === 'sector' && params.sortModel[0]?.sort === 'desc',
      },
      {
        label: 'filtering',
        updateModel: () =>
          apiRef.current!.setFilterModel({
            items: [{ field: 'sector', operator: 'contains', value: 'Tech' }],
          }),
        isMatchingRequest: (params: GridGetRowsParams) =>
          params.filterModel.items[0]?.field === 'sector' &&
          params.filterModel.items[0]?.value === 'Tech',
      },
    ].forEach(({ label, updateModel, isMatchingRequest }) => {
      it(`should preserve expanded row grouping groups and fetch children after ${label}`, async () => {
        const getRowsSpy = vi.fn();
        const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

        await waitFor(() => expect(apiRef.current!.getRow('sector-tech')).not.to.equal(null));
        await user.click(within(getCell(0, 0)).getByRole('button'));
        await waitFor(() => expect(apiRef.current!.getRow('industry-software')).not.to.equal(null));
        await user.click(within(getCell(1, 0)).getByRole('button'));
        await waitFor(() => expect(apiRef.current!.getRow('stock-msft')).not.to.equal(null));

        getRowsSpy.mockClear();

        act(() => updateModel());

        await waitFor(() => {
          const nestedRequest = getRowsSpy.mock.calls.find((call) => {
            const params = call[0] as GridGetRowsParams;
            return (
              JSON.stringify(params.groupKeys) === JSON.stringify(['Technology']) &&
              isMatchingRequest(params)
            );
          })?.[0] as GridGetRowsParams | undefined;

          expect(nestedRequest?.groupFields).to.deep.equal(['sector', 'industry']);
        });

        // Deeper expanded levels must also be re-fetched, not only the first.
        await waitFor(() => {
          const deepRequest = getRowsSpy.mock.calls.find((call) => {
            const params = call[0] as GridGetRowsParams;
            return (
              JSON.stringify(params.groupKeys) === JSON.stringify(['Technology', 'Software']) &&
              isMatchingRequest(params)
            );
          })?.[0] as GridGetRowsParams | undefined;

          expect(deepRequest?.groupFields).to.deep.equal(['sector', 'industry']);
        });

        expect(apiRef.current!.getRow('industry-software')).not.to.equal(null);
        const sectorNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
        expect(sectorNode.childrenExpanded).to.equal(true);
        const softwareNode = apiRef.current!.getRowNode<GridGroupNode>('industry-software')!;
        expect(softwareNode.childrenExpanded).to.equal(true);
      });
    });

    it('should lazy load leaves under the final row grouping level', async () => {
      const getRowsSpy = vi.fn();
      const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

      await waitFor(() => expect(apiRef.current!.getRow('sector-tech')).not.to.equal(null));
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('industry-software')).not.to.equal(null));

      await user.click(within(getCell(1, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('stock-msft')).not.to.equal(null);
      });

      const stockNode = apiRef.current!.getRowNode('stock-msft')!;
      expect(stockNode.type).to.equal('leaf');
      expect(stockNode.parent).to.equal('industry-software');

      const softwareNode = apiRef.current!.getRowNode<GridGroupNode>('industry-software')!;
      const noGroupingField = '__no_field__';
      expect(softwareNode.childrenFromPath[noGroupingField].Microsoft).to.equal('stock-msft');

      const softwareRequest = getRowsSpy.mock.calls.find((call) => {
        const params = call[0] as GridGetRowsParams;
        return JSON.stringify(params.groupKeys) === JSON.stringify(['Technology', 'Software']);
      })?.[0] as GridGetRowsParams | undefined;

      expect(softwareRequest?.groupFields).to.deep.equal(['sector', 'industry']);
    });

    it('should collapse expanded row grouping parents without removing skeleton rows through row updates', async () => {
      const getRowsSpy = vi.fn();
      const { user } = render(<TestNestedLazyRowGrouping onFetchRows={getRowsSpy} />);

      await waitFor(() => expect(apiRef.current!.getRow('sector-tech')).not.to.equal(null));
      await user.click(within(getCell(0, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('industry-software')).not.to.equal(null));
      await user.click(within(getCell(1, 0)).getByRole('button'));
      await waitFor(() => expect(apiRef.current!.getRow('stock-msft')).not.to.equal(null));

      await user.click(within(getCell(0, 0)).getByRole('button'));

      await waitFor(() => {
        expect(apiRef.current!.getRow('industry-software')).to.equal(null);
      });

      const techNode = apiRef.current!.getRowNode<GridGroupNode>('sector-tech')!;
      expect(techNode.childrenExpanded).to.equal(false);
      expect(techNode.children).to.have.length(2);
      techNode.children.forEach((childId) => {
        expect(apiRef.current!.state.rows.tree[childId].type).to.equal('skeletonRow');
      });
    });
  });
});
