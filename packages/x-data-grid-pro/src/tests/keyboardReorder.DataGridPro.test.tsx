import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi } from '@mui/x-data-grid-pro';
import { describe, it, expect } from 'vitest';
import { getKeyboardRowMoveTarget } from '../hooks/features/rowReorder/rowReorderDragUtils';

const rows = [
  { id: 0, name: 'A' },
  { id: 1, name: 'B' },
  { id: 2, name: 'C' },
  { id: 3, name: 'D' },
  { id: 4, name: 'E' },
];

const columns = [{ field: 'name' }];

describe('<DataGridPro /> - Keyboard reorder', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 400 }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} rowReordering {...props} />
      </div>
    );
  }

  describe('getKeyboardRowMoveTarget', () => {
    const getTarget = (
      rowId: number,
      direction: 'up' | 'down',
      toEdge: boolean,
      hasCustomValidation = false,
    ) => getKeyboardRowMoveTarget(apiRef as any, { rowId, direction, toEdge, hasCustomValidation });

    it('should target the previous row above, and the next row below', () => {
      render(<Test />);
      expect(getTarget(2, 'up', false)).to.deep.equal({
        target: { rowId: 1, position: 'above' },
        targetIndex: 1,
      });
      expect(getTarget(2, 'down', false)).to.deep.equal({
        target: { rowId: 3, position: 'below' },
        targetIndex: 3,
      });
    });

    it('should target the first and the last row to the edge', () => {
      render(<Test />);
      expect(getTarget(2, 'up', true)).to.deep.equal({
        target: { rowId: 0, position: 'above' },
        targetIndex: 0,
      });
      expect(getTarget(2, 'down', true)).to.deep.equal({
        target: { rowId: 4, position: 'below' },
        targetIndex: 4,
      });
    });

    it('should refuse at the first and the last row', () => {
      render(<Test />);
      expect(getTarget(0, 'up', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(0, 'up', true)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(4, 'down', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(4, 'down', true)).to.deep.equal({ refusal: 'edge' });
    });

    it('should stay within the current page', () => {
      render(
        <Test
          pagination
          pageSizeOptions={[2]}
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 2 } } }}
        />,
      );
      expect(getTarget(2, 'up', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(3, 'down', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(3, 'up', true)).to.deep.equal({
        target: { rowId: 2, position: 'above' },
        targetIndex: 2,
      });
    });

    it('should not target a pinned row', () => {
      render(
        <Test
          rows={rows.slice(1)}
          pinnedRows={{ top: [rows[0]], bottom: [{ id: 5, name: 'F' }] }}
        />,
      );
      expect(getTarget(1, 'up', false)).to.deep.equal({ refusal: 'edge' });
      expect(getTarget(4, 'down', false)).to.deep.equal({ refusal: 'edge' });
    });

    it('should refuse a step that isValidRowReorder rejects', () => {
      render(<Test isValidRowReorder={(context) => context.targetNode.id !== 1} />);
      expect(getTarget(2, 'up', false, true)).to.deep.equal({ refusal: 'invalid' });
    });

    it('should stop before the first step that isValidRowReorder rejects', () => {
      render(<Test isValidRowReorder={(context) => context.targetNode.id !== 1} />);
      expect(getTarget(4, 'up', true, true)).to.deep.equal({
        target: { rowId: 2, position: 'above' },
        targetIndex: 2,
      });
    });
  });
});
