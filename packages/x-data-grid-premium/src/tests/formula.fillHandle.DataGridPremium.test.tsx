import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { getCell } from 'test/utils/helperFn';
import { createRenderer, act, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGridPremium, useGridApiRef, gridClasses } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi, GridColDef } from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

/**
 * Fill-handle formula reference adjustment (I7). The fill handle and the
 * Ctrl+D / Ctrl+R shortcuts both route through `getFilledFormulaSource`, so the
 * jsdom-runnable shortcut tests exercise the same adjustment logic as the
 * browser-only drag tests.
 */
describe('<DataGridPremium /> - Formula fill handle', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const columns: GridColDef[] = [
    { field: 'price', type: 'number', editable: true },
    { field: 'qty', type: 'number', editable: true },
    { field: 'total', editable: true, allowFormulas: true },
    { field: 'plain', editable: true },
  ];

  const PRODUCT_FORMULA = '=REF(COLUMN("price"), ROW("r0")) * REF(COLUMN("qty"), ROW("r0"))';

  function makeRows(totalR0 = PRODUCT_FORMULA) {
    return [
      { id: 'r0', price: 2, qty: 3, total: totalR0, plain: '' },
      { id: 'r1', price: 4, qty: 5, total: '', plain: '' },
      { id: 'r2', price: 6, qty: 7, total: '', plain: '' },
      { id: 'r3', price: 8, qty: 9, total: '', plain: '' },
    ];
  }

  function TestGrid(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 300 }}>
        <DataGridPremium
          apiRef={apiRef}
          featureDependencies={{ formula: formulaFeature }}
          columns={columns}
          rows={makeRows()}
          getRowId={(row) => row.id}
          rowSelection={false}
          cellSelection
          cellSelectionFillHandle
          disableVirtualization
          hideFooter
          {...props}
        />
      </div>
    );
  }

  const fillDownShortcut = (cell: HTMLElement) =>
    fireEvent.keyDown(cell, { key: 'd', keyCode: 68, ctrlKey: true });
  const fillRightShortcut = (cell: HTMLElement) =>
    fireEvent.keyDown(cell, { key: 'r', keyCode: 82, ctrlKey: true });

  it('adjusts relative references when filling a formula down (Ctrl+D)', async () => {
    const { user } = render(<TestGrid />);
    // r0 total evaluates price * qty = 2 * 3.
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('6'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // r1 references shift down one row: price(r1) * qty(r1) = 4 * 5.
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('20'));
    const filled = apiRef.current!.getRow('r1')!.total as string;
    expect(filled).to.contain('ROW("r1")');
    expect(filled).not.to.contain('ROW("r0")');
    // The dragged-from cell is never rewritten: it keeps the canonical source.
    expect(apiRef.current!.getRow('r0')!.total).to.equal(PRODUCT_FORMULA);
  });

  it('does not shift absolute (positional) references on fill', async () => {
    const absolute = '=REF(COLUMN_POSITION(1), ROW_POSITION(1))'; // $A$1 → price of row 1
    const { user } = render(<TestGrid rows={makeRows(absolute)} />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('2'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // Positional references stay pinned, so r1 still resolves to price of row 1 = 2.
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('2'));
    expect(apiRef.current!.getRow('r1')!.total).to.equal(absolute);
  });

  // `RANGE_REF` windows address view positions, so the fill rule is the Excel `$`
  // rule: a plain axis shifts by the delta, a `FIXED(...)` axis never moves, and
  // resolution auto-clips whatever the arithmetic produces.
  // Column 2 is `qty` (price=1, qty=2, total=3, plain=4); rows r0..r3 are
  // positions 1..4 with qty 3, 5, 7, 9.
  const qtyWindow = (rowFrom: string, rowTo: string, column = 'COLUMN_FROM(2)') =>
    `=SUM(RANGE_REF(${column}, ${rowFrom}, ${column.replace('FROM', 'TO')}, ${rowTo}))`;

  it('never moves a fully FIXED range window on fill', async () => {
    const fixedWindow = qtyWindow(
      'FIXED(ROW_FROM(1))',
      'FIXED(ROW_TO(4))',
      'FIXED(COLUMN_FROM(2))',
    );
    const { user } = render(<TestGrid rows={makeRows(fixedWindow)} />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('24'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // Every axis is absolute: the filled cell keeps the identical window.
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('24'));
    expect(apiRef.current!.getRow('r1')!.total).to.equal(fixedWindow);
  });

  it('grows a running-total window with a FIXED start and a relative end', async () => {
    const runningTotal = qtyWindow('FIXED(ROW_FROM(1))', 'ROW_TO(1)', 'FIXED(COLUMN_FROM(2))');
    const { user } = render(<TestGrid rows={makeRows(runningTotal)} />);
    // Rows 1..1 of qty = 3.
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('3'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // The anchored start stays at row 1 while the end follows the fill: 3 + 5.
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('8'));
    expect(apiRef.current!.getRow('r1')!.total).to.equal(
      '=SUM(RANGE_REF(FIXED(COLUMN_FROM(2)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(2)), ROW_TO(2)))',
    );
  });

  it('copies the evaluated value when filling into a non-allowFormulas column (Ctrl+R)', async () => {
    const { user } = render(<TestGrid />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('6'));

    // Fill right from `total` (formula) into `plain` (not allowFormulas).
    await user.click(getCell(0, 2));
    fillRightShortcut(getCell(0, 2));

    await waitFor(() => expect(getCell(0, 3).textContent).to.equal('6'));
    // The plain column receives the evaluated value, never a formula string.
    expect(apiRef.current!.getRow('r0')!.plain).to.equal('6');
  });

  it('still adjusts correctly with A1 notation enabled (no double-adjustment)', async () => {
    const { user } = render(<TestGrid formulaA1Notation />);
    // `formulaA1Notation` injects a leftmost row-number column, so `total` is at
    // visual column index 3 (row-number, price, qty, total).
    const totalColIndex = 3;
    await waitFor(() => expect(getCell(0, totalColIndex).textContent).to.equal('6'));

    await user.click(getCell(0, totalColIndex));
    fillDownShortcut(getCell(0, totalColIndex));

    await waitFor(() => expect(getCell(1, totalColIndex).textContent).to.equal('20'));
    const filled = apiRef.current!.getRow('r1')!.total as string;
    expect(filled).to.contain('ROW("r1")');
    expect(filled).not.to.contain('ROW("r0")');
  });

  describe.skipIf(isJSDOM)('Fill via mouse drag', () => {
    /* eslint-disable testing-library/no-unnecessary-act */
    async function simulateFillDrag(sourceCell: HTMLElement, targetCell: HTMLElement) {
      act(() => {
        const rect = sourceCell.getBoundingClientRect();
        fireEvent.mouseDown(sourceCell, { clientX: rect.right - 4, clientY: rect.bottom - 4 });
      });
      act(() => {
        const targetRect = targetCell.getBoundingClientRect();
        document.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: targetRect.x + targetRect.width / 2,
            clientY: targetRect.y + targetRect.height / 2,
            bubbles: true,
          }),
        );
      });
      await act(async () => {
        await new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve as FrameRequestCallback));
        });
      });
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });
    }
    /* eslint-enable testing-library/no-unnecessary-act */

    it('adjusts references for every target row when dragging the handle down', async () => {
      const { user } = render(<TestGrid />);
      await waitFor(() => expect(getCell(0, 2).textContent).to.equal('6'));

      await user.click(getCell(0, 2));
      const handle = document.querySelector(
        `.${gridClasses['cell--withFillHandle']}`,
      )! as HTMLElement;

      await simulateFillDrag(handle, getCell(3, 2));

      await waitFor(() => expect(getCell(1, 2).textContent).to.equal('20'));
      expect(getCell(2, 2).textContent).to.equal('42'); // 6 * 7
      expect(getCell(3, 2).textContent).to.equal('72'); // 8 * 9
      expect(apiRef.current!.getRow('r2')!.total).to.contain('ROW("r2")');
      expect(apiRef.current!.getRow('r3')!.total).to.contain('ROW("r3")');
    });
  });
});
