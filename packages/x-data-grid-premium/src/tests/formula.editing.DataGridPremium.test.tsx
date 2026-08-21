import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { onTestFinished } from 'vitest';
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
describe('<DataGridPremium /> - Formulas editing', () => {
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

  function getCellInput(rowIndex: number, colIndex: number) {
    return getCell(rowIndex, colIndex).querySelector('input')!;
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
  describe('editing', () => {
    it('should seed the editor with the formula source', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
    });

    it('should render the formula editor for formulas even on number columns', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // A number column would otherwise render a number `<input>`; the formula
      // editor is a contenteditable instead.
      expect(getCell(0, 3).querySelector('input')).to.equal(null);
    });

    it('should keep the default editor for plain cells of `allowFormulas` columns', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(2, 3));
      expect(getCellInput(2, 3).type).to.equal('number');
    });

    it('should preserve the formula when the edit is committed without changes', async () => {
      const { user } = await render(<Test processRowUpdate={(newRow) => newRow} />);
      const cell = getCell(0, 3);
      await user.dblClick(cell);
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should preserve the formula when a row edit is committed without changes', async () => {
      const { user } = await render(<Test editMode="row" />);
      const cell = getCell(0, 3);
      await user.dblClick(cell);
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should discard changes on Escape', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + 100');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Escape' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should commit a new formula and re-evaluate', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + quantity');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);
    });

    it('should commit a plain value over a formula', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '42');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal(42);
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.equal(null);
      expect(getColumnValues(3)).to.deep.equal(['42', '5', '8']);
    });

    it('should commit invalid formulas permissively', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=1 +');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=1 +');
      expect(getColumnValues(3)).to.deep.equal(['#ERROR!', '5', '8']);
    });

    it('should open the formula editor when typing `=` on a plain cell', async () => {
      await render(<Test />);
      const cell = getCell(2, 3); // plain value 8 in the number column
      await act(async () => cell.focus());
      fireEvent.keyDown(cell, { key: '=' });
      await microtasks();

      expect(getCellEditable(2, 3)).not.to.equal(null);
    });

    it('should clear a formula when committing an emptied editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(formulaApi().getCellFormula(0, 'total')).to.equal(null);
      expect(formulaApi().getCellFormulaResult(0, 'total')).to.equal(null);
    });

    it('should round-trip an escaped literal through the editor', async () => {
      const { user } = await render(
        <Test rows={[{ id: 0, item: 'Apple', price: 2, quantity: 3, total: "'=not a formula" }]} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal("'=not a formula");
      });

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal("'=not a formula");
      expect(getColumnValues(3)).to.deep.equal(['=not a formula']);
    });

    it('should neglect characters a number column cannot represent, like the default editor', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '12');
      // An appended letter is an insertion the number column cannot represent —
      // the editor neglects it, the way `<input type="number">` does.
      setEditableValue(0, 3, '12a');
      expect(getCellEditable(0, 3).textContent).to.equal('12');

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(apiRef.current!.getRow(0).total).to.equal(12);
    });

    it('should show the typed text, not NaN, after the leading `=` is deleted', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      // Deleting the `=` leaves text the number parser cannot represent: the
      // editor keeps showing exactly what was typed (it used to rewrite itself
      // to `NaN`), and the edit state holds what a native number input would
      // report — null, never NaN.
      setEditableValue(0, 3, 'price * quantity');
      expect(getCellEditable(0, 3).textContent).to.equal('price * quantity');
      expect(formulaApi().state.editRows[0]?.total?.value).to.equal(null);

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(apiRef.current!.getRow(0).total).to.equal(null);
    });

    it('should keep partial numeric text as typed and commit its numeric value', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      // `-` alone parses to null — the editor still shows the typed `-`.
      setEditableValue(0, 3, '-');
      expect(getCellEditable(0, 3).textContent).to.equal('-');
      setEditableValue(0, 3, '-5');
      setEditableValue(0, 3, '-5.');
      expect(getCellEditable(0, 3).textContent).to.equal('-5.');

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(apiRef.current!.getRow(0).total).to.equal(-5);
    });

    it('should preserve trailing decimal zeros while typing', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '0.50');
      // The parser reads 0.5 — the editor must keep the text as typed.
      expect(getCellEditable(0, 3).textContent).to.equal('0.50');

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(apiRef.current!.getRow(0).total).to.equal(0.5);
    });

    it('should allow typing an escaped literal on a number column', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '');
      // A leading `'` may become an escaped literal — never neglected.
      setEditableValue(0, 3, "'=not math");
      expect(getCellEditable(0, 3).textContent).to.equal("'=not math");

      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(apiRef.current!.getRow(0).total).to.equal("'=not math");
      expect(getColumnValues(3)).to.deep.equal(['=not math', '5', '8']);
    });

    it('should not seed the source when the edit starts by typing', async () => {
      await render(<Test />);
      const cell = getCell(0, 3);
      await act(async () => cell.focus());
      fireEvent.keyDown(cell, { key: '5' });
      await microtasks();

      expect(getCellEditable(0, 3).textContent).not.to.equal('=price * quantity');
    });

    it('should pass the formula source to processRowUpdate', async () => {
      const processRowUpdate = spy((newRow) => newRow);
      const { user } = await render(<Test processRowUpdate={processRowUpdate} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + 1');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(processRowUpdate.lastCall.args[0].total).to.equal('=price + 1');
    });

    it('should keep the evaluation consistent when processRowUpdate rejects', async () => {
      const { user } = await render(
        <Test
          processRowUpdate={() => Promise.reject(new Error('Rejected'))}
          onProcessRowUpdateError={() => {}}
        />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + 1');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(apiRef.current!.getCellValue(0, 'total')).to.equal(6);
    });

    it('should restore formulas through undo/redo', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });

      setEditableValue(0, 3, '=price + quantity');
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);

      await act(() => apiRef.current!.history.undo());
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);

      await act(() => apiRef.current!.history.redo());
      expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);
    });
  });

  describe('custom edit cell renderer', () => {
    it('should use a custom renderEditCell even for formula values', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCell(0, 3).querySelector('[data-testid="custom-editor"]')).not.to.equal(null);
      });
    });

    it('should seed the custom editor with the formula source, not the evaluated value', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });
    });

    it('should preserve the formula when a custom editor commits it unchanged', async () => {
      const { user } = await render(
        <Test columns={customEditorColumns} processRowUpdate={(newRow) => newRow} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getColumnValues(3)).to.deep.equal(['6', '5', '8']);
    });

    it('should commit a new formula edited through a custom editor', async () => {
      const { user } = await render(<Test columns={customEditorColumns} />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellInput(0, 3).value).to.equal('=price * quantity');
      });

      fireEvent.change(getCellInput(0, 3), { target: { value: '=price + quantity' } });
      fireEvent.keyDown(getCellInput(0, 3), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
      expect(getColumnValues(3)).to.deep.equal(['5', '5', '8']);
    });

    it('should keep our formula editor for built-in column editors', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3).textContent).to.equal('=price * quantity');
      });
      expect(getCell(0, 3).querySelector('[data-testid="custom-editor"]')).to.equal(null);
    });

    it('should seed the canonical source (not A1) into a custom editor in A1 mode', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          columns={customEditorColumns}
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
        />,
      );
      // A1 on shifts data columns right by one (row-number column at index 0).
      await user.dblClick(getCell(0, 4));
      await waitFor(() => {
        expect(getCellInput(0, 4).value).to.equal('=REF(COLUMN("price"), ROW(0))');
      });
    });

    it('should round-trip the canonical source committed from a custom editor in A1 mode', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          processRowUpdate={(newRow) => newRow}
          columns={customEditorColumns}
          rows={[
            { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=REF(COLUMN("price"), ROW(0))' },
          ]}
        />,
      );
      await user.dblClick(getCell(0, 4));
      await waitFor(() => {
        expect(getCellInput(0, 4).value).to.equal('=REF(COLUMN("price"), ROW(0))');
      });

      fireEvent.keyDown(getCellInput(0, 4), { key: 'Enter' });
      await microtasks();

      expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(0))');
    });
  });

  describe('editor virtualization and scrolling', () => {
    const manyRows = Array.from({ length: 60 }, (_, index) => ({
      id: index,
      item: `Item ${index}`,
      price: index + 1,
      quantity: 2,
      total: index === 0 ? '=price * quantity' : index + 1,
    }));

    function getEditableByRow(_id: number | string) {
      // The editable lives in the scroller-portaled floating surface, not inside
      // the row; only the focused cell's surface is open at a time.
      return document.querySelector<HTMLElement>(
        '.MuiDataGrid-formulaEditorSurface [contenteditable]',
      );
    }

    it('focuses the editor without scrolling the grid into view', async () => {
      // Shadow `focus` on HTMLDivElement (the editable is a div) with a
      // recording wrapper. A plain sinon spy cannot wrap it here: the test
      // environment turns `HTMLElement.prototype.focus` into an accessor.
      const focusCalls: { element: Element; options?: FocusOptions }[] = [];
      const divProto = HTMLDivElement.prototype;
      Object.defineProperty(divProto, 'focus', {
        configurable: true,
        writable: true,
        value(this: HTMLElement, options?: FocusOptions) {
          focusCalls.push({ element: this, options });
          return Object.getPrototypeOf(divProto).focus.call(this, options);
        },
      });
      onTestFinished(() => {
        delete (divProto as Partial<HTMLDivElement>).focus;
      });
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const editable = getCellEditable(0, 3);
      // The browser scrolls a focused element into view by default — during a
      // virtualization remount of the editing cell that would yank the viewport
      // back on every scroll tick. Every editor focus must opt out.
      const editorCalls = focusCalls.filter((call) => call.element === editable);
      expect(editorCalls.length).to.be.greaterThan(0);
      editorCalls.forEach((call) => {
        expect(call.options?.preventScroll).to.equal(true);
      });
    });

    it.skipIf(isJSDOM)(
      'keeps the scroll position when scrolling away from the edited cell',
      async () => {
        const { user } = await render(
          <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
        );
        await user.dblClick(getCell(0, 3));
        await waitFor(() => {
          expect(getCellEditable(0, 3)).not.to.equal(null);
        });
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        // Push the edited row far past the render window (viewport + buffer).
        scroller.scrollTop = 1500;
        // Let the render context update and any focus restoration settle. The
        // remount+refocus race is timing-dependent (headless chromium usually
        // keeps the editor mounted), so this guards the invariant whenever the
        // environment does exercise it; the preventScroll argument itself is
        // pinned deterministically by the focus-spy test above.
        await act(async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 300);
          });
        });
        expect(scroller.scrollTop).to.equal(1500);
        // The editing session survives the excursion.
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      },
    );

    it.skipIf(isJSDOM)('keeps accepting input while the edited cell is out of view', async () => {
      const { user } = await render(
        <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
      scroller.scrollTop = 1500;
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
      });
      // The editor keeps DOM focus while out of view, so typing still lands in
      // the formula (the browser may scroll back to reveal the caret — that is
      // the native, Excel-like behavior and not asserted here).
      await user.keyboard('9');
      await waitFor(() => {
        expect(getEditableByRow(0)!.textContent).to.equal('=price * quantity9');
      });
    });

    it('resumes the caret when the editing cell remounts mid-edit', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      const before = getEditableByRow(0)!;
      // Engage the session: typing mirrors the caret through the input path.
      await user.keyboard('9');
      // A click placing the caret mirrors through the mouseup path (jsdom fires
      // no selectionchange to observe, so the caret is set directly).
      act(() => {
        setCaretOffset(before, 4);
      });
      fireEvent.mouseUp(before);
      expect(formulaApi().caches.formula!.editorSession?.caret).to.equal(4);
      // An arrow-key caret move mirrors through the keyup path.
      act(() => {
        setCaretOffset(before, 6);
      });
      fireEvent.keyUp(before, { key: 'ArrowLeft' });
      expect(formulaApi().caches.formula!.editorSession?.caret).to.equal(6);
      // Remount the editing cell for real — pinning moves it into the pinned
      // section, exactly like virtualization moves it into the virtual-focus
      // slot when the edited row leaves the render window.
      await act(async () => {
        apiRef.current!.setPinnedColumns({ left: ['total'] });
      });
      await waitFor(() => {
        const after = getEditableByRow(0);
        expect(after).not.to.equal(null);
        expect(after).not.to.equal(before);
      });
      const after = getEditableByRow(0)!;
      // The session survived the remount: caret restored, not snapped to the end.
      expect(getCaretOffset(after)).to.equal(6);
      // The suggestion popup does not reopen on its own after the remount.
      expect(document.querySelector('[role="listbox"]')).to.equal(null);
      // Typing continues at the restored caret ("=price| * quantity9").
      await user.keyboard('X');
      await waitFor(() => {
        expect(getEditableByRow(0)!.textContent).to.equal('=priceX * quantity9');
      });
    });

    it('clears the captured session when editing stops', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      // Plant a session as a mid-edit interaction would; committing the edit
      // must clear it so it cannot resume into a later edit.
      formulaApi().caches.formula!.editorSession = {
        id: 0,
        field: 'total',
        engaged: true,
        caret: 2,
        surfaceWidth: null,
        surfaceClamp: null,
        surfaceWrapped: false,
        surfaceHeight: null,
        surfaceHeightClamp: null,
        surfaceFlipped: false,
        surfaceWidthHighWater: null,
        surfaceHeightHighWater: null,
        surfaceClampBasis: null,
      };
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await microtasks();
      expect(formulaApi().caches.formula!.editorSession).to.equal(null);
    });

    it('clears the session when the commit keyup lands after an async processRowUpdate commit', async () => {
      // With an async processRowUpdate the editor stays mounted and focused
      // after `cellEditStop` (which clears the mirror on the Enter keydown), so
      // the Enter keyup re-writes it — the modes-model prune must clear it once
      // the cell finally leaves edit mode.
      const { user } = await render(
        <Test
          processRowUpdate={async (row) => {
            await new Promise((resolve) => {
              setTimeout(resolve, 10);
            });
            return row;
          }}
        />,
      );
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      const editable = getEditableByRow(0)!;
      fireEvent.keyDown(editable, { key: 'Enter' });
      fireEvent.keyUp(editable, { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
      });
      expect(formulaApi().caches.formula!.editorSession).to.equal(null);
    });

    it('clears the session when a row edit stops (no cellEditStop in row edit mode)', async () => {
      const { user } = await render(<Test editMode="row" />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      expect(formulaApi().caches.formula!.editorSession).not.to.equal(null);
      fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
      });
      expect(formulaApi().caches.formula!.editorSession).to.equal(null);
    });

    it('clears the session on a programmatic stopCellEditMode', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(getCellEditable(0, 3)).not.to.equal(null);
      });
      await user.keyboard('9');
      expect(formulaApi().caches.formula!.editorSession).not.to.equal(null);
      await act(async () => {
        apiRef.current!.stopCellEditMode({ id: 0, field: 'total' });
      });
      expect(formulaApi().caches.formula!.editorSession).to.equal(null);
    });
  });
});
