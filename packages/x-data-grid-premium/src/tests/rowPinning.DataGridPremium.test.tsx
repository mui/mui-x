import { createRenderer } from '@mui/internal-test-utils';
import * as React from 'react';
import { expect } from 'chai';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridRowsProp,
  gridClasses,
} from '@mui/x-data-grid-premium';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [
  { id: 0, category1: 'Cat A', category2: 'Cat 1' },
  { id: 1, category1: 'Cat A', category2: 'Cat 2' },
  { id: 2, category1: 'Cat A', category2: 'Cat 2' },
  { id: 3, category1: 'Cat B', category2: 'Cat 2' },
  { id: 4, category1: 'Cat B', category2: 'Cat 1' },
];

const baselineProps: DataGridPremiumProps = {
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

describe('<DataGridPremium /> - Row pinning', () => {
  const { render } = createRenderer({ clock: 'fake' });

  function getRowById(id: number | string) {
    return document.querySelector(`[data-id="${id}"]`);
  }

  function getTopPinnedRowsContainer() {
    return document.querySelector<HTMLElement>(`.${gridClasses['pinnedRows--top']}`);
  }
  function getBottomPinnedRowsContainer() {
    return document.querySelector<HTMLElement>(`.${gridClasses['pinnedRows--bottom']}`);
  }

  function isRowPinned(row: Element | null, section: 'top' | 'bottom') {
    const container =
      section === 'top' ? getTopPinnedRowsContainer() : getBottomPinnedRowsContainer();
    if (!row || !container) {
      return false;
    }
    return container.contains(row);
  }

  it('should render pinned rows outside of row groups', () => {
    function Test() {
      const [pinnedRow0, pinnedRow1, ...rowsData] = rows;

      return (
        <div style={{ width: 300, height: 400 }}>
          <DataGridPremium
            {...baselineProps}
            rows={rowsData}
            initialState={{ rowGrouping: { model: ['category1'] } }}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
          />
        </div>
      );
    }

    render(<Test />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });
});
