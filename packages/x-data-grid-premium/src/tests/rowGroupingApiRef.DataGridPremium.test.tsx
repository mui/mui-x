import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';

import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridRowsProp,
  useGridApiRef,
  getGroupRowIdFromPath,
} from '@mui/x-data-grid-premium';
import { expect } from 'chai';

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

describe('<DataGridPremium /> - Row grouping', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('apiRef: addRowGroupingCriteria', () => {
    it('should add grouping criteria to model', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      act(() => apiRef.current?.addRowGroupingCriteria('category2'));
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal(['category1', 'category2']);
    });

    it('should add grouping criteria to model at the right position', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      act(() => apiRef.current?.addRowGroupingCriteria('category2', 0));
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
    });
  });

  describe('apiRef: removeRowGroupingCriteria', () => {
    it('should remove field from model', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);
      act(() => apiRef.current?.removeRowGroupingCriteria('category1'));
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal([]);
    });
  });

  describe('apiRef: setRowGroupingCriteriaIndex', () => {
    it('should change the grouping criteria order', () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} />);
      act(() => apiRef.current?.setRowGroupingCriteriaIndex('category1', 1));
      expect(apiRef.current?.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
    });
  });

  describe('apiRef: getRowGroupChildren', () => {
    it('should return the rows in group of depth 0 of length 1 from tree of depth 1', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            filter: {
              filterModel: {
                items: [{ field: 'id', operator: '>=', value: '1' }],
              },
            },
          }}
        />,
      );

      const groupId = getGroupRowIdFromPath([{ field: 'category1', key: 'Cat A' }]);
      expect(apiRef.current?.getRowGroupChildren({ groupId })).to.deep.equal([0, 1, 2]);
      expect(apiRef.current?.getRowGroupChildren({ groupId, applySorting: true })).to.deep.equal([
        2, 1, 0,
      ]);
      expect(apiRef.current?.getRowGroupChildren({ groupId, applyFiltering: true })).to.deep.equal([
        1, 2,
      ]);
      expect(
        apiRef.current?.getRowGroupChildren({
          groupId,
          applySorting: true,
          applyFiltering: true,
        }),
      ).to.deep.equal([2, 1]);
    });

    it('should return the rows in group of depth 0 from tree of depth 2', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1', 'category2'] },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            filter: {
              filterModel: {
                items: [{ field: 'id', operator: '>=', value: '1' }],
              },
            },
          }}
        />,
      );

      const groupId = getGroupRowIdFromPath([{ field: 'category1', key: 'Cat A' }]);
      expect(apiRef.current?.getRowGroupChildren({ groupId })).to.deep.equal([0, 1, 2]);
      expect(apiRef.current?.getRowGroupChildren({ groupId, applySorting: true })).to.deep.equal([
        0, 2, 1,
      ]);
      expect(apiRef.current?.getRowGroupChildren({ groupId, applyFiltering: true })).to.deep.equal([
        1, 2,
      ]);
      expect(
        apiRef.current?.getRowGroupChildren({
          groupId,
          applySorting: true,
          applyFiltering: true,
        }),
      ).to.deep.equal([2, 1]);
      expect(
        apiRef.current?.getRowGroupChildren({
          groupId,
          skipAutoGeneratedRows: false,
        }),
      ).to.deep.equal([
        'auto-generated-row-category1/Cat A-category2/Cat 1',
        0,
        'auto-generated-row-category1/Cat A-category2/Cat 2',
        1,
        2,
      ]);
      expect(
        apiRef.current?.getRowGroupChildren({
          groupId,
          skipAutoGeneratedRows: false,
          applySorting: true,
          applyFiltering: true,
        }),
      ).to.deep.equal(['auto-generated-row-category1/Cat A-category2/Cat 2', 2, 1]);
    });

    it('should return the rows in group of depth 1 from tree of depth 2', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1', 'category2'] },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
            filter: {
              filterModel: {
                items: [{ field: 'id', operator: '>=', value: '2' }],
              },
            },
          }}
        />,
      );

      const groupId = getGroupRowIdFromPath([
        { field: 'category1', key: 'Cat A' },
        { field: 'category2', key: 'Cat 2' },
      ]);
      expect(apiRef.current?.getRowGroupChildren({ groupId })).to.deep.equal([1, 2]);
      expect(apiRef.current?.getRowGroupChildren({ groupId, applySorting: true })).to.deep.equal([
        2, 1,
      ]);
      expect(apiRef.current?.getRowGroupChildren({ groupId, applyFiltering: true })).to.deep.equal([
        2,
      ]);
    });
  });
});
