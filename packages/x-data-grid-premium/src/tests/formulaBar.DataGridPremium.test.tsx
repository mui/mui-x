import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { platform } from '@base-ui/utils/platform';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, microtasks } from 'test/utils/helperFn';
import {
  DataGridPremium,
  Toolbar,
  gridClasses,
  gridFocusCellSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { FormulaBar, formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi } from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';
import { getSelectionOffsets, setCaretOffset } from '../components/formulaEditorCaret';

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  showToolbar: true,
  slotProps: { toolbar: { formulaBar: true } },
  rows: [
    { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=price * quantity' },
    { id: 1, item: 'Banana', price: 1, quantity: 5, total: '=price * quantity' },
    { id: 2, item: 'Cherry', price: 4, quantity: 2, total: 8 },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number', editable: true },
    { field: 'quantity', type: 'number' },
    { field: 'total', type: 'number', allowFormulas: true, editable: true },
  ],
};

describe('<DataGridPremium /> - Formula bar', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 600, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  function privateApi(): RefObject<GridPrivateApiPremium> {
    return { current: unwrapPrivateAPI(apiRef.current!) };
  }

  function getBar() {
    return document.querySelector<HTMLElement>('.MuiDataGrid-formulaBar');
  }

  function getBarEditable() {
    return getBar()!.querySelector<HTMLDivElement>('[role="combobox"], [role="textbox"]')!;
  }

  function typeInBar(value: string) {
    const editable = getBarEditable();
    editable.textContent = value;
    fireEvent.input(editable);
  }

  function focusBar() {
    act(() => {
      getBarEditable().focus();
    });
  }

  // A real click into the bar, avoiding user-event's caret placement (it
  // mis-targets the offset on a multi-node contenteditable): mousedown +
  // focus + document-level mouseup (the canUpdateFocus veto path), caret at
  // the end.
  function clickIntoBar() {
    const editable = getBarEditable();
    fireEvent.mouseDown(editable);
    act(() => {
      editable.focus();
    });
    fireEvent.mouseUp(editable);
    act(() => {
      setCaretOffset(editable, (editable.textContent ?? '').length);
    });
  }

  function focusCell(id: number, field: string) {
    act(() => {
      apiRef.current!.setCellFocus(id, field);
    });
  }

  describe('rendering', () => {
    it('renders below the default toolbar with slotProps.toolbar.formulaBar', async () => {
      render(<Test />);
      await microtasks();
      expect(getBar()).not.to.equal(null);
      expect(document.querySelector('.MuiDataGrid-toolbar')).not.to.equal(null);
    });

    it('does not render without the flag', async () => {
      render(<Test slotProps={{ toolbar: {} }} />);
      await microtasks();
      expect(getBar()).to.equal(null);
    });

    it('renders nothing when formulas are disabled', async () => {
      render(<Test disableFormulas />);
      await microtasks();
      expect(getBar()).to.equal(null);
    });

    it('can be composed into a custom toolbar', async () => {
      function CustomToolbar() {
        return (
          <Toolbar>
            <FormulaBar data-testid="custom-bar" />
          </Toolbar>
        );
      }
      render(<Test slots={{ toolbar: CustomToolbar }} slotProps={{}} />);
      await microtasks();
      expect(getBar()).not.to.equal(null);
    });
  });

  describe('display', () => {
    it('shows the focused cell content and updates on focus changes', async () => {
      render(<Test />);
      await microtasks();
      // Formula cells show their canonical source.
      focusCell(0, 'total');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      focusCell(1, 'total');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      // Non-formula cells show their plain value.
      focusCell(0, 'price');
      expect(getBarEditable().textContent).to.equal('2');
      focusCell(2, 'total');
      expect(getBarEditable().textContent).to.equal('8');
    });

    it('shows the A1 rendering and the cell address with formulaA1Notation', async () => {
      render(<Test formulaA1Notation />);
      await microtasks();
      focusCell(0, 'total');
      // Same-row references keep their field names in the A1 dialect.
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      const address = getBar()!.querySelector('[aria-label="Active cell"]')!;
      expect(address.textContent).to.equal('D1');
      act(() => {
        apiRef.current!.updateRows([{ id: 2, total: '=REF(COLUMN("price"), ROW(0))' }]);
      });
      focusCell(2, 'total');
      expect(getBarEditable().textContent).to.equal('=B1');
    });

    it('is read-only for a non-editable column', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'item');
      const editable = getBarEditable();
      expect(editable.getAttribute('contenteditable')).to.equal('false');
      expect(editable.getAttribute('aria-readonly')).to.equal('true');
    });
  });

  describe('view-mode editing (draft)', () => {
    it('publishes the draft for reference highlighting, colors its tokens, and mutes its syntax', async () => {
      render(<Test />);
      await microtasks();
      // A plain cell value goes through the same editable and must stay in the UI
      // font, with its punctuation untouched.
      focusCell(0, 'item');
      expect(getBarEditable().dataset.formula).to.equal(undefined);
      expect(getBar()!.querySelectorAll('.MuiDataGrid-formulaSyntaxToken')).to.have.length(0);

      focusCell(2, 'total');
      typeInBar('=price * 2');
      const activeEdit = privateApi().current.state.formula.activeEdit;
      expect(activeEdit).to.deep.equal({ id: 2, field: 'total', draft: '=price * 2' });
      // The bar text shows the draft, the cell keeps its committed value.
      expect(getBarEditable().textContent).to.equal('=price * 2');
      expect(getCell(2, 3).textContent).to.equal('8');
      const tokens = getBar()!.querySelectorAll('.MuiDataGrid-formulaReferenceToken');
      expect(tokens).to.have.length(1);
      expect(tokens[0].textContent).to.equal('price');
      expect(getBarEditable().dataset.formula).to.equal('true');
      const syntax = getBar()!.querySelectorAll('.MuiDataGrid-formulaSyntaxToken');
      expect(Array.from(syntax).map((span) => span.textContent)).to.deep.equal(['=', '*']);
      // The muting never changes the text the caret offsets are measured against.
      expect(getBarEditable().textContent).to.equal('=price * 2');
    });

    it('previews the draft result on the fly, including error results', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=price * 2');
      await waitFor(() => {
        const preview = getBar()!.querySelector('[role="status"]');
        expect(preview?.textContent).to.equal('= 8');
      });
      typeInBar('=1 / 0');
      await waitFor(() => {
        const preview = getBar()!.querySelector('[role="status"]');
        expect(preview?.textContent).to.equal('#DIV/0!');
      });
    });

    it('commits on Enter through processRowUpdate and moves the focus below', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await microtasks();
      focusCell(0, 'total');
      typeInBar('=price * quantity * 2');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity * 2');
      });
      expect(processRowUpdate.mock.calls.length).to.equal(1);
      expect(processRowUpdate.mock.lastCall?.[0].total).to.equal('=price * quantity * 2');
      expect(getCell(0, 3).textContent).to.equal('12');
      expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'total' });
      // The draft is gone — the bar shows the next focused cell.
      expect(getBarEditable().textContent).to.equal('=price * quantity');
    });

    it('commits a plain value through the column parser', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'price');
      typeInBar('7');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).price).to.equal(7);
      });
      // The dependent formula re-evaluated.
      expect(getCell(0, 3).textContent).to.equal('21');
    });

    it('neglects invalid characters typed over a plain number value', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total'); // plain value 8
      focusBar();
      typeInBar('8a');
      expect(getBarEditable().textContent).to.equal('8');
    });

    it('commits what the native number editor would for leftover non-numeric text', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      // Deleting the `=` leaves text the number column cannot represent — the
      // commit stores what a native number input would report (empty → null),
      // never NaN.
      typeInBar('price * quantity');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).total).to.equal(null);
      });
    });

    it('commits on Tab and moves the focus right', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'price');
      typeInBar('9');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Tab' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).price).to.equal(9);
      });
      expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'quantity' });
    });

    it('does not commit when Enter or Tab belongs to an IME composition', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'price');
      typeInBar('9');
      focusBar();
      fireEvent.compositionStart(getBarEditable());
      fireEvent.keyDown(getBarEditable(), { key: 'Enter', keyCode: 229, isComposing: true });
      fireEvent.keyDown(getBarEditable(), { key: 'Tab', keyCode: 229, isComposing: true });
      await microtasks();
      expect(apiRef.current!.getRow(0).price).to.equal(2);
      expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'price' });
      expect(getBarEditable().textContent).to.equal('9');
    });

    it('does not discard the draft when Escape cancels an IME composition', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      typeInBar('=1 + 1');
      focusBar();
      fireEvent.compositionStart(getBarEditable());
      fireEvent.keyDown(getBarEditable(), { key: 'Escape', keyCode: 229, isComposing: true });
      await microtasks();
      // The DOM is not rebuilt during a composition: the published draft is what tells.
      expect(privateApi().current.state.formula.activeEdit?.draft).to.equal('=1 + 1');
      expect(getBarEditable().textContent).to.equal('=1 + 1');
    });

    it('discards the draft on Escape', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      typeInBar('=1 + 1');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Escape' });
      await microtasks();
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      expect(privateApi().current.state.formula.activeEdit).to.equal(null);
    });

    it('commits a dirty draft when the bar blurs', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=price + 1');
      fireEvent.blur(getBarEditable());
      await waitFor(() => {
        expect(apiRef.current!.getRow(2).total).to.equal('=price + 1');
      });
    });

    it('commits a dirty draft to the previous cell when the focus moves to another cell', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=price + 2');
      focusCell(0, 'item');
      await waitFor(() => {
        expect(apiRef.current!.getRow(2).total).to.equal('=price + 2');
      });
      expect(getBarEditable().textContent).to.equal('Apple');
    });

    it('creates a single undo step for a bar commit', async () => {
      render(<Test />);
      await microtasks();
      // Drain the mount cascade's debounced history validation before the
      // commit: it would otherwise fire between the history push and the
      // 50ms-batched row flush and judge the fresh item against the
      // not-yet-updated row.
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 0);
        });
      });
      focusCell(2, 'total');
      typeInBar('=price * 5');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(2).total).to.equal('=price * 5');
      });
      await act(async () => {
        await apiRef.current!.history.undo();
      });
      await waitFor(() => {
        expect(apiRef.current!.getRow(2).total).to.equal(8);
      });
    });
  });

  describe('edit-mode mirror', () => {
    it('mirrors the live cell edit into the bar', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      act(() => {
        apiRef.current!.setEditCellValue({ id: 0, field: 'total', value: '=price * 9' });
      });
      await microtasks();
      expect(getBarEditable().textContent).to.equal('=price * 9');
    });

    it('writes bar edits into the cell edit session', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      typeInBar('=quantity + 1');
      await microtasks();
      const editState = privateApi().current.state.editRows[0]?.total;
      expect(editState?.value).to.equal('=quantity + 1');
      // Enter commits the edit session.
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).total).to.equal('=quantity + 1');
      });
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
    });

    it('cancels the edit session on Escape without committing', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      typeInBar('=quantity + 5');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Escape' });
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it('neglects characters the number column cannot represent', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      focusBar();
      typeInBar('12');
      // The appended letter is an insertion a number column cannot hold — the
      // bar neglects it, like the column's own `<input type="number">` would.
      typeInBar('12a');
      expect(getBarEditable().textContent).to.equal('12');
      expect(privateApi().current.state.editRows[0]?.total?.value).to.equal(12);
    });

    it('shows the typed text, not NaN, when the leading `=` is deleted', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      focusBar();
      typeInBar('price * quantity');
      expect(getBarEditable().textContent).to.equal('price * quantity');
      // The edit state holds what a native number input would report for text
      // it cannot represent — null, never NaN.
      expect(privateApi().current.state.editRows[0]?.total?.value).to.equal(null);
    });

    it('keeps the cell edit alive when a bare mouseup lands inside the bar', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      // A mouseup with no recorded cell mousedown (e.g. a click released over
      // the bar) reaches the document click handler — the canUpdateFocus veto
      // must keep the focus, and with it the edit, alive.
      fireEvent.mouseUp(getBarEditable());
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'total' });
    });
  });

  describe('reference picking', () => {
    const PICKING_CLASS = gridClasses['root--formulaReferencePicking'];
    const RECT_CLASS = 'MuiDataGrid-formulaReferenceHighlight';
    const PENDING_CLASS = 'MuiDataGrid-formulaReferenceHighlight--pending';

    const isPickingClassOn = () =>
      document.querySelector(`.${gridClasses.root}`)!.classList.contains(PICKING_CLASS);
    const rects = () => document.querySelectorAll(`.${RECT_CLASS}`);
    const pendingRects = () => document.querySelectorAll(`.${PENDING_CLASS}`);
    // By field: the A1 notation adds a row number column, which shifts the column indexes.
    const cellOf = (id: number, field: string) => apiRef.current!.getCellElement(id, field)!;
    const getCellEditable = () =>
      document.querySelector<HTMLElement>('.MuiDataGrid-formulaEditorSurface [contenteditable]');

    /**
     * Sets the text of the focused bar and puts the caret at `caret` (the end by default).
     */
    function typeInFocusedBar(text: string, caret = text.length) {
      typeInBar(text);
      const editable = getBarEditable();
      act(() => setCaretOffset(editable, caret));
      // Typing ends with the release of the key, which is when the editable reads the caret.
      fireEvent.keyUp(editable, { key: text.slice(-1) });
    }

    /**
     * Focuses the Total cell of the row, then the bar, and replaces the text of the bar.
     */
    function draftInBar(id: number, text: string, caret?: number) {
      focusCell(id, 'total');
      clickIntoBar();
      typeInFocusedBar(text, caret);
    }

    /**
     * Starts editing the Total cell of the row, moves the focus to the bar and
     * replaces the text of the bar.
     */
    async function mirrorInBar(id: number, text: string, caret?: number) {
      focusCell(id, 'total');
      act(() => {
        apiRef.current!.startCellEditMode({ id, field: 'total' });
      });
      await waitFor(() => {
        expect(getCellEditable()).not.to.equal(null);
      });
      clickIntoBar();
      typeInFocusedBar(text, caret);
    }

    describe.each([
      { dialect: 'A1 notation', a1Notation: true, otherRowPrice: 'B2', otherRowQuantity: 'C3' },
      {
        dialect: 'canonical',
        a1Notation: false,
        otherRowPrice: 'REF(COLUMN("price"), ROW(1))',
        otherRowQuantity: 'REF(COLUMN("quantity"), ROW(2))',
      },
    ])('draft, $dialect', ({ a1Notation, otherRowPrice, otherRowQuantity }) => {
      it('writes a reference to the clicked cell into the draft and keeps the focus', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=10+');
        await user.click(cellOf(1, 'price'));

        expect(getBarEditable().textContent).to.equal(`=10+${otherRowPrice}`);
        expect(document.activeElement).to.equal(getBarEditable());
        // Nothing is committed, and the grid focus stays on the cell of the draft.
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'total' });
        expect(privateApi().current.state.formula.activeEdit?.draft).to.equal(
          `=10+${otherRowPrice}`,
        );
      });

      it('writes the range of a drag into the draft and keeps the focus', async () => {
        render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=SUM(');
        fireEvent.mouseDown(cellOf(1, 'price'));
        fireEvent.mouseOver(cellOf(2, 'quantity'));
        fireEvent.mouseUp(cellOf(2, 'quantity'));

        // The draft is the formula of D1: B2 is 2 columns to its left and 1 row below.
        const range = a1Notation
          ? 'B2:C3'
          : 'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(2)))';
        expect(getBarEditable().textContent).to.equal(`=SUM(${range}`);
        expect(document.activeElement).to.equal(getBarEditable());
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'total' });
        expect(pendingRects()).to.have.length(1);
      });

      it('extends the picked reference with Shift+click and adds one with Ctrl/Cmd+click', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=SUM(');
        await user.click(cellOf(1, 'price'));
        const shiftTarget = cellOf(2, 'quantity');
        fireEvent.mouseDown(shiftTarget, { shiftKey: true });
        fireEvent.mouseUp(shiftTarget, { shiftKey: true });
        fireEvent.click(shiftTarget, { shiftKey: true });
        const appendKey = platform.os.mac ? { metaKey: true } : { ctrlKey: true };
        const appendTarget = cellOf(0, 'price');
        fireEvent.mouseDown(appendTarget, appendKey);
        fireEvent.mouseUp(appendTarget, appendKey);
        fireEvent.click(appendTarget, appendKey);

        const range = a1Notation
          ? 'B2:C3'
          : 'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(2)))';
        expect(getBarEditable().textContent).to.equal(`=SUM(${range}, price`);
        expect(document.activeElement).to.equal(getBarEditable());
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      });

      it('replaces the reference of the previous click', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=SUM(');
        await user.click(cellOf(1, 'price'));
        await user.click(cellOf(2, 'quantity'));

        expect(getBarEditable().textContent).to.equal(`=SUM(${otherRowQuantity}`);
        expect(document.activeElement).to.equal(getBarEditable());
      });

      it('writes the field name for a cell of the row of the formula', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=2*');
        await user.click(cellOf(0, 'price'));

        expect(getBarEditable().textContent).to.equal('=2*price');
      });

      it('replaces the reference the caret is on', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        // The bar shows `=price * quantity`, the caret is at its end, no draft yet.
        focusCell(0, 'total');
        clickIntoBar();
        fireEvent.keyUp(getBarEditable(), { key: 'End' });
        await user.click(cellOf(2, 'quantity'));

        expect(getBarEditable().textContent).to.equal(`=price * ${otherRowQuantity}`);
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      });

      it('commits the picked reference with Enter', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=');
        await user.click(cellOf(1, 'price'));
        fireEvent.keyDown(getBarEditable(), { key: 'Enter' });

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(1))');
        });
        expect(cellOf(0, 'total').textContent).to.equal('1');
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'total' });
      });

      it('discards the picked reference with Escape', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        draftInBar(0, '=');
        await user.click(cellOf(1, 'price'));
        fireEvent.keyDown(getBarEditable(), { key: 'Escape' });

        expect(getBarEditable().textContent).to.equal('=price * quantity');
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
        expect(privateApi().current.caches.formula!.referencePick.pending).to.equal(null);
      });
    });

    describe('draft, clicks that are not picks', () => {
      it('commits the draft when the caret is not where a reference fits', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        draftInBar(0, '=1+1');
        await user.click(cellOf(1, 'price'));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=1+1');
        });
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'price' });
        expect(getBarEditable().textContent).to.equal('1');
      });

      it('commits the draft when the prop is off', async () => {
        const { user } = render(<Test />);
        await microtasks();
        draftInBar(0, '=10+');
        expect(isPickingClassOn()).to.equal(false);
        await user.click(cellOf(1, 'price'));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=10+');
        });
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'price' });
      });

      it('commits the draft of a column without formulas', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        focusCell(0, 'price');
        clickIntoBar();
        typeInFocusedBar('7');
        expect(isPickingClassOn()).to.equal(false);
        await user.click(cellOf(1, 'quantity'));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).price).to.equal(7);
        });
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'quantity' });
      });

      it('moves the focus when the bar is read-only', async () => {
        const { user } = render(<Test formulaReferencePicking isCellEditable={() => false} />);
        await microtasks();
        focusCell(0, 'total');
        // A read-only bar takes the focus in jsdom only; a browser leaves it where it is.
        clickIntoBar();
        expect(isPickingClassOn()).to.equal(false);
        await user.click(cellOf(1, 'price'));

        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'price' });
        expect(getBarEditable().textContent).to.equal('1');
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      });

      it('commits the draft on a click on the cell of the draft', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        draftInBar(0, '=10+');
        await user.click(cellOf(0, 'total'));

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=10+');
        });
      });
    });

    describe('draft, grid state', () => {
      it('does not change the row selection or start an edit', async () => {
        const onRowSelectionModelChange = vi.fn();
        const onCellEditStart = vi.fn();
        const { user } = render(
          <Test
            formulaReferencePicking
            onRowSelectionModelChange={onRowSelectionModelChange}
            onCellEditStart={onCellEditStart}
          />,
        );
        await microtasks();
        draftInBar(0, '=');
        await user.dblClick(cellOf(1, 'price'));

        expect(onRowSelectionModelChange.mock.calls.length).to.equal(0);
        expect(onCellEditStart.mock.calls.length).to.equal(0);
        expect(apiRef.current!.getCellMode(1, 'price')).to.equal('view');
        expect(document.activeElement).to.equal(getBarEditable());
      });

      it('starts over with the next draft', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation />);
        await microtasks();
        draftInBar(0, '=');
        await user.click(cellOf(1, 'price'));
        fireEvent.keyDown(getBarEditable(), { key: 'Escape' });

        // The same text again: the reference of the discarded draft is not pending any more.
        draftInBar(0, '=B2');
        await waitFor(() => {
          expect(rects()).to.have.length(1);
        });
        expect(pendingRects()).to.have.length(0);
      });
    });

    describe('draft, visual feedback', () => {
      it('marks the picked reference until something is typed', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        draftInBar(0, '=SUM(');
        expect(isPickingClassOn()).to.equal(true);
        expect(rects()).to.have.length(0);

        // The canonical text does not parse yet: the rectangle comes from the pick.
        await user.click(cellOf(1, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });
        expect(rects()).to.have.length(1);
        expect(isPickingClassOn()).to.equal(true);

        typeInFocusedBar('=SUM(REF(COLUMN("price"), ROW(1)))');
        await waitFor(() => {
          expect(pendingRects()).to.have.length(0);
        });
        expect(rects()).to.have.length(1);
        expect(isPickingClassOn()).to.equal(false);
      });

      it('is removed when the draft is discarded', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        draftInBar(0, '=SUM(');
        await user.click(cellOf(1, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });
        fireEvent.keyDown(getBarEditable(), { key: 'Escape' });

        await waitFor(() => {
          expect(rects()).to.have.length(0);
        });
        expect(isPickingClassOn()).to.equal(false);
      });

      it('is removed when the draft is committed', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        draftInBar(0, '=');
        await user.click(cellOf(1, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });
        fireEvent.keyDown(getBarEditable(), { key: 'Enter' });

        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(1))');
        });
        expect(rects()).to.have.length(0);
        expect(isPickingClassOn()).to.equal(false);
      });
    });

    describe.each([
      { dialect: 'A1 notation', a1Notation: true, otherRowPrice: 'B2', otherRowQuantity: 'C3' },
      {
        dialect: 'canonical',
        a1Notation: false,
        otherRowPrice: 'REF(COLUMN("price"), ROW(1))',
        otherRowQuantity: 'REF(COLUMN("quantity"), ROW(2))',
      },
    ])('mirror, $dialect', ({ a1Notation, otherRowPrice, otherRowQuantity }) => {
      it('writes the reference into the cell edit and keeps it open', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        await mirrorInBar(0, '=10+');
        await user.click(cellOf(1, 'price'));

        expect(getBarEditable().textContent).to.equal(`=10+${otherRowPrice}`);
        expect(privateApi().current.state.editRows[0]?.total?.value).to.equal(
          `=10+${otherRowPrice}`,
        );
        await waitFor(() => {
          expect(getCellEditable()!.textContent).to.equal(`=10+${otherRowPrice}`);
        });
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
        expect(document.activeElement).to.equal(getBarEditable());
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'total' });
      });

      it('replaces the reference of the previous click', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        await mirrorInBar(0, '=');
        await user.click(cellOf(1, 'price'));
        await user.click(cellOf(2, 'quantity'));

        expect(getBarEditable().textContent).to.equal(`=${otherRowQuantity}`);
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      });

      it('commits the picked reference with Enter', async () => {
        const { user } = render(<Test formulaReferencePicking formulaA1Notation={a1Notation} />);
        await microtasks();
        await mirrorInBar(0, '=');
        await user.click(cellOf(1, 'price'));
        fireEvent.keyDown(getBarEditable(), { key: 'Enter' });

        await waitFor(() => {
          expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
        });
        expect(apiRef.current!.getRow(0).total).to.equal('=REF(COLUMN("price"), ROW(1))');
      });
    });

    describe('mirror', () => {
      it('marks the picked reference, and clears it when the edit is cancelled', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        await mirrorInBar(0, '=SUM(');
        expect(isPickingClassOn()).to.equal(true);
        await user.click(cellOf(1, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });

        fireEvent.keyDown(getBarEditable(), { key: 'Escape' });
        await waitFor(() => {
          expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
        });
        expect(rects()).to.have.length(0);
        expect(isPickingClassOn()).to.equal(false);
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
      });

      it('ends the edit when the caret is not where a reference fits', async () => {
        const { user } = render(<Test formulaReferencePicking />);
        await microtasks();
        await mirrorInBar(0, '=1+1');
        await user.click(cellOf(1, 'price'));

        await waitFor(() => {
          expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
        });
        expect(apiRef.current!.getRow(0).total).to.equal('=1+1');
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'price' });
      });

      it('ends the edit when the prop is off', async () => {
        const { user } = render(<Test />);
        await microtasks();
        await mirrorInBar(0, '=10+');
        await user.click(cellOf(1, 'price'));

        await waitFor(() => {
          expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
        });
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 1, field: 'price' });
      });

      it('is not a destination of picked references while read-only in row edit mode', async () => {
        render(<Test formulaReferencePicking editMode="row" />);
        await microtasks();
        const barIsRegistered = () =>
          Array.from(privateApi().current.caches.formula!.referencePick.editables).some(
            (editable) => editable.kind === 'bar',
          );
        focusCell(0, 'total');
        expect(barIsRegistered()).to.equal(true);

        act(() => {
          apiRef.current!.startRowEditMode({ id: 0, fieldToFocus: 'total' });
        });
        await waitFor(() => {
          expect(getCellEditable()).not.to.equal(null);
        });
        expect(getBarEditable().getAttribute('aria-readonly')).to.equal('true');
        expect(barIsRegistered()).to.equal(false);
      });
    });

    // A real pointer: the browser moves the focus on mousedown unless the grid prevents it.
    describe.skipIf(isJSDOM)('real pointer events', () => {
      async function realClick(element: Element) {
        const { userEvent } = await import('vitest/browser');
        const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
        globalThis.IS_REACT_ACT_ENVIRONMENT = false;
        try {
          await userEvent.click(element);
        } finally {
          globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
        }
      }

      it('keeps the DOM focus and the caret in the bar after a pick into a draft', async () => {
        render(<Test formulaReferencePicking formulaA1Notation />);
        await microtasks();
        draftInBar(0, '=10+');
        await realClick(cellOf(1, 'price'));

        await waitFor(() => {
          expect(getBarEditable().textContent).to.equal('=10+B2');
        });
        expect(document.activeElement).to.equal(getBarEditable());
        expect(getSelectionOffsets(getBarEditable())).to.deep.equal({ start: 6, end: 6 });
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');

        await realClick(cellOf(2, 'quantity'));
        await waitFor(() => {
          expect(getBarEditable().textContent).to.equal('=10+C3');
        });
        expect(document.activeElement).to.equal(getBarEditable());
        expect(gridFocusCellSelector(privateApi())).to.deep.equal({ id: 0, field: 'total' });
      });

      it('keeps the cell edit open after a pick from the bar', async () => {
        render(<Test formulaReferencePicking formulaA1Notation />);
        await microtasks();
        await mirrorInBar(0, '=10+');
        await realClick(cellOf(1, 'price'));

        await waitFor(() => {
          expect(getBarEditable().textContent).to.equal('=10+B2');
        });
        expect(document.activeElement).to.equal(getBarEditable());
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
        expect(getCellEditable()!.textContent).to.equal('=10+B2');
      });

      it('draws the pending rectangle over the picked cell', async () => {
        render(<Test formulaReferencePicking />);
        await microtasks();
        draftInBar(0, '=SUM(');
        await realClick(cellOf(1, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });

        const rect = pendingRects()[0].getBoundingClientRect();
        const target = cellOf(1, 'price').getBoundingClientRect();
        expect(rect.left).to.be.closeTo(target.left, 1);
        expect(rect.top).to.be.closeTo(target.top, 1);
        expect(rect.width).to.be.closeTo(target.width, 1);
        expect(rect.height).to.be.closeTo(target.height, 1);
        expect(getComputedStyle(pendingRects()[0]).borderTopStyle).to.equal('solid');
      });
    });
  });

  describe('browser interactions', () => {
    const manyRows = Array.from({ length: 60 }, (_, index) => ({
      id: index,
      item: `Item ${index}`,
      price: index + 1,
      quantity: 2,
      total: index === 0 ? '=price * quantity' : index + 1,
    }));

    it.skipIf(isJSDOM)('continues a cell edit after clicking into the bar', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(getCell(0, 3));
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      });
      clickIntoBar();
      // The edit survives the click (the canUpdateFocus veto) and the bar
      // mirrors the session.
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      // Keep typing in the bar: the edit session receives the text and the
      // in-cell editor mirrors it live.
      await user.keyboard(' + 1');
      await waitFor(() => {
        expect(privateApi().current.state.editRows[0]?.total?.value).to.equal(
          '=price * quantity + 1',
        );
      });
      expect(document.querySelector('.MuiDataGrid-formulaEditorSurface')?.textContent).to.contain(
        '=price * quantity + 1',
      );
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity + 1');
      });
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('view');
    });

    it.skipIf(isJSDOM)(
      'keeps the DOM focus in the bar while the focused cell leaves and re-enters the render window',
      async () => {
        const { user } = await render(
          <Test rows={manyRows} autoHeight={false} disableVirtualization={false} />,
        );
        await user.click(getCell(0, 3));
        clickIntoBar();
        await user.keyboard(' + 2');
        const editable = getBarEditable();
        expect(document.activeElement).to.equal(editable);
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        scroller.scrollTop = 1500;
        await waitFor(() => {
          expect(scroller.scrollTop).to.equal(1500);
        });
        // The focused cell's keep-alive remount must not pull the DOM focus out
        // of the bar (GridCell's focus sync consults the canUpdateFocus veto).
        expect(document.activeElement).to.equal(editable);
        scroller.scrollTop = 0;
        await waitFor(() => {
          expect(scroller.scrollTop).to.equal(0);
        });
        expect(document.activeElement).to.equal(editable);
        expect(getBarEditable().textContent).to.equal('=price * quantity + 2');
        await user.keyboard('{Enter}');
        await waitFor(() => {
          expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity + 2');
        });
      },
    );

    it.skipIf(isJSDOM)('offers suggestions and accepts them in the bar', async () => {
      const { user } = await render(<Test />);
      await user.click(getCell(2, 3));
      await user.click(getBarEditable());
      await user.keyboard('{Control>}a{/Control}=SU');
      await waitFor(() => {
        expect(document.querySelector('[role="listbox"]')).not.to.equal(null);
      });
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getBarEditable().textContent).to.equal('=SUM(');
      });
      // The accept spliced the token — no commit happened.
      expect(apiRef.current!.getRow(2).total).to.equal(8);
    });

    it.skipIf(isJSDOM)('outlines referenced cells while typing a draft in the bar', async () => {
      const { user } = await render(<Test />);
      await user.click(getCell(2, 3));
      await user.click(getBarEditable());
      await user.keyboard('{Control>}a{/Control}=price * 2');
      await waitFor(() => {
        expect(document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight')).to.have.length(
          1,
        );
      });
      const rect = document
        .querySelector('.MuiDataGrid-formulaReferenceHighlight')!
        .getBoundingClientRect();
      const cell = getCell(2, 1).getBoundingClientRect();
      expect(Math.abs(rect.left - cell.left)).to.be.lessThan(3);
      expect(Math.abs(rect.top - cell.top)).to.be.lessThan(3);
    });
  });

  describe('portal composition', () => {
    it('works when portaled outside the grid root', async () => {
      function PortalToolbar() {
        return ReactDOM.createPortal(<FormulaBar />, document.body);
      }
      render(<Test slots={{ toolbar: PortalToolbar }} slotProps={{}} showToolbar />);
      await microtasks();
      const bar = getBar()!;
      expect(bar).not.to.equal(null);
      // Outside the grid root...
      expect(bar.closest('.MuiDataGrid-root')).to.equal(null);
      focusCell(0, 'total');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      // ...and the veto still recognizes it: a cell edit survives a mouseup in the bar.
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'total' });
      });
      await microtasks();
      fireEvent.mouseUp(getBarEditable());
      await microtasks();
      expect(apiRef.current!.getCellMode(0, 'total')).to.equal('edit');
    });
  });
});
