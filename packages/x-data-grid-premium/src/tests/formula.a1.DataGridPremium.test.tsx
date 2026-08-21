import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnHeaderCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi } from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  rows: [
    { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=price * quantity' },
    { id: 1, item: 'Banana', price: 1, quantity: 5, total: '=price * quantity' },
    { id: 2, item: 'Cherry', price: 4, quantity: 2, total: 8 },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number' },
    { field: 'quantity', type: 'number' },
    { field: 'total', type: 'number', allowFormulas: true, editable: true },
  ],
};

describe('<DataGridPremium /> - Formulas A1 notation', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  // The editable lives in the floating surface portaled into the virtual SCROLLER
  // (it overlays the cell but is not a DOM child of it — nor of the row). Only the
  // focused cell's surface is open at a time, so a document-scoped query is
  // unambiguous; the row/col args are kept for call-site readability.
  function getCellEditable(_rowIndex: number, _colIndex: number) {
    return document.querySelector<HTMLElement>(
      '.MuiDataGrid-formulaEditorSurface [contenteditable]',
    )!;
  }

  // The formula editor is a `contenteditable`, not an `<input>`: it has no
  // `.value` and no `change` event. Set the whole value by replacing the text and
  // firing the `input` event the editor listens to (works in jsdom and chromium).
  function setEditableValue(rowIndex: number, colIndex: number, value: string) {
    const editable = getCellEditable(rowIndex, colIndex);
    editable.textContent = value;
    fireEvent.input(editable);
  }
  describe('A1 notation', () => {
    const LETTER_CLASS = '.MuiDataGrid-formulaColumnHeaderLetter';
    const ROW_NUMBER_FIELD = '__formula_row_number__';

    // With A1 on, the pinned-left row-number column takes data-colindex 0, so the
    // data columns shift right by one: item=1, price=2, quantity=3, total=4.

    describe('prop off (default)', () => {
      it('should not render the row-number column or header letters', async () => {
        await render(<Test />);
        expect(
          apiRef.current!.getAllColumns().some((column) => column.field === ROW_NUMBER_FIELD),
        ).to.equal(false);
        expect(getColumnHeaderCell(0).querySelector(LETTER_CLASS)).to.equal(null);
        // Unchanged data layout: item is the first column.
        expect(getColumnValues(0)).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
      });
    });

    describe('header letters', () => {
      it('should label data columns A, B, C… and skip the row-number column', async () => {
        await render(<Test formulaA1Notation />);
        // colindex 0 is the row-number column: no letter, empty header.
        expect(getColumnHeaderCell(0).querySelector(LETTER_CLASS)).to.equal(null);
        expect(getColumnHeaderCell(1).querySelector(LETTER_CLASS)!.textContent).to.equal('A');
        expect(getColumnHeaderCell(2).querySelector(LETTER_CLASS)!.textContent).to.equal('B');
        expect(getColumnHeaderCell(3).querySelector(LETTER_CLASS)!.textContent).to.equal('C');
        expect(getColumnHeaderCell(4).querySelector(LETTER_CLASS)!.textContent).to.equal('D');
      });
    });

    describe('row-number column', () => {
      it('should show sequential numbers that stay put after a re-sort', async () => {
        await render(<Test formulaA1Notation />);
        expect(getColumnValues(0)).to.deep.equal(['1', '2', '3']);
        expect(getColumnValues(1)).to.deep.equal(['Apple', 'Banana', 'Cherry']);
        expect(getColumnValues(4)).to.deep.equal(['6', '5', '8']);

        await act(async () => apiRef.current!.setSortModel([{ field: 'total', sort: 'asc' }]));

        // Rows move between the numbers; the numbers themselves never travel.
        expect(getColumnValues(0)).to.deep.equal(['1', '2', '3']);
        expect(getColumnValues(1)).to.deep.equal(['Banana', 'Apple', 'Cherry']);
        expect(getColumnValues(4)).to.deep.equal(['5', '6', '8']);
      });

      it('should match the positions ROW_POSITION resolves to', async () => {
        await render(
          <Test
            formulaA1Notation
            rows={[
              {
                id: 0,
                item: 'Apple',
                price: 2,
                quantity: 3,
                top: '=REF(COLUMN("item"), ROW_POSITION(1))',
              },
              {
                id: 1,
                item: 'Banana',
                price: 1,
                quantity: 5,
                top: '=REF(COLUMN("item"), ROW_POSITION(1))',
              },
            ]}
            columns={[
              { field: 'item' },
              { field: 'price', type: 'number' },
              { field: 'quantity', type: 'number' },
              { field: 'top', allowFormulas: true },
            ]}
          />,
        );
        // Row showing number 1 is Apple, and ROW_POSITION(1) resolves to it.
        expect(getColumnValues(0)).to.deep.equal(['1', '2']);
        expect(getColumnValues(4)).to.deep.equal(['Apple', 'Apple']);

        await act(async () => apiRef.current!.setSortModel([{ field: 'item', sort: 'desc' }]));

        // Number 1 now shows Banana — and ROW_POSITION(1) re-binds to it.
        expect(getColumnValues(0)).to.deep.equal(['1', '2']);
        expect(getColumnValues(1)).to.deep.equal(['Banana', 'Apple']);
        expect(getColumnValues(4)).to.deep.equal(['Banana', 'Banana']);
      });

      it('should be excluded from CSV export', async () => {
        await render(<Test formulaA1Notation />);
        const csv = apiRef.current!.getDataAsCsv();
        // The first column of every row is `item`, not an empty row-number cell.
        expect(csv.split('\n')[1].startsWith('Apple')).to.equal(true);
      });
    });

    describe('entry and storage', () => {
      it('should store an A1 formula as canonical, never as A1', async () => {
        const { user } = await render(<Test formulaA1Notation processRowUpdate={(row) => row} />);
        const cell = getCell(0, 4);
        await user.dblClick(cell);
        setEditableValue(0, 4, '=B1');
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();

        // B = price (column 2), row 1 = id 0 → frozen to the stable reference.
        expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
        expect(getColumnValues(4)).to.deep.equal(['2', '5', '8']);
      });

      it('should keep showing the typed A1 text in the editor, not its canonical form', async () => {
        const { user } = await render(<Test formulaA1Notation processRowUpdate={(row) => row} />);
        const cell = getCell(0, 4);
        await user.dblClick(cell);

        // `valueParser` runs on every keystroke and its result is what the user
        // sees — converting A1→canonical there surfaced `=REF(...)` mid-edit.
        setEditableValue(0, 4, '=A2');
        expect(getCellEditable(0, 4).textContent).to.equal('=A2');

        setEditableValue(0, 4, '=A2 + B1');
        expect(getCellEditable(0, 4).textContent).to.equal('=A2 + B1');

        // The freeze to canonical happens at commit, never before.
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();
        const stored = apiRef.current!.getRow(0).total as string;
        expect(stored).to.contain('REF(');
        expect(stored).not.to.contain('A2');
        expect(stored).not.to.contain('B1');
      });

      it('should seed the editor with the A1 rendering of a stored canonical formula', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            rows={[
              {
                id: 0,
                item: 'Apple',
                price: 2,
                quantity: 3,
                total: '=REF(COLUMN("price"), ROW(0))',
              },
            ]}
          />,
        );
        await user.dblClick(getCell(0, 4));
        await waitFor(() => {
          expect(getCellEditable(0, 4).textContent).to.equal('=B1');
        });
      });

      it('should not re-freeze a stored formula on an unchanged commit', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            processRowUpdate={(row) => row}
            rows={[
              {
                id: 0,
                item: 'Apple',
                price: 2,
                quantity: 3,
                total: '=REF(COLUMN("price"), ROW(0))',
              },
            ]}
          />,
        );
        const cell = getCell(0, 4);
        await user.dblClick(cell);
        await waitFor(() => {
          expect(getCellEditable(0, 4).textContent).to.equal('=B1');
        });
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();

        expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
      });

      // The formula-bar demo shape: field names (`q1`, `q2`) that lexically
      // read as A1 cell addresses. The display must escape them as FIELD("…")
      // or the commit transform freezes them into dead cell references.
      describe('field names colliding with A1 addresses', () => {
        const collisionProps: Partial<DataGridPremiumProps> = {
          processRowUpdate: (row) => row,
          rows: [
            { id: 1, product: 'Widgets', q1: 320, q2: 410, total: '=q1 + q2' },
            { id: 2, product: 'Gadgets', q1: 150, q2: 220, total: '=q1 + q2' },
          ],
          columns: [
            { field: 'product' },
            { field: 'q1', type: 'number', editable: true },
            { field: 'q2', type: 'number', editable: true },
            { field: 'total', type: 'number', allowFormulas: true, editable: true },
          ],
        };

        it('should seed the editor with the FIELD("…") escape', async () => {
          const { user } = await render(<Test formulaA1Notation {...collisionProps} />);
          expect(getColumnValues(4)).to.deep.equal(['730', '370']);
          await user.dblClick(getCell(0, 4));
          await waitFor(() => {
            expect(getCellEditable(0, 4).textContent).to.equal('=FIELD("q1") + FIELD("q2")');
          });
        });

        it('should keep the stored formula on an unchanged commit', async () => {
          const { user } = await render(<Test formulaA1Notation {...collisionProps} />);
          await user.dblClick(getCell(0, 4));
          await waitFor(() => {
            expect(getCellEditable(0, 4).textContent).to.equal('=FIELD("q1") + FIELD("q2")');
          });
          fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
          await microtasks();

          // The exact source text survives — the seed guard must outlive
          // `cellEditStop` (the commit re-runs the value setter after it).
          expect(apiRef.current!.getRow(1).total).to.equal('=q1 + q2');
          expect(getColumnValues(4)).to.deep.equal(['730', '370']);
        });

        it('should keep the stored formula on an unchanged blur commit', async () => {
          const { user } = await render(<Test formulaA1Notation {...collisionProps} />);
          await user.dblClick(getCell(0, 4));
          await waitFor(() => {
            expect(getCellEditable(0, 4).textContent).to.equal('=FIELD("q1") + FIELD("q2")');
          });
          await user.click(getCell(1, 1));
          await microtasks();

          expect(apiRef.current!.getRow(1).total).to.equal('=q1 + q2');
          expect(getColumnValues(4)).to.deep.equal(['730', '370']);
        });

        it('should keep referencing the field on an edited commit', async () => {
          const { user } = await render(<Test formulaA1Notation {...collisionProps} />);
          await user.dblClick(getCell(0, 4));
          await waitFor(() => {
            expect(getCellEditable(0, 4).textContent).to.equal('=FIELD("q1") + FIELD("q2")');
          });
          setEditableValue(0, 4, '=FIELD("q1") + FIELD("q2") + 10');
          fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
          await microtasks();

          const stored = apiRef.current!.getRow(1).total as string;
          expect(stored).to.contain('FIELD("q1")');
          expect(stored).not.to.contain('REF(');
          expect(getColumnValues(4)).to.deep.equal(['740', '370']);
        });
      });

      it('should freeze a plain A1 range to ANCHOR offsets and round-trip it through the editor', async () => {
        const { user } = await render(<Test formulaA1Notation processRowUpdate={(row) => row} />);
        const cell = getCell(0, 4);
        await user.dblClick(cell);
        setEditableValue(0, 4, '=SUM(B1:B2)');
        fireEvent.keyDown(getCellEditable(0, 4), { key: 'Enter' });
        await microtasks();

        // Committing cell: `total` at column position 4, row position 1. The
        // plain endpoints store as offsets from it (Sheets model): B = −2,
        // rows 1..2 = 0..+1.
        expect(apiRef.current!.getRow(0).total).to.equal(
          '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(1))))',
        );
        // Prices are [2, 1, 4]: B1 + B2 = 3.
        expect(getColumnValues(4)).to.deep.equal(['3', '5', '8']);

        // Reopening renders the offsets back at the anchor: the typed text.
        await user.dblClick(getCell(0, 4));
        await waitFor(() => {
          expect(getCellEditable(0, 4).textContent).to.equal('=SUM(B1:B2)');
        });
      });
    });

    describe('paste', () => {
      it('should freeze pasted A1 formulas with the Excel fill offset', async () => {
        const { user } = await render(
          <Test formulaA1Notation cellSelection disableRowSelectionOnClick />,
        );
        const cell = getCell(0, 4);
        await user.click(cell);

        const pasteEvent = new Event('paste');
        // @ts-ignore
        pasteEvent.clipboardData = { getData: () => '=B1\n=B1' };
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
        await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
        });
        // The second target shifted its relative row by +1 → frozen to row id 1.
        expect(apiRef.current!.getRow(1).total).to.equal('=REF(COLUMN("price"), ROW(1))');
        expect(getColumnValues(4)).to.deep.equal(['2', '1', '8']);
      });

      it('should anchor the fill offset to the top-left cell even when it is not a formula', async () => {
        const { user } = await render(
          <Test formulaA1Notation cellSelection disableRowSelectionOnClick />,
        );
        const cell = getCell(0, 4);
        await user.click(cell);

        const pasteEvent = new Event('paste');
        // Top-left target is a plain literal — it never reaches the A1 paste
        // transform, so the offset origin must still be this cell, not the
        // formula one row below it.
        // @ts-ignore
        pasteEvent.clipboardData = { getData: () => '5\n=B1' };
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
        await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal(5);
        });
        // Origin is row 0; the formula one row down freezes to row id 1, not id 0.
        expect(apiRef.current!.getRow(1).total).to.equal('=REF(COLUMN("price"), ROW(1))');
      });

      it('should shift the relative axes of a pasted A1 range by the fill offset', async () => {
        const { user } = await render(
          <Test formulaA1Notation cellSelection disableRowSelectionOnClick />,
        );
        const cell = getCell(0, 4);
        await user.click(cell);

        const pasteEvent = new Event('paste');
        // B is `price`: [2, 1, 4].
        // @ts-ignore
        pasteEvent.clipboardData = { getData: () => '=SUM(B1:B2)\n=SUM(B1:B2)' };
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
        await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

        await waitFor(() => {
          // Plain axes freeze to ANCHOR offsets from the committing cell
          // (column `total` at position 4, row position 1): B = 2 → −2,
          // rows 1..2 → 0..+1.
          expect(apiRef.current!.getRow(0).total).to.equal(
            '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(1))))',
          );
        });
        // The second target's literal shifted by the fill offset AND its anchor
        // moved down one row — the deltas cancel, so the stored text is
        // byte-identical to the first target's (offsets copy verbatim).
        expect(apiRef.current!.getRow(1).total).to.equal(
          '=SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(1))))',
        );
        expect(getColumnValues(4)).to.deep.equal(['3', '5', '8']);
      });

      it('should leave the `$` axes of a pasted A1 range at their written position', async () => {
        const { user } = await render(
          <Test formulaA1Notation cellSelection disableRowSelectionOnClick />,
        );
        const cell = getCell(0, 4);
        await user.click(cell);

        const pasteEvent = new Event('paste');
        // @ts-ignore
        pasteEvent.clipboardData = { getData: () => '=SUM($B$1:$B$2)\n=SUM($B$1:B2)' };
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true });
        await act(async () => document.activeElement!.dispatchEvent(pasteEvent));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal(
            '=SUM(RANGE_REF(FIXED(COLUMN_FROM(2)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(2)), FIXED(ROW_TO(2))))',
          );
        });
        // One row down: the `$` start axes stay at their absolute position,
        // the plain end axes freeze to offsets from the target (shifted row 3
        // − anchor row 2 = +1; column 2 − column 4 = −2) — the running-total
        // shape.
        expect(apiRef.current!.getRow(1).total).to.equal(
          '=SUM(RANGE_REF(FIXED(COLUMN_FROM(2)), FIXED(ROW_FROM(1)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(1))))',
        );
        expect(getColumnValues(4)).to.deep.equal(['3', '7', '8']);
      });
    });

    describe('single-pass policy', () => {
      it('should not re-sort a position-dependent column with the prop on', async () => {
        await render(
          <Test
            formulaA1Notation
            rows={[
              { id: 0, item: 'a', price: 30, posVal: '=REF(COLUMN("price"), ROW_POSITION(3))' },
              { id: 1, item: 'b', price: 10, posVal: '=REF(COLUMN("price"), ROW_POSITION(2))' },
              { id: 2, item: 'c', price: 20, posVal: '=REF(COLUMN("price"), ROW_POSITION(1))' },
            ]}
            columns={[
              { field: 'item' },
              { field: 'price', type: 'number' },
              { field: 'posVal', type: 'number', allowFormulas: true },
            ]}
          />,
        );
        // item is colindex 1, posVal colindex 3 (row-number column at 0).
        expect(getColumnValues(3)).to.deep.equal(['20', '10', '30']);

        const sortListener = spy();
        apiRef.current!.subscribeEvent('sortedRowsSet', sortListener);

        await act(async () => apiRef.current!.setSortModel([{ field: 'posVal', sort: 'asc' }]));

        expect(getColumnValues(1)).to.deep.equal(['b', 'a', 'c']);
        expect(getColumnValues(3)).to.deep.equal(['30', '20', '10']);
        expect(sortListener.callCount).to.equal(1);
      });
    });
  });
});
