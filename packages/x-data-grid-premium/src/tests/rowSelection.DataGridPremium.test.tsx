import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { getCell } from 'test/utils/helperFn';
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

  let apiRef: React.MutableRefObject<GridApi>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} checkboxSelection apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('prop: rowSelectionPropagation="both"', () => {
    it('should select all the children when selecting a parent', () => {
      render(
        <Test
          rowSelectionPropagation="both"
          initialState={{ rowGrouping: { model: ['category1'] } }}
        />,
      );

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([
        'auto-generated-row-category1/Cat B',
        3,
        4,
      ]);
    });

    it('should deselect all the children when deselecting a parent', () => {
      render(
        <Test
          rowSelectionPropagation="both"
          initialState={{ rowGrouping: { model: ['category1'] } }}
        />,
      );

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([
        'auto-generated-row-category1/Cat B',
        3,
        4,
      ]);
      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows().size).to.equal(0);
    });

    it('should put the parent into indeterminate if some but not all the children are selected', () => {
      render(
        <Test
          rowSelectionPropagation="both"
          defaultGroupingExpansionDepth={-1}
          initialState={{ rowGrouping: { model: ['category1'] } }}
          density="compact"
        />,
      );

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      expect(getCell(0, 0).querySelector('input')!).to.have.attr('data-indeterminate', 'true');
    });

    it('should auto select the parent if all the children are selected', () => {
      render(
        <Test
          rowSelectionPropagation="both"
          defaultGroupingExpansionDepth={-1}
          density="compact"
          initialState={{ rowGrouping: { model: ['category1'] } }}
        />,
      );

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      fireEvent.click(getCell(3, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([
        0,
        1,
        2,
        'auto-generated-row-category1/Cat A',
      ]);
    });

    it('should deselect auto selected parent if one of the children is deselected', () => {
      render(
        <Test
          rowSelectionPropagation="both"
          defaultGroupingExpansionDepth={-1}
          density="compact"
          initialState={{ rowGrouping: { model: ['category1'] } }}
        />,
      );

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      fireEvent.click(getCell(3, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([
        0,
        1,
        2,
        'auto-generated-row-category1/Cat A',
      ]);
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      expect(apiRef.current.getSelectedRows()).to.have.keys([0, 2]);
    });

    it('should deselect unfiltered rows after filtering', () => {
      render(
        <Test
          rowSelectionPropagation="both"
          defaultGroupingExpansionDepth={-1}
          density="compact"
          initialState={{ rowGrouping: { model: ['category1'] } }}
        />,
      );

      fireEvent.click(getCell(1, 0).querySelector('input')!);
      fireEvent.click(getCell(2, 0).querySelector('input')!);
      fireEvent.click(getCell(3, 0).querySelector('input')!);
      fireEvent.click(getCell(5, 0).querySelector('input')!);

      expect(apiRef.current.getSelectedRows()).to.have.keys([
        0,
        1,
        2,
        'auto-generated-row-category1/Cat A',
        3,
      ]);
      act(() => {
        apiRef.current.setFilterModel({
          items: [],
          quickFilterValues: ['Cat B'],
        });
      });
      expect(apiRef.current.getSelectedRows()).to.have.keys([3]);
    });
  });
});
