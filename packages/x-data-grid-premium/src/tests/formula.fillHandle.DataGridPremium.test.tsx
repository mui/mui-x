import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { getCell } from 'test/utils/helperFn';
import { createRenderer, act, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGridPremium, useGridApiRef, gridClasses } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi, GridColDef } from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';

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
  });

  it('keeps the stored source canonical and untouched on the origin cell', async () => {
    const { user } = render(<TestGrid />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('6'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('20'));
    // The dragged-from cell is never rewritten.
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

  it('freezes overshoot references to #REF! when filling past the data', async () => {
    // References the last row (r3); filling down one row overshoots the row set.
    const lastRowRef = '=REF(COLUMN("price"), ROW("r3"))';
    const { user } = render(<TestGrid rows={makeRows(lastRowRef)} />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('8'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('#REF!'));
    expect(apiRef.current!.getRow('r1')!.total).to.contain('ROW_POSITION(5)');
  });

  // `RANGE_REF` windows address view positions, so the fill rule is the Excel `$`
  // rule: a plain axis shifts by the delta, a `FIXED(...)` axis never moves, and
  // resolution auto-clips whatever the arithmetic produces.
  // Column 2 is `qty` (price=1, qty=2, total=3, plain=4); rows r0..r3 are
  // positions 1..4 with qty 3, 5, 7, 9.
  const qtyWindow = (rowFrom: string, rowTo: string, column = 'COLUMN_FROM(2)') =>
    `=SUM(RANGE_REF(${column}, ${rowFrom}, ${column.replace('FROM', 'TO')}, ${rowTo}))`;

  it('shifts a relative range window when filling down (Ctrl+D)', async () => {
    // qty rows 1..4 → 3 + 5 + 7 + 9.
    const { user } = render(<TestGrid rows={makeRows(qtyWindow('ROW_FROM(1)', 'ROW_TO(4)'))} />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('24'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // The window slides one row down to 2..5; the overshooting end clips back to
    // the last data row, so r1 sums qty of r1..r3 = 5 + 7 + 9.
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('21'));
    expect(apiRef.current!.getRow('r1')!.total).to.equal(
      '=SUM(RANGE_REF(COLUMN_FROM(2), ROW_FROM(2), COLUMN_TO(2), ROW_TO(5)))',
    );
  });

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

  it('keeps the arithmetic indexes and clips when a fill pushes the window past the last row', async () => {
    // qty rows 3..4 → 7 + 9.
    const { user } = render(<TestGrid rows={makeRows(qtyWindow('ROW_FROM(3)', 'ROW_TO(4)'))} />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('16'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // Rows 4..5: the stored source keeps the out-of-view index, and resolution
    // clips it to the last data row instead of erroring — qty of r3 = 9.
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('9'));
    expect(getCell(1, 2).textContent).not.to.equal('#REF!');
    expect(apiRef.current!.getRow('r1')!.total).to.equal(
      '=SUM(RANGE_REF(COLUMN_FROM(2), ROW_FROM(4), COLUMN_TO(2), ROW_TO(5)))',
    );
  });

  it('copies an ANCHOR window verbatim on fill — each copy re-anchors to its own row', async () => {
    // "My own row's qty" (total is column 3, qty is column 2).
    const anchoredWindow =
      '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-1)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0))))';
    const { user } = render(<TestGrid rows={makeRows(anchoredWindow)} />);
    await waitFor(() => expect(getCell(0, 2).textContent).to.equal('3'));

    await user.click(getCell(0, 2));
    fillDownShortcut(getCell(0, 2));

    // No arithmetic: the offsets are inherently relative, so the copied text is
    // byte-identical and the window follows the target row (qty of r1 = 5).
    await waitFor(() => expect(getCell(1, 2).textContent).to.equal('5'));
    expect(apiRef.current!.getRow('r1')!.total).to.equal(anchoredWindow);
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
