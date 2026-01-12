import { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent } from '@mui/internal-test-utils';
import { getCell, includeRowSelection } from 'test/utils/helperFn';
import { vi } from 'vitest';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  gridRowSelectionIdsSelector,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

interface BaselineProps extends DataGridPremiumProps {
  rows: GridRowsProp;
}

const rows: GridRowsProp = [
  { id: 0, category1: 'Cat A', category2: 'Cat 1' },
  { id: 1, category1: 'Cat A', category2: 'Cat 2' },
  { id: 2, category1: 'Cat A', category2: 'Cat 2' },
  { id: 3, category1: 'Cat B', category2: 'Cat 2' },
  { id: 4, category1: 'Cat B', category2: 'Cat 1' },
];

const baselineProps: BaselineProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  rows,
  columns: [
    {
      field: 'id',
      type: 'number',
    },
    {
      field: 'category1',
    },
    {
      field: 'category2',
    },
  ],
};

describe('<DataGridPremium /> - Row selection', () => {
  const { render } = createRenderer();

  describe('props: rowSelectionPropagation = { descendants: true, parents: true }', () => {
    let apiRef: RefObject<GridApi | null>;

    function Test(props: Partial<DataGridPremiumProps>) {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            {...baselineProps}
            checkboxSelection
            apiRef={apiRef}
            rowSelectionPropagation={{
              descendants: true,
              parents: true,
            }}
            initialState={{ rowGrouping: { model: ['category1'] } }}
            {...props}
          />
        </div>
      );
    }

    it('should auto select parents when controlling row selection model', () => {
      const onRowSelectionModelChange = vi.fn();
      render(
        <Test
          rowSelectionModel={includeRowSelection([3, 4])}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );

      expect(onRowSelectionModelChange).toHaveBeenLastCalledWith(
        includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
      );
    });

    it('should auto select the parent when updating the controlled row selection model', async () => {
      const onRowSelectionModelChange = vi.fn();
      const { setProps } = render(
        <Test
          rowSelectionModel={includeRowSelection([])}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );

      expect(onRowSelectionModelChange.mock.calls.length).to.equal(0);
      act(() => {
        setProps({ rowSelectionModel: includeRowSelection([3, 4]) });
      });
      expect(onRowSelectionModelChange.mock.calls.length).to.equal(1);
      expect(onRowSelectionModelChange).toHaveBeenLastCalledWith(
        includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
      );
    });

    it('should auto select descendants when updating the controlled row selection model', async () => {
      const onRowSelectionModelChange = vi.fn();
      const { setProps } = render(
        <Test
          rowSelectionModel={includeRowSelection([])}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );

      expect(onRowSelectionModelChange.mock.calls.length).to.equal(0);
      act(() => {
        setProps({
          rowSelectionModel: includeRowSelection(['auto-generated-row-category1/Cat B']),
        });
      });
      expect(onRowSelectionModelChange.mock.calls.length).to.equal(1);
      expect(onRowSelectionModelChange).toHaveBeenLastCalledWith(
        includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
      );
    });

    it('should select all the children when selecting a parent', () => {
      render(<Test />);

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys([
        'auto-generated-row-category1/Cat B',
        3,
        4,
      ]);
    });

    it('should deselect all the children when deselecting a parent', () => {
      render(<Test />);

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys([
        'auto-generated-row-category1/Cat B',
        3,
        4,
      ]);
      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows().size).to.equal(0);
    });

    it('should auto select the parent if all the children are selected', () => {
      render(<Test defaultGroupingExpansionDepth={-1} density="compact" />);

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      fireEvent.click(getCell(3, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys([
        0,
        1,
        2,
        'auto-generated-row-category1/Cat A',
      ]);
    });

    it('should deselect auto selected parent if one of the children is deselected', async () => {
      const { user } = render(<Test defaultGroupingExpansionDepth={-1} density="compact" />);

      await user.click(getCell(1, 0).querySelector('input')!);
      await user.click(getCell(2, 0).querySelector('input')!);
      await user.click(getCell(3, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys([
        0,
        1,
        2,
        'auto-generated-row-category1/Cat A',
      ]);
      await user.click(getCell(2, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys([0, 2]);
    });

    // Context: https://github.com/mui/mui-x/issues/15206
    it('should keep the correct selection items and the selection count when rows are updated', () => {
      render(<Test />);

      const expectedKeys = ['auto-generated-row-category1/Cat B', 3, 4];
      const expectedCount = 3;

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys(expectedKeys);
      expect(apiRef.current?.state.rowSelection.type).to.equal('include');
      expect(apiRef.current?.state.rowSelection.ids.size).to.equal(expectedCount);

      act(() => {
        apiRef.current?.updateRows([...rows]);
      });
      expect(apiRef.current?.getSelectedRows()).to.have.keys(expectedKeys);
      expect(apiRef.current?.state.rowSelection.type).to.equal('include');
      expect(apiRef.current?.state.rowSelection.ids.size).to.equal(expectedCount);
    });

    it('should select all the children when selecting an indeterminate parent', () => {
      render(<Test defaultGroupingExpansionDepth={-1} density="compact" />);

      fireEvent.click(getCell(2, 0).querySelector('input')!);
      expect(getCell(0, 0).querySelector('input')!).to.have.attr('data-indeterminate', 'true');
      fireEvent.click(getCell(0, 0).querySelector('input')!);
      expect(apiRef.current?.getSelectedRows()).to.have.keys([
        0,
        1,
        2,
        'auto-generated-row-category1/Cat A',
      ]);
    });

    // Regression for bugfix/20525: parent checkbox state and auto-select parents should ignore non-selectable rows
    it('should auto-select parent when all selectable siblings are selected, ignoring non-selectable ones', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={-1}
          density="compact"
          isRowSelectable={({ id }) =>
            id === 'auto-generated-row-category1/Cat A' || id === 0 || id === 2
          }
        />,
      );

      // Select only the first selectable sibling (row 1)
      fireEvent.click(getCell(1, 0).querySelector('input')!);

      // Check if parent checkbox is indeterminate
      const parentCheckboxAfter = getCell(0, 0).querySelector('input')!;
      expect(parentCheckboxAfter).to.have.attr('data-indeterminate', 'true');

      // Select the other selectable sibling (row 3)
      fireEvent.click(getCell(3, 0).querySelector('input')!);

      // Parent should be auto-selected because all selectable children are selected
      expect(parentCheckboxAfter).to.have.property('checked', true);
      expect(parentCheckboxAfter).to.have.attr('data-indeterminate', 'false');
      expect(apiRef.current?.getSelectedRows()).to.have.keys([
        'auto-generated-row-category1/Cat A',
        0,
        2,
      ]);
    });

    describe('prop: keepNonExistentRowsSelected', () => {
      // https://github.com/mui/mui-x/issues/20568
      it('should not throw when using `isRowSelectable`, `keepNonExistentRowsSelected`, and row grouping', () => {
        const { setProps } = render(
          <Test
            keepNonExistentRowsSelected
            isRowSelectable={() => true}
            rowSelectionModel={includeRowSelection(['auto-generated-row-category1/Cat B', 3, 4])}
          />,
        );

        expect(Array.from(gridRowSelectionIdsSelector(apiRef).keys())).to.deep.equal([
          'auto-generated-row-category1/Cat B',
          3,
          4,
        ]);

        // Simulate server-side pagination by removing rows
        act(() => {
          setProps({ rows: rows.filter((row) => row.category1 !== 'Cat B') });
        });

        // The selection should still include the non-existent rows
        expect(Array.from(gridRowSelectionIdsSelector(apiRef).keys())).to.deep.equal([
          'auto-generated-row-category1/Cat B',
          3,
          4,
        ]);
      });

      // TODO: Use case yet to be supported
      it.todo(
        'should auto select the parent of a previously selected non existent rows when it is added back',
        () => {
          const onRowSelectionModelChange = vi.fn();
          const { setProps } = render(
            <Test
              keepNonExistentRowsSelected
              rowSelectionModel={includeRowSelection([3, 4])}
              rows={[]}
              onRowSelectionModelChange={onRowSelectionModelChange}
            />,
          );

          expect(onRowSelectionModelChange.mock.calls.length).to.equal(0);

          act(() => {
            setProps({ rows });
          });
          expect(onRowSelectionModelChange.mock.calls.length).to.equal(1);
          expect(onRowSelectionModelChange).toHaveBeenLastCalledWith(
            includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
          );
        },
      );

      // TODO: Use case yet to be supported
      it.todo(
        'should auto select the children of a previously non existent parent row when it is added back',
        () => {
          const onRowSelectionModelChange = vi.fn();
          const { setProps } = render(
            <Test
              keepNonExistentRowsSelected
              rowSelectionModel={includeRowSelection(['auto-generated-row-category1/Cat B'])}
              rows={[]}
              onRowSelectionModelChange={onRowSelectionModelChange}
            />,
          );

          expect(onRowSelectionModelChange.mock.calls.length).to.equal(0);

          act(() => {
            setProps({ rows });
          });
          expect(onRowSelectionModelChange.mock.calls.length).to.equal(1);
          expect(onRowSelectionModelChange).toHaveBeenLastCalledWith(
            includeRowSelection(['auto-generated-row-category1/Cat B', 3, 4]),
          );
        },
      );
    });
  });
});
