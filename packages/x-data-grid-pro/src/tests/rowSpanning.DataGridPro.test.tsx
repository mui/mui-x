import { type RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import {
  DataGridPro,
  type DataGridProProps,
  type GridApi,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { unwrapPrivateAPI } from '@mui/x-data-grid-pro/internals';
import { getCell, microtasks } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe.skipIf(isJSDOM)('<DataGridPro /> - Row spanning', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  describe('tree data', () => {
    // Tree data adds __tree_data_group__ column at index 0
    // So salesPerson is at visible column index 1
    const SALES_PERSON_COL_INDEX = 1;

    // Row IDs match hierarchy paths for tree data (e.g., 'Thomas', 'Thomas.Robert')
    const rows = [
      { path: 'Sarah', salesPerson: 'Sarah', role: 'Head of HR' },
      { path: 'Thomas', salesPerson: 'Thomas', role: 'Head of Sales' },
      { path: 'Thomas.Robert', salesPerson: 'Thomas', role: 'Sales Rep' },
      { path: 'Thomas.Karen', salesPerson: 'Thomas', role: 'Sales Rep' },
      { path: 'Thomas.Nancy', salesPerson: 'Thomas', role: 'Sales Rep' },
      { path: 'Mary', salesPerson: 'Mary', role: 'Head of Engineering' },
    ];

    const columns: DataGridProProps['columns'] = [
      { field: 'salesPerson', headerName: 'Sales Person', width: 150 },
      { field: 'role', headerName: 'Role', width: 200 },
    ];

    function TreeDataTest(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 500, height: 400 }}>
          <DataGridPro
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            treeData
            getTreeDataPath={(row) => row.path.split('.')}
            getRowId={(row) => row.path}
            rowSpanning
            {...props}
          />
        </div>
      );
    }

    it('should recalculate row spanning when expanding a tree node', async () => {
      render(<TreeDataTest defaultGroupingExpansionDepth={0} />);
      const privateApi = unwrapPrivateAPI(apiRef.current!);
      const store = privateApi.virtualizer.store;

      // Initially collapsed: Sarah, Thomas, Mary visible - no spanning since all have unique salesPerson
      const initialSpannedCells = store.state.rowSpanning.caches.spannedCells;
      expect(Object.keys(initialSpannedCells).length).to.equal(0);

      // Expand Thomas to show children
      act(() => {
        apiRef.current?.setRowChildrenExpansion('Thomas', true);
      });
      await microtasks();

      // After expanding: Thomas row should span 4 rows (Thomas + 3 children with same salesPerson)
      const expandedSpannedCells = store.state.rowSpanning.caches.spannedCells;
      expect(expandedSpannedCells.Thomas).to.deep.equal({ [SALES_PERSON_COL_INDEX]: 4 });
    });

    it('should recalculate row spanning when collapsing a tree node', async () => {
      render(<TreeDataTest defaultGroupingExpansionDepth={-1} />);
      const privateApi = unwrapPrivateAPI(apiRef.current!);
      const store = privateApi.virtualizer.store;
      await microtasks();

      // Initially expanded: Thomas should span 4 rows (itself + 3 children)
      let spannedCells = store.state.rowSpanning.caches.spannedCells;
      expect(spannedCells.Thomas).to.deep.equal({ [SALES_PERSON_COL_INDEX]: 4 });

      // Collapse Thomas
      act(() => {
        apiRef.current?.setRowChildrenExpansion('Thomas', false);
      });
      await microtasks();

      // After collapsing: Thomas should no longer span (only group header visible)
      spannedCells = store.state.rowSpanning.caches.spannedCells;
      expect(spannedCells.Thomas).to.equal(undefined);
    });

    it('should update spanned cell height when collapsing', async () => {
      render(<TreeDataTest defaultGroupingExpansionDepth={-1} />);
      const privateApi = unwrapPrivateAPI(apiRef.current!);
      await microtasks();

      // Get the row index for Thomas
      const thomasRowIndex = privateApi.getRowIndexRelativeToVisibleRows('Thomas');

      // When expanded, the salesPerson cell should have height for 4 rows
      let spannedCell = getCell(thomasRowIndex, SALES_PERSON_COL_INDEX);
      expect(spannedCell).to.have.style('height', `${52 * 4}px`);

      // Collapse Thomas
      act(() => {
        apiRef.current?.setRowChildrenExpansion('Thomas', false);
      });
      await microtasks();

      // After collapsing, the cell should have default height (no span)
      spannedCell = getCell(thomasRowIndex, SALES_PERSON_COL_INDEX);
      expect(spannedCell.style.height).to.equal('');
    });
  });
});
