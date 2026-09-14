import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnHeaderCell, microtasks } from 'test/utils/helperFn';
import { DataGridPremium, useGridApiContext, useGridApiRef } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridApi,
  GridColDef,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';
import type { GridFormulaPrivateApi } from '../hooks/features/formula/gridFormulaInterfaces';
import { getCaretOffset, setCaretOffset } from '../components/formulaEditorCaret';

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

/**
 * A minimal user-supplied editor: a plain text input writing straight to the
 * edit state. It edits whatever it is seeded — the source for formula cells.
 */
function CustomFormulaEditor(props: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLInputElement>(null);
  React.useLayoutEffect(() => {
    if (props.hasFocus) {
      ref.current?.focus();
    }
  }, [props.hasFocus]);
  return (
    <input
      ref={ref}
      data-testid="custom-editor"
      value={(props.value as string | undefined) ?? ''}
      onChange={(event) =>
        apiRef.current.setEditCellValue({
          id: props.id,
          field: props.field,
          value: event.target.value,
        })
      }
    />
  );
}

const customEditorColumns: GridColDef[] = [
  { field: 'item' },
  { field: 'price', type: 'number' },
  { field: 'quantity', type: 'number' },
  {
    field: 'total',
    type: 'number',
    allowFormulas: true,
    editable: true,
    renderEditCell: (params) => <CustomFormulaEditor {...params} />,
  },
];
describe('<DataGridPremium /> - Formulas editor surface and highlighting', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  // The formula API methods are private for now.
  // The tests always inject the formula feature, so its private API methods are present.
  const formulaApi = () =>
    unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!) as GridPrivateApiPremium &
      GridFormulaPrivateApi;

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
  describe('reference highlighting', () => {
    const TOKEN_CLASS = '.MuiDataGrid-formulaReferenceToken';
    const OVERLAY_CLASS = '.MuiDataGrid-formulaReferenceOverlay';
    const RECT_CLASS = '.MuiDataGrid-formulaReferenceHighlight';

    const tokens = () => Array.from(document.querySelectorAll<HTMLElement>(TOKEN_CLASS));
    const rects = () => Array.from(document.querySelectorAll<HTMLElement>(RECT_CLASS));

    it('colors each distinct reference token in the editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
      });
      // Distinct targets → distinct palette colors.
      expect(tokens()[0].style.color).to.equal('var(--DataGrid-formulaRefColor-0)');
      expect(tokens()[1].style.color).to.equal('var(--DataGrid-formulaRefColor-1)');
    });

    it('mutes the formula syntax and marks the editor for the monospace font', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      const editable = getCellEditable(0, 3);
      expect(editable.dataset.formula).to.equal('true');
      const syntax = editable.querySelectorAll<HTMLElement>('.MuiDataGrid-formulaSyntaxToken');
      expect(Array.from(syntax).map((span) => span.textContent)).to.deep.equal(['=', '*']);
      // The extra spans never change the text the caret offsets are measured
      // against.
      expect(editable.textContent).to.equal('=price * quantity');
    });

    it('shares one color between a token and its cell outline', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
        expect(rects()).to.have.length(2);
      });
      // `price` is the first token and the first outline — same shared color var.
      expect(rects()[0].style.borderColor).to.equal(tokens()[0].style.color);
    });

    it('draws a single outline for a repeated reference', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      setEditableValue(0, 3, '=price + price');
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
        expect(rects()).to.have.length(1);
      });
    });

    it('never highlights the cell being edited (self-reference)', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      setEditableValue(0, 3, '=total + price');
      await waitFor(() => {
        // Only `price` is colored and outlined; `total` is the edited cell.
        expect(tokens()).to.have.length(1);
        expect(rects()).to.have.length(1);
      });
    });

    it('clears the highlighting when editing stops', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(2);
      });
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Escape' });
      await microtasks();
      expect(document.querySelector(OVERLAY_CLASS)).to.equal(null);
      expect(tokens()).to.have.length(0);
    });

    it('does not highlight a column with a custom editor', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCell(0, 3).querySelector('[data-testid="custom-editor"]')).not.to.equal(null);
      });
      expect(document.querySelector(OVERLAY_CLASS)).to.equal(null);
      expect(tokens()).to.have.length(0);
    });

    it('does not highlight a plain non-formula edit', async () => {
      const { user } = await render(<Test />);
      // Row 2 `total` holds a plain number; double-click opens the number editor.
      await user.dblClick(getCell(2, 3));
      await microtasks();
      expect(document.querySelector(OVERLAY_CLASS)).to.equal(null);
      expect(tokens()).to.have.length(0);
    });

    it('does not highlight a reference to a filtered-out row', async () => {
      const { user } = await render(
        <Test
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(1))' },
            { id: 1, item: 'Banana', price: 1, quantity: 5, total: 5 },
          ]}
          filterModel={{ items: [{ field: 'item', operator: 'equals', value: 'Apple' }] }}
        />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.contain('REF(');
      });
      // Row 1 is filtered out → its cell cannot be resolved → no token, no outline.
      expect(tokens()).to.have.length(0);
      expect(rects()).to.have.length(0);
    });

    it.skipIf(isJSDOM)('aligns a cell outline with the referenced cell', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(2);
      });
      // The first reference (`price`) outlines the price cell of the edited row.
      const priceCell = getCell(0, 1).getBoundingClientRect();
      const outline = rects()[0].getBoundingClientRect();
      expect(Math.abs(outline.left - priceCell.left)).to.be.lessThan(2);
      expect(Math.abs(outline.top - priceCell.top)).to.be.lessThan(2);
      expect(Math.abs(outline.width - priceCell.width)).to.be.lessThan(2);
      expect(Math.abs(outline.height - priceCell.height)).to.be.lessThan(2);
    });

    it.skipIf(isJSDOM)('repositions outlines after a vertical scroll', async () => {
      const manyRows = Array.from({ length: 60 }, (_, index) => ({
        id: index,
        item: `Item ${index}`,
        price: index + 1,
        quantity: 2,
        total: index === 0 ? '=REF(COLUMN("price"), ROW(40))' : index + 1,
      }));
      const { user } = await render(<Test rows={manyRows} autoHeight={false} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(rects()).to.have.length(1);
      });
      apiRef.current!.scrollToIndexes({ rowIndex: 40, colIndex: 1 });
      await waitFor(() => {
        const target = getCell(40, 1).getBoundingClientRect();
        const outline = rects()[0].getBoundingClientRect();
        expect(Math.abs(outline.top - target.top)).to.be.lessThan(2);
      });
    });

    it.skipIf(isJSDOM)(
      'keeps outlines aligned with cells during native scroll (no lag)',
      async () => {
        const manyRows = Array.from({ length: 60 }, (_, index) => ({
          id: index,
          item: `Item ${index}`,
          price: index + 1,
          quantity: 2,
          total: index === 0 ? '=REF(COLUMN("price"), ROW(5))' : index + 1,
        }));
        const { user } = await render(<Test rows={manyRows} autoHeight={false} />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(rects()).to.have.length(1);
        });
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        // Scroll synchronously: a content-space overlay moves with the cell in the
        // same frame (no scroll listener). A JS-repositioned overlay would lag here.
        scroller.scrollTop = 40;
        const cell = getCell(5, 1).getBoundingClientRect();
        const outline = rects()[0].getBoundingClientRect();
        expect(Math.abs(outline.top - cell.top)).to.be.lessThan(2);
        expect(Math.abs(outline.left - cell.left)).to.be.lessThan(2);
      },
    );

    it('colors A1 references in the editor', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
        />,
      );
      // A1 on shifts data columns right by one (row-number column at index 0).
      await user.dblClick(getCell(0, 4));
      await waitFor(() => {
        expect(getCellEditable(0, 4).textContent).to.equal('=B1');
      });
      // The A1 reference `B1` is colored as one token.
      expect(tokens()).to.have.length(1);
      expect(tokens()[0].textContent).to.equal('B1');
      expect(tokens()[0].style.color).to.equal('var(--DataGrid-formulaRefColor-0)');
    });

    // The whole point of the single-layer editor: caret, native selection and the
    // colors share one element, so there is nothing to keep aligned. These run in
    // a real browser — jsdom has no layout, caret geometry or text selection.
    it.skipIf(isJSDOM)('keeps the caret put when typing in the middle of a formula', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // Place the caret right before `quantity` (offset 9) and type a character.
      act(() => setCaretOffset(editable, 9));
      await user.keyboard('z');

      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * zquantity');
      });
      // The character landed at the caret (not the end), and the caret sits just
      // after it — the classic contenteditable "jump to end" bug does not happen.
      expect(getCaretOffset(getCellEditable(0, 3))).to.equal(10);
    });

    it.skipIf(isJSDOM)('neglects real keystrokes a number column cannot represent', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // Replace the formula with a plain number, then type a letter: real key
      // events carry `inputType: 'insertText'`, the letter is neglected and the
      // caret stays put — the native number input's behavior.
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('12');
      await user.keyboard('a');
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('12');
      });
      expect(getCaretOffset(getCellEditable(0, 3))).to.equal(2);

      // Typing valid characters continues naturally after the rejection.
      await user.keyboard('5');
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('125');
      });
    });

    it.skipIf(isJSDOM)('shows a native, colored text selection over a token', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(tokens()).to.have.length(2);
      });

      // Select the first colored token (`price`) natively.
      const token = tokens()[0];
      const range = document.createRange();
      range.selectNodeContents(token);
      const selection = document.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);

      // The selected text IS the colored token text — there is no separate
      // transparent layer and no backdrop mirror.
      expect(selection.toString()).to.equal('price');
      expect(document.querySelector('.MuiDataGrid-formulaReferenceBackdrop')).to.equal(null);
      const transparent = 'rgba(0, 0, 0, 0)';
      expect(getComputedStyle(editable).color).not.to.equal(transparent);
      expect(getComputedStyle(token).color).not.to.equal(transparent);
    });

    it.skipIf(isJSDOM)(
      'aligns the formula to the start edge in a right-aligned column',
      async () => {
        // `total` is `type: 'number'` (right-aligned). A formula must read from the
        // start edge regardless, like a string — not be pushed to the far edge.
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        const editable = getCellEditable(0, 3);
        await waitFor(() => {
          expect(editable.textContent).to.equal('=price * quantity');
        });
        setEditableValue(0, 3, '=price');
        await waitFor(() => {
          expect(tokens()).to.have.length(1);
        });
        // The single short token sits near the start (left) edge of the editor.
        const token = tokens()[0].getBoundingClientRect();
        const box = editable.getBoundingClientRect();
        expect(token.left - box.left).to.be.lessThan(box.width / 2);
      },
    );

    it.skipIf(isJSDOM)('commits on Enter without inserting a newline', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      await user.keyboard('{Enter}');
      await microtasks();

      // The edit committed (the editor unmounted) and no newline was inserted.
      expect(getCellEditable(0, 3)).to.equal(null);
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it.skipIf(isJSDOM)('strips newlines from a pasted multi-line value', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
      // @ts-ignore the editor reads `text/plain` off the clipboard data.
      pasteEvent.clipboardData = { getData: () => 'a\nb' };
      act(() => {
        editable.dispatchEvent(pasteEvent);
      });

      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.contain('ab');
      });
      // The pasted newline never makes it into the single-line editor.
      expect(getCellEditable(0, 3).textContent).not.to.contain('\n');
    });

    it.skipIf(isJSDOM)('commits an IME composition exactly once, on compositionend', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // The committed edit-state value (not the manually-set DOM) is the source of
      // truth here — it changes only when the editor actually commits.
      const editValue = () =>
        (unwrapPrivateAPI(apiRef.current!).state.editRows as Record<string, any>)[0]?.total?.value;
      expect(editValue()).to.equal('=price * quantity');

      // A composition mutates the DOM mid-flight; committing then (which rebuilds the
      // DOM) would abort the composition, so the editor must defer until it ends.
      fireEvent.compositionStart(editable);
      editable.textContent = '=price * quantityあ';
      fireEvent.input(editable);
      // Still composing: the mid-flight input did NOT commit.
      expect(editValue()).to.equal('=price * quantity');

      // compositionend commits the composed text exactly once.
      fireEvent.compositionEnd(editable, { data: 'あ' });
      await waitFor(() => {
        expect(editValue()).to.equal('=price * quantityあ');
      });
      expect(getCellEditable(0, 3).textContent).to.equal('=price * quantityあ');
    });

    it.skipIf(isJSDOM)('shows and accepts a function suggestion', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      const editable = getCellEditable(0, 3);
      await waitFor(() => {
        expect(editable.textContent).to.equal('=price * quantity');
      });

      // Replace the formula with a partial function name.
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('=SU');

      await waitFor(() => {
        const listbox = document.querySelector('[role="listbox"]');
        expect(listbox).not.to.equal(null);
        expect(listbox!.textContent).to.contain('SUM');
      });

      await user.keyboard('{Enter}');

      // Accepting `SUM` inserts `SUM(` and parks the caret inside the parens.
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=SUM(');
      });
      expect(getCaretOffset(getCellEditable(0, 3))).to.equal(5);
    });

    it.skipIf(isJSDOM)(
      'closes the popup on the first Escape and cancels on the second',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        const editable = getCellEditable(0, 3);
        await waitFor(() => {
          expect(editable.textContent).to.equal('=price * quantity');
        });

        await user.keyboard('{Control>}a{/Control}');
        await user.keyboard('=SU');
        await waitFor(() => {
          expect(document.querySelector('[role="listbox"]')).not.to.equal(null);
        });

        // First Escape closes the list but keeps editing.
        await user.keyboard('{Escape}');
        await waitFor(() => {
          expect(document.querySelector('[role="listbox"]')).to.equal(null);
        });
        expect(getCellEditable(0, 3)).not.to.equal(null);

        // Second Escape cancels the edit (no commit of the partial formula).
        await user.keyboard('{Escape}');
        await microtasks();
        expect(getCellEditable(0, 3)).to.equal(null);
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      },
    );
  });

  describe('column resize', () => {
    const RECT_CLASS = '.MuiDataGrid-formulaReferenceHighlight';
    const SEPARATOR_CLASS = '.MuiDataGrid-columnSeparator--resizable';

    const rects = () => Array.from(document.querySelectorAll<HTMLElement>(RECT_CLASS));
    const getSurface = () =>
      document.querySelector<HTMLElement>('.MuiDataGrid-formulaEditorSurface')!;
    // The separator inside header cell `colIndex` resizes that column.
    const separatorFor = (colIndex: number) =>
      getColumnHeaderCell(colIndex).querySelector(SEPARATOR_CLASS)!;

    const expectAligned = (rect: DOMRect, cell: DOMRect) => {
      expect(Math.abs(rect.left - cell.left)).to.be.lessThan(2);
      expect(Math.abs(rect.top - cell.top)).to.be.lessThan(2);
      expect(Math.abs(rect.width - cell.width)).to.be.lessThan(2);
      expect(Math.abs(rect.height - cell.height)).to.be.lessThan(2);
    };

    it('keeps the formula edit active through a resize gesture', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // The resize-ending mouseup lands on the separator — outside any cell —
      // which by stock focus semantics would clear the focus and commit the
      // draft. The formula `canUpdateFocus` veto keeps the edit alive instead.
      const separator = separatorFor(1);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(separator, { clientX: 150 });
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(getCellEditable(0, 3)).not.to.equal(null);
      // Nothing was committed by the gesture.
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it('keeps the formula edit active when the resize mouseup lands off the separator', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // The drag has no pointer capture: past the min/max-width clamp (or with
      // vertical drift below the header) the pointer overshoots the ~10px
      // separator strip and the mouseup lands on a cell. The veto must key on
      // the in-flight resize session, not on the mouseup target.
      const separator = separatorFor(1);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(getCell(1, 1), { clientX: 150 });
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(getCellEditable(0, 3)).not.to.equal(null);
    });

    it('still ends a plain (non-formula) edit on a resize gesture', async () => {
      const { user } = await render(<Test />);
      // Row 2 `total` holds a plain number → the stock number editor renders, no
      // formula edit is active, and the stock focus semantics are preserved.
      await user.dblClick(getCell(2, 3));
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(2, 'total')).to.equal('edit');
      });
      const separator = separatorFor(1);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(separator, { clientX: 150 });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(2, 'total')).to.equal('view');
      });
    });

    it.skipIf(isJSDOM)(
      'keeps the reference outlines on their cells during a live resize',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(rects()).to.have.length(2);
        });
        // Drag the `price` separator +50: `price` widens in place, `quantity`
        // shifts right. State stays stale until pointer-up, so only the live
        // per-event sync can keep the outlines on the moved cells.
        const separator = separatorFor(1);
        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        expectAligned(rects()[0].getBoundingClientRect(), getCell(0, 1).getBoundingClientRect());
        expectAligned(rects()[1].getBoundingClientRect(), getCell(0, 2).getBoundingClientRect());
        fireEvent.mouseUp(separator, { clientX: 150 });
        // The pointer-up state commit re-renders the canonical styles — still
        // aligned (and, with the focus veto, the edit is still alive to show them).
        await waitFor(() => {
          expectAligned(rects()[0].getBoundingClientRect(), getCell(0, 1).getBoundingClientRect());
          expectAligned(rects()[1].getBoundingClientRect(), getCell(0, 2).getBoundingClientRect());
        });
      },
    );

    it.skipIf(isJSDOM)(
      'keeps the floating surface on its cell when a column before it is resized',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        const surfaceBefore = getSurface().getBoundingClientRect();
        const cellBefore = getCell(0, 3).getBoundingClientRect();
        const separator = separatorFor(1);
        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 160, buttons: 1 });
        const surfaceDuring = getSurface().getBoundingClientRect();
        const cellDuring = getCell(0, 3).getBoundingClientRect();
        // Sanity: the drag really moved the editing cell.
        expect(cellDuring.left - cellBefore.left).to.be.greaterThan(50);
        // The surface moved by exactly the same delta, and its width is untouched.
        expect(
          Math.abs(surfaceDuring.left - surfaceBefore.left - (cellDuring.left - cellBefore.left)),
        ).to.be.lessThan(2);
        expect(Math.abs(surfaceDuring.width - surfaceBefore.width)).to.be.lessThan(2);
        fireEvent.mouseUp(separator, { clientX: 160 });
      },
    );

    it.skipIf(isJSDOM)("tracks the editing column's own width during a live resize", async () => {
      // Short formula: no content growth, so the surface width is the cell's
      // width (+1 for the gridline borders) and must track the drag live.
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=1' }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const before = getSurface().getBoundingClientRect();
      const separator = separatorFor(3);
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 140, buttons: 1 });
      const during = getSurface().getBoundingClientRect();
      const cell = getCell(0, 3).getBoundingClientRect();
      expect(during.width - before.width).to.be.greaterThan(30);
      expect(Math.abs(during.width - (cell.width + 1))).to.be.lessThan(2);
      // The start edge stays pinned — only the inline-end follows the drag.
      expect(Math.abs(during.left - before.left)).to.be.lessThan(2);
      fireEvent.mouseUp(separator, { clientX: 140 });
    });
  });

  describe('floating editor surface', () => {
    const SURFACE_SELECTOR = '.MuiDataGrid-formulaEditorSurface';

    function getSurface() {
      return document.querySelector<HTMLElement>(SURFACE_SELECTOR);
    }

    // Wrapped (multi-line) mode: the editor reached its width clamp and switched
    // from one scrolling line to wrapping + block-axis growth.
    function isWrapped() {
      const editable = document.querySelector<HTMLElement>(`${SURFACE_SELECTOR} [contenteditable]`);
      return editable !== null && getComputedStyle(editable).whiteSpace === 'pre-wrap';
    }

    // The top of the editor's first visual line, measured through a range over its
    // first character (the editable has no per-line elements to measure).
    function firstLineTop(editable: HTMLElement) {
      const range = editable.ownerDocument.createRange();
      range.setStart(editable.firstChild!, 0);
      range.setEnd(editable.firstChild!, 1);
      return range.getBoundingClientRect().top;
    }

    // The formula column is NOT last here, so the surface's growth has column
    // gridlines to snap to (the price and quantity column edges).
    const growColumns: GridColDef[] = [
      { field: 'item' },
      { field: 'total', type: 'number', allowFormulas: true, editable: true },
      { field: 'price', type: 'number' },
      { field: 'quantity', type: 'number' },
    ];
    const growRows = [{ id: 0, item: 'Apple', total: '=1', price: 2, quantity: 3 }];

    it('opens a dialog surface portaled into the virtual scroller', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      const surface = getSurface()!;
      expect(surface.getAttribute('role')).to.equal('dialog');
      expect(surface.getAttribute('aria-label')).to.equal('total');
      // Portaled into the scroller, NOT the row: the render zone (which contains
      // the rows) is a stacking context (`translate3d`), so a row-portaled surface
      // could never paint above the reference-highlight overlay — a later scroller
      // child. At scroller level the surface's z-index wins.
      expect(surface.parentElement).to.equal(
        document.querySelector('.MuiDataGrid-virtualScroller'),
      );
      expect(surface.closest('[role="row"]')).to.equal(null);
      expect(getCell(0, 3).contains(surface)).to.equal(false);
      // The in-cell anchor advertises the surface.
      const anchor = getCell(0, 3).querySelector('.MuiDataGrid-formulaEditor')!;
      expect(anchor.getAttribute('aria-expanded')).to.equal('true');
      expect(anchor.getAttribute('aria-controls')).to.equal(surface.id);
    });

    it('derives its geometry from grid state as first-paint CSS', async () => {
      // `=1` fits the cell, so the initial content-fit pass leaves the width alone.
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=1' }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      // Position and width are inline styles computed from the column positions in
      // grid state — there is no positioning engine that could move the surface
      // after paint (the popper-based prototype flashed at the row origin until
      // its async transform landed).
      const surface = getSurface()!;
      const columns = apiRef.current!.getVisibleColumns();
      const cellStart =
        columns[0].computedWidth + columns[1].computedWidth + columns[2].computedWidth;
      expect(surface.style.insetInlineStart).to.equal(`${cellStart}px`);
      expect(surface.style.width).to.equal(`${columns[3].computedWidth + 1}px`);
      // Block geometry: content-space row position below the sticky top container
      // (the reference overlay's own coordinate recipe).
      const { dimensions, rowsMeta } = apiRef.current!.state;
      expect(surface.style.top).to.equal(
        `${dimensions.topContainerHeight + rowsMeta.positions[0]}px`,
      );
      // Single-row fixture: the last row's height comes from the page total.
      expect(surface.style.height).to.equal(
        `${rowsMeta.currentPageTotalHeight - rowsMeta.positions[0] + 1}px`,
      );
    });

    it('mirrors the live draft in the in-cell anchor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      setEditableValue(0, 3, '=1 + 2');
      await waitFor(() => {
        expect(getCell(0, 3).querySelector('.MuiDataGrid-formulaEditor')!.textContent).to.equal(
          '=1 + 2',
        );
      });
    });

    it('keeps editing when a mouseup lands inside the surface without a cell mousedown', async () => {
      // The surface is row-portaled, so the grid's document-mouseup focus logic
      // does not recognize it as part of the editing cell — the formula feature's
      // `canUpdateFocus` pipe processor must keep such a mouseup (e.g. a drag
      // released over the editor) from clearing the focus and stopping the edit.
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      fireEvent.mouseUp(getCellEditable(0, 3));
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(formulaApi().caches.formula!.editorSession).not.to.equal(null);
    });

    it('opens only the focused cell surface in row edit mode and hands it over on Tab', async () => {
      const columns: GridColDef[] = [
        { field: 'item' },
        { field: 'total', type: 'number', allowFormulas: true, editable: true },
        { field: 'price', type: 'number', allowFormulas: true, editable: true },
        { field: 'quantity', type: 'number' },
      ];
      // Both cells hold formulas so both render the formula editor.
      const rows = [{ id: 0, item: 'Apple', total: '=1 + 1', price: '=2', quantity: 3 }];
      const { user } = await render(<Test editMode="row" rows={rows} columns={columns} />);
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(document.querySelectorAll(SURFACE_SELECTOR)).to.have.length(1);
      });
      expect(getSurface()!.getAttribute('aria-label')).to.equal('total');
      // Tab (handled by the grid's row editing) moves the focus — and with it the
      // single open surface — to the next editable cell.
      fireEvent.keyDown(getCellEditable(0, 1), { key: 'Tab' });
      await waitFor(() => {
        expect(getSurface()!.getAttribute('aria-label')).to.equal('price');
      });
      expect(document.querySelectorAll(SURFACE_SELECTOR)).to.have.length(1);
      // The unfocused formula cell keeps showing its live draft in the anchor.
      expect(getCell(0, 1).querySelector('.MuiDataGrid-formulaEditor')!.textContent).to.equal(
        '=1 + 1',
      );
      // Tab back, dispatched on the currently open editable (the `price` cell's):
      // the `total` editable remounts with the caret at the end.
      fireEvent.keyDown(getSurface()!.querySelector<HTMLElement>('[contenteditable]')!, {
        key: 'Tab',
        shiftKey: true,
      });
      await waitFor(() => {
        expect(getSurface()!.getAttribute('aria-label')).to.equal('total');
      });
      expect(getCaretOffset(getCellEditable(0, 1))).to.equal('=1 + 1'.length);
    });

    it.skipIf(isJSDOM)('overlays the edited cell exactly on entry', async () => {
      // `=1` fits the cell: the surface must be exactly cell-sized at open (a
      // longer seeded formula legitimately opens pre-grown to show it in full).
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: '=1' }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      // The surface's interior is flush with the cell: its 1px border paints on
      // the gridlines around the cell, so entering the edit shows no jump.
      const cell = getCell(0, 3).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.left - (cell.left - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.top - (cell.top - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.right - cell.right)).to.be.lessThan(1.5);
      expect(Math.abs(surface.bottom - cell.bottom)).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)('grows to the next column gridline and never shrinks', async () => {
      const { user } = await render(<Test rows={growRows} columns={growColumns} />);
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      // `=1` fits: the surface is exactly cell-sized at open.
      const cell = getCell(0, 1).getBoundingClientRect();
      expect(Math.abs(getSurface()!.getBoundingClientRect().right - cell.right)).to.be.lessThan(
        1.5,
      );
      // Overflow the cell: the inline-end border steps to the NEXT column
      // gridline (the surface now covers the whole neighboring cell).
      setEditableValue(0, 1, '=111111111111');
      await waitFor(() => {
        const surface = getSurface()!.getBoundingClientRect();
        expect(
          Math.abs(surface.right - getCell(0, 2).getBoundingClientRect().right),
        ).to.be.lessThan(1.5);
      });
      // The surface paints opaquely over the covered neighbor.
      const covered = getCell(0, 2).getBoundingClientRect();
      const onTop = document.elementFromPoint(covered.left + 5, covered.top + covered.height / 2);
      expect(getSurface()!.contains(onTop)).to.equal(true);
      // Growing further lands on the following gridline.
      setEditableValue(0, 1, '=111111111111111111111111111');
      await waitFor(() => {
        const surface = getSurface()!.getBoundingClientRect();
        expect(
          Math.abs(surface.right - getCell(0, 3).getBoundingClientRect().right),
        ).to.be.lessThan(1.5);
      });
      // Deleting never shrinks the box mid-edit — its edges must not wobble.
      setEditableValue(0, 1, '=1');
      await microtasks();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.right - getCell(0, 3).getBoundingClientRect().right)).to.be.lessThan(
        1.5,
      );
    });

    it.skipIf(isJSDOM)(
      'clamps the growth at the viewport edge and wraps instead of scrolling',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        const rowHeight = getCell(0, 3).getBoundingClientRect().height;
        // A formula that still fits the horizontal room stays on one line: the
        // wrap is the fallback, not the first move.
        setEditableValue(0, 3, '=11111');
        expect(isWrapped()).to.equal(false);
        expect(getSurface()!.getBoundingClientRect().height).to.be.lessThan(rowHeight + 2);

        setEditableValue(0, 3, `=${'1'.repeat(60)}`);
        // Out of horizontal room, the formula wraps and the box grows by whole
        // lines rather than scrolling the text out of sight.
        await waitFor(() => {
          expect(isWrapped()).to.equal(true);
        });
        const scroller = document
          .querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!
          .getBoundingClientRect();
        const surface = getSurface()!.getBoundingClientRect();
        expect(surface.right).to.be.lessThan(scroller.right + 1);
        // It still grew as far as the viewport allows, on both axes.
        expect(surface.right).to.be.greaterThan(getCell(0, 3).getBoundingClientRect().right + 50);
        expect(surface.height).to.be.greaterThan(rowHeight + 10);
      },
    );

    it.skipIf(isJSDOM)(
      'paints above the reference-highlight rectangles it grows over',
      async () => {
        // The formula references `price`, whose highlight rectangle sits on the
        // cell the surface grows over — the surface must cover the rectangle, not
        // the other way around (regression: the row-portaled surface was trapped
        // in the render zone's stacking context and the overlay painted through
        // the editor).
        const rows = [
          { id: 0, item: 'Apple', total: '=price + 111111111111', price: 2, quantity: 3 },
        ];
        const { user } = await render(<Test rows={rows} columns={growColumns} />);
        await user.dblClick(getCell(0, 1));
        await waitFor(() => {
          expect(getCellEditable(0, 1)).not.to.equal(null);
        });
        // The rectangle over the referenced price cell exists...
        await waitFor(() => {
          expect(
            document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight'),
          ).to.have.length(1);
        });
        // ...and the surface grew over that cell...
        await waitFor(() => {
          const surface = getSurface()!.getBoundingClientRect();
          expect(surface.right).to.be.greaterThan(getCell(0, 2).getBoundingClientRect().left + 20);
        });
        // ...so the topmost element there is the surface, not the overlay rect.
        const covered = getCell(0, 2).getBoundingClientRect();
        const onTop = document.elementFromPoint(
          covered.left + 10,
          covered.top + covered.height / 2,
        );
        expect(getSurface()!.contains(onTop)).to.equal(true);
      },
    );

    it.skipIf(isJSDOM)(
      'reveals the caret at the end of a formula that overflows the box on entry',
      async () => {
        // Far longer than the grid viewport: the surface opens at its clamp,
        // already wrapped. The entry caret goes to the END — and must be revealed
        // (programmatic caret placement gets no native reveal from the browser),
        // which past the line cap means scrolling the wrapped text vertically.
        const longFormula = `=${'1'.repeat(400)}`;
        const { user } = await render(
          <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: longFormula }]} />,
        );
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3).textContent).to.equal(longFormula);
        });
        const editable = getCellEditable(0, 3);
        expect(isWrapped()).to.equal(true);
        expect(editable.scrollHeight).to.be.greaterThan(editable.clientHeight);
        expect(getCaretOffset(editable)).to.equal(longFormula.length);
        // The caret sits inside the visible box, not past its scrolled-out edge.
        await waitFor(() => {
          const caret = document.getSelection()!.getRangeAt(0).getBoundingClientRect();
          const box = editable.getBoundingClientRect();
          expect(caret.top).to.be.greaterThan(box.top - 2);
          expect(caret.bottom).to.be.lessThan(box.bottom + 2);
        });
      },
    );

    it.skipIf(isJSDOM)('moves with the row during native scroll (no repositioning)', async () => {
      const manyRows = Array.from({ length: 60 }, (_, index) => ({
        id: index,
        item: `Item ${index}`,
        price: index + 1,
        quantity: 2,
        total: index === 0 ? '=price * quantity' : index + 1,
      }));
      const { user } = await render(
        <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      const topBefore = getCell(0, 3).getBoundingClientRect().top;
      // Scroll synchronously: the surface is a row child in content space, so it
      // moves with the cell in the same frame. A JS-repositioned popup lags here.
      scroller.scrollTop = 30;
      expect(scroller.scrollTop).to.equal(30);
      const cell = getCell(0, 3).getBoundingClientRect();
      // The scroll took effect — the cell really moved (guards a vacuous pass).
      expect(cell.top).to.be.lessThan(topBefore);
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.top - (cell.top - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.left - (cell.left - 1))).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)(
      'hides and disables pointer events while the edited row is out of the render window',
      async () => {
        const manyRows = Array.from({ length: 60 }, (_, index) => ({
          id: index,
          item: `Item ${index}`,
          price: index + 1,
          quantity: 2,
          total: index === 0 ? '=price * quantity' : index + 1,
        }));
        const { user } = await render(
          <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
        );
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        // Open the suggestion popup: unlike the surface, it is body-portaled and
        // inherits neither the row's opacity nor the surface's pointer-events, so
        // it must close explicitly while the row is hidden. The caret must sit at
        // the end of the typed prefix for the suggestion context to see it.
        const editable = getCellEditable(0, 3);
        editable.textContent = '=SU';
        setCaretOffset(editable, 3);
        fireEvent.input(editable);
        await waitFor(() => {
          expect(document.querySelector('[role="listbox"]')).not.to.equal(null);
        });
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        scroller.scrollTop = 1500;
        // The edited row renders as the zero-size virtual-focus row: `opacity: 0`
        // hides the surface with it (focus preserved); the surface additionally
        // drops pointer events so the invisible box cannot swallow clicks, and
        // the suggestion popup closes.
        await waitFor(() => {
          const surface = getSurface();
          expect(surface).not.to.equal(null);
          expect(getComputedStyle(surface!).pointerEvents).to.equal('none');
        });
        const row = document.querySelector<HTMLElement>('[data-id="0"]')!;
        expect(getComputedStyle(row).opacity).to.equal('0');
        expect(document.querySelector('[role="listbox"]')).to.equal(null);
        // Scrolling back restores visibility and interactivity.
        scroller.scrollTop = 0;
        await waitFor(() => {
          expect(getComputedStyle(getSurface()!).pointerEvents).not.to.equal('none');
        });
      },
    );

    it.skipIf(isJSDOM)(
      'reopens at the exact cell position with the grown, wrapped box when the editing cell remounts',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        // Grow past the wrap clamp, then delete: both grow-only ratchets (width
        // and wrapped height) must keep the grown box — across the remount too,
        // via the session mirror (a content-fit remount would shrink it back to
        // the cell width, and re-deciding at the current scroll could unwrap it).
        setEditableValue(0, 3, `=${'1'.repeat(60)}`);
        await waitFor(() => {
          expect(isWrapped()).to.equal(true);
        });
        setEditableValue(0, 3, '=19');
        await microtasks();
        const widthBefore = getSurface()!.offsetWidth;
        const heightBefore = getSurface()!.getBoundingClientRect().height;
        expect(widthBefore).to.be.greaterThan(getCell(0, 3).getBoundingClientRect().width + 50);
        // Pinning the column mid-edit remounts the editing cell — the same class of
        // remount virtualization causes. The remounted surface must paint at the
        // (now pinned) cell's exact position on its first frame, with the draft,
        // the grown width, and the wrapped height intact.
        await act(async () => {
          apiRef.current!.setPinnedColumns({ left: ['total'] });
        });
        await waitFor(() => {
          // Pinned left: `total` is now the first column.
          const cell = getCell(0, 0).getBoundingClientRect();
          const surface = getSurface();
          expect(surface).not.to.equal(null);
          const surfaceRect = surface!.getBoundingClientRect();
          expect(Math.abs(surfaceRect.left - (cell.left - 1))).to.be.lessThan(1.5);
          expect(Math.abs(surfaceRect.top - (cell.top - 1))).to.be.lessThan(1.5);
        });
        expect(getCellEditable(0, 0).textContent).to.equal('=19');
        expect(Math.abs(getSurface()!.offsetWidth - widthBefore)).to.be.lessThan(2);
        expect(isWrapped()).to.equal(true);
        expect(
          Math.abs(getSurface()!.getBoundingClientRect().height - heightBefore),
        ).to.be.lessThan(2);
      },
    );

    it.skipIf(isJSDOM)('anchors to the inline start and grows leftward in RTL', async () => {
      const rtlTheme = createTheme({ direction: 'rtl' });
      const { user } = await render(
        <ThemeProvider theme={rtlTheme}>
          <div dir="rtl">
            <Test rows={growRows} columns={growColumns} />
          </div>
        </ThemeProvider>,
      );
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      // The inline start in RTL is the RIGHT edge: the surface pins there and
      // never moves it.
      const cell = getCell(0, 1).getBoundingClientRect();
      expect(
        Math.abs(getSurface()!.getBoundingClientRect().right - (cell.right + 1)),
      ).to.be.lessThan(1.5);
      // Growth extends toward the inline end (leftward), landing on the next
      // column gridline.
      setEditableValue(0, 1, '=111111111111');
      await waitFor(() => {
        const surface = getSurface()!.getBoundingClientRect();
        expect(Math.abs(surface.left - getCell(0, 2).getBoundingClientRect().left)).to.be.lessThan(
          1.5,
        );
      });
      // The RTL clamp: growth stops at the viewport's LEFT edge, and the formula
      // wraps beyond it.
      setEditableValue(0, 1, `=${'1'.repeat(120)}`);
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
      });
      const scroller = document
        .querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!
        .getBoundingClientRect();
      expect(getSurface()!.getBoundingClientRect().left).to.be.greaterThan(scroller.left - 1);
    });

    it.skipIf(isJSDOM)('overlays a right-pinned formula cell at its stuck position', async () => {
      // Content is wider than the viewport, so the right-pinned cell's sticky
      // (visual) position diverges from its content-space layout slot — the
      // surface must be measured onto the stuck cell, not the layout slot.
      const wideColumns: GridColDef[] = [
        { field: 'item' },
        { field: 'price', type: 'number' },
        { field: 'quantity', type: 'number' },
        { field: 'extra1' },
        { field: 'extra2' },
        { field: 'total', type: 'number', allowFormulas: true, editable: true },
      ];
      const rows = [
        { id: 0, item: 'Apple', price: 2, quantity: 3, extra1: 'a', extra2: 'b', total: '=1' },
      ];
      const { user } = await render(
        <Test
          rows={rows}
          columns={wideColumns}
          initialState={{ pinnedColumns: { right: ['total'] } }}
        />,
      );
      await user.dblClick(getCell(0, 5));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      const cell = getCell(0, 5).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(Math.abs(surface.left - (cell.left - 1))).to.be.lessThan(1.5);
      expect(Math.abs(surface.top - (cell.top - 1))).to.be.lessThan(1.5);
    });

    it.skipIf(isJSDOM)('stops growing at the right-pinned column seam', async () => {
      const { user } = await render(
        <Test
          rows={growRows}
          columns={growColumns}
          initialState={{ pinnedColumns: { right: ['quantity'] } }}
        />,
      );
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      setEditableValue(0, 1, `=${'1'.repeat(120)}`);
      // The clamp subtracts the pinned section: the surface stops at the seam
      // instead of covering the frozen column, and wraps from there.
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
      });
      const pinned = getCell(0, 3).getBoundingClientRect();
      const surface = getSurface()!.getBoundingClientRect();
      expect(surface.right).to.be.lessThan(pinned.left + 2);
      expect(surface.right).to.be.greaterThan(getCell(0, 1).getBoundingClientRect().right);
    });

    it.skipIf(isJSDOM)(
      'keeps the first line in place as the box grows, and never shrinks it back',
      async () => {
        const { user } = await render(<Test />);
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        setEditableValue(0, 3, '=11');
        await microtasks();
        const singleLineTop = firstLineTop(getCellEditable(0, 3));
        const surfaceTop = getSurface()!.getBoundingClientRect().top;

        setEditableValue(0, 3, `=${'1'.repeat(60)}`);
        await waitFor(() => {
          expect(isWrapped()).to.equal(true);
        });
        // Growth is strictly away from the first line: neither the text already on
        // screen nor the box's block-start moves when a line is added.
        expect(Math.abs(firstLineTop(getCellEditable(0, 3)) - singleLineTop)).to.be.lessThan(1.5);
        expect(Math.abs(getSurface()!.getBoundingClientRect().top - surfaceTop)).to.be.lessThan(
          1.5,
        );
        const grownHeight = getSurface()!.getBoundingClientRect().height;
        expect(grownHeight).to.be.greaterThan(getCell(0, 3).getBoundingClientRect().height + 10);

        // Deleting back to a short formula leaves the box exactly as it is — the
        // block axis ratchets like the inline one, so a keystroke at a wrap
        // boundary can never toggle the box between two heights.
        setEditableValue(0, 3, '=11');
        await microtasks();
        expect(Math.abs(getSurface()!.getBoundingClientRect().height - grownHeight)).to.be.lessThan(
          1.5,
        );
      },
    );

    it.skipIf(isJSDOM)('stops growing at the line cap and scrolls the wrapped text', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const rowHeight = getCell(0, 3).getBoundingClientRect().height;
      setEditableValue(0, 3, `=${'1'.repeat(400)}`);
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
      });
      const editable = getCellEditable(0, 3);
      const lineHeight = parseFloat(getComputedStyle(editable).lineHeight);
      const surface = getSurface()!.getBoundingClientRect();
      // Five visual lines: the row box plus four more line heights, and no more —
      // past that the wrapped text scrolls inside instead of hiding further rows.
      expect(Math.abs(surface.height - (rowHeight + 1 + 4 * lineHeight))).to.be.lessThan(2);
      expect(editable.scrollHeight).to.be.greaterThan(editable.clientHeight);
      const scroller = document
        .querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!
        .getBoundingClientRect();
      expect(surface.bottom).to.be.lessThan(scroller.bottom + 1);
    });

    it.skipIf(isJSDOM)('keeps the line cap when the grid becomes taller mid-edit', async () => {
      function ResizableHeightTest({ height }: { height: number }) {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 600, height }}>
            <DataGridPremium {...baselineProps} apiRef={apiRef} />
          </div>
        );
      }

      const { user, setProps } = await render(<ResizableHeightTest height={300} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      setEditableValue(0, 3, `=${'1'.repeat(400)}`);
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
      });

      const editable = getCellEditable(0, 3);
      const lineHeight = parseFloat(getComputedStyle(editable).lineHeight);
      const rowHeight = getCell(0, 3).getBoundingClientRect().height;
      const cappedHeight = rowHeight + 1 + 4 * lineHeight;
      expect(Math.abs(getSurface()!.getBoundingClientRect().height - cappedHeight)).to.be.lessThan(
        2,
      );

      const initialViewportHeight = apiRef.current!.state.dimensions.viewportInnerSize.height;
      setProps({ height: 600 });
      await waitFor(() => {
        expect(apiRef.current!.state.dimensions.viewportInnerSize.height).to.be.greaterThan(
          initialViewportHeight + 250,
        );
      });
      await waitFor(() => {
        expect(
          Math.abs(getSurface()!.getBoundingClientRect().height - cappedHeight),
        ).to.be.lessThan(2);
      });
      expect(editable.scrollHeight).to.be.greaterThan(editable.clientHeight);
    });

    it.skipIf(isJSDOM)('grows upward for a row with no room below it', async () => {
      const manyRows = Array.from({ length: 30 }, (_, index) => ({
        id: index,
        item: `Item ${index}`,
        price: index + 1,
        quantity: 2,
        total: '=1',
      }));
      await render(<Test rows={manyRows} />);
      const scrollerEl = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      await act(async () => {
        scrollerEl.scrollTop = scrollerEl.scrollHeight;
      });
      await waitFor(() => {
        expect(getCell(29, 3)).not.to.equal(null);
      });
      fireEvent.doubleClick(getCell(29, 3));
      await waitFor(() => {
        expect(getSurface()).not.to.equal(null);
      });
      const cell = getCell(29, 3).getBoundingClientRect();
      setEditableValue(29, 3, `=${'1'.repeat(60)}`);
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
      });
      const surface = getSurface()!.getBoundingClientRect();
      // The last row has nothing below it to grow into, so the box's block-END is
      // welded to the row and it extends upward instead — the only way the whole
      // formula stays visible there.
      expect(Math.abs(surface.bottom - (cell.bottom + 1))).to.be.lessThan(2);
      expect(surface.top).to.be.lessThan(cell.top - 10);
      const scroller = scrollerEl.getBoundingClientRect();
      // +2: the surface's bottom border sits ON the row's gridline, which for the
      // last row is the scroller's own edge (the same 1px seam as the inline axis).
      expect(surface.bottom).to.be.lessThan(scroller.bottom + 2);
      expect(surface.top).to.be.greaterThan(scroller.top - 1);
    });

    it.skipIf(isJSDOM)('does not split a reference identifier mid-word', async () => {
      // A long-named column makes a reference token with no natural break
      // opportunity. Sampling padding lengths walks it across wrap boundaries:
      // the editor may wrap canonical references at spaces, but it must not
      // apply its `overflow-wrap: anywhere` rule inside this identifier. The
      // token's `white-space: pre` rule is boundary-independent, so a spread of
      // samples covers the exhaustive 40–55 sweep.
      const longFieldColumns: GridColDef[] = [
        { field: 'item' },
        { field: 'total', type: 'number', allowFormulas: true, editable: true },
        { field: 'unitPriceInLocalCurrency', type: 'number' },
      ];
      const { user } = await render(
        <Test
          rows={[{ id: 0, item: 'Apple', total: '=1', unitPriceInLocalCurrency: 7 }]}
          columns={longFieldColumns}
        />,
      );
      await user.dblClick(getCell(0, 1));
      await waitFor(() => {
        expect(getCellEditable(0, 1)).not.to.equal(null);
      });
      for (const padding of [40, 44, 48, 52, 55]) {
        setEditableValue(0, 1, `=${'1'.repeat(padding)}+unitPriceInLocalCurrency`);
        // eslint-disable-next-line no-await-in-loop
        await microtasks();
        const token = document.querySelector<HTMLElement>(
          `${SURFACE_SELECTOR} .MuiDataGrid-formulaReferenceToken`,
        );
        expect(token, `padding ${padding}`).not.to.equal(null);
        expect(token!.getClientRects().length, `padding ${padding}`).to.equal(1);
      }
      expect(isWrapped()).to.equal(true);
    });

    it.skipIf(isJSDOM)('moves the suggestion popup below the grown editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const editable = getCellEditable(0, 3);
      const value = `=${'1'.repeat(60)}+SU`;
      editable.textContent = value;
      setCaretOffset(editable, value.length);
      fireEvent.input(editable);
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
        expect(document.querySelector('[role="listbox"]')).not.to.equal(null);
      });
      // popper.js listens to scroll and window resize only — it never observes the
      // anchor's own size — so without an explicit nudge the popup would stay at
      // the height the editor had before it wrapped.
      const panel = document.querySelector<HTMLElement>('[role="listbox"]')!.parentElement!;
      expect(
        Math.abs(panel.getBoundingClientRect().top - editable.getBoundingClientRect().bottom),
      ).to.be.lessThan(12);
    });

    it.skipIf(isJSDOM)('follows the grid when it is resized mid-edit', async () => {
      function ResizableTest({ width }: { width: number }) {
        apiRef = useGridApiRef();
        return (
          <div style={{ width, height: 400 }}>
            <DataGridPremium {...baselineProps} apiRef={apiRef} />
          </div>
        );
      }
      const { user, setProps } = await render(<ResizableTest width={600} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      setEditableValue(0, 3, `=${'1'.repeat(60)}`);
      await waitFor(() => {
        expect(isWrapped()).to.equal(true);
      });
      const scrollerEl = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      const grown = getSurface()!.getBoundingClientRect();
      expect(scrollerEl.scrollWidth).to.equal(scrollerEl.clientWidth);

      // Narrowing the grid must pull the box in with it. Left alone, the box keeps
      // a width that no longer exists: it spills past the grid's edge and stretches
      // the scroller's scrollable width, so the grid itself looks like it grew.
      setProps({ width: 380 });
      await waitFor(() => {
        expect(apiRef.current!.state.dimensions.viewportInnerSize.width).to.be.lessThan(400);
      });
      await waitFor(() => {
        // The columns alone still overflow 380px; what must not happen is the
        // surface adding to that.
        expect(scrollerEl.scrollWidth).to.be.lessThan(
          apiRef.current!.state.dimensions.columnsTotalWidth + 3,
        );
      });
      const narrowed = getSurface()!.getBoundingClientRect();
      expect(narrowed.width).to.be.lessThan(grown.width);
      // Narrower box, same formula: it needs more lines.
      expect(narrowed.height).to.be.greaterThan(grown.height);

      // ...and widening it back restores the box exactly, rather than leaving it
      // cramped until the next keystroke.
      setProps({ width: 700 });
      await waitFor(() => {
        expect(apiRef.current!.state.dimensions.viewportInnerSize.width).to.be.greaterThan(600);
      });
      await waitFor(() => {
        const restored = getSurface()!.getBoundingClientRect();
        expect(Math.abs(restored.width - grown.width)).to.be.lessThan(2);
        expect(Math.abs(restored.height - grown.height)).to.be.lessThan(2);
      });
      expect(scrollerEl.scrollWidth).to.equal(scrollerEl.clientWidth);
    });
  });
});
