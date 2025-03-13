import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent } from '@mui/internal-test-utils';
import { getCell, includeRowSelection } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
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
      const onRowSelectionModelChange = spy();
      render(
        <Test
          rowSelectionModel={includeRowSelection([3, 4])}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );

      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal(
        includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
      );
    });

    it('should auto select the parent when updating the controlled row selection model', async () => {
      const onRowSelectionModelChange = spy();
      const { setProps } = render(
        <Test
          rowSelectionModel={includeRowSelection([])}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );

      expect(onRowSelectionModelChange.callCount).to.equal(0);
      act(() => {
        setProps({ rowSelectionModel: includeRowSelection([3, 4]) });
      });
      expect(onRowSelectionModelChange.callCount).to.equal(1);
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal(
        includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
      );
    });

    it('should auto select descendants when updating the controlled row selection model', async () => {
      const onRowSelectionModelChange = spy();
      const { setProps } = render(
        <Test
          rowSelectionModel={includeRowSelection([])}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );

      expect(onRowSelectionModelChange.callCount).to.equal(0);
      act(() => {
        setProps({
          rowSelectionModel: includeRowSelection(['auto-generated-row-category1/Cat B']),
        });
      });
      expect(onRowSelectionModelChange.callCount).to.equal(1);
      expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal(
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

    describe.skip('prop: keepNonExistentRowsSelected', () => {
      it('should auto select the parent of a previously selected non existent rows when it is added back', () => {
        const onRowSelectionModelChange = spy();
        const { setProps } = render(
          <Test
            keepNonExistentRowsSelected
            rowSelectionModel={includeRowSelection([3, 4])}
            rows={[]}
            onRowSelectionModelChange={onRowSelectionModelChange}
          />,
        );

        expect(onRowSelectionModelChange.callCount).to.equal(0);

        act(() => {
          setProps({ rows });
        });
        expect(onRowSelectionModelChange.callCount).to.equal(1);
        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal(
          includeRowSelection([3, 4, 'auto-generated-row-category1/Cat B']),
        );
      });

      it('should auto select the children of a previously non existent parent row when it is added back', () => {
        const onRowSelectionModelChange = spy();
        const { setProps } = render(
          <Test
            keepNonExistentRowsSelected
            rowSelectionModel={includeRowSelection(['auto-generated-row-category1/Cat B'])}
            rows={[]}
            onRowSelectionModelChange={onRowSelectionModelChange}
          />,
        );

        expect(onRowSelectionModelChange.callCount).to.equal(0);

        act(() => {
          setProps({ rows });
        });
        expect(onRowSelectionModelChange.callCount).to.equal(1);
        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal(
          includeRowSelection(['auto-generated-row-category1/Cat B', 3, 4]),
        );
      });
    });
  });
});
