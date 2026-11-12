import * as React from 'react';
import { platform } from '@base-ui/utils/platform';
import type { RefObject } from '@mui/x-internals/types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { microtasks } from 'test/utils/helperFn';
import {
  DataGridPremium,
  GRID_CHECKBOX_SELECTION_FIELD,
  gridClasses,
  gridFocusCellSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi, GridRowId } from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { getSelectionOffsets, setCaretOffset } from '../components/formulaEditorCaret';

// Row ids differ from the row positions, so an A1 row number (`B2`) and a
// canonical row id (`ROW(12)`) cannot be mistaken for each other.
const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  formulaReferencePicking: true,
  rows: [
    { id: 11, item: 'Apple', price: 10, quantity: 3, total: '=price * quantity', note: 'a' },
    { id: 12, item: 'Banana', price: 20, quantity: 5, total: '=price * quantity', note: 'b' },
    { id: 13, item: 'Cherry', price: 30, quantity: 2, total: 8, note: 'c' },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number', editable: true },
    { field: 'quantity', type: 'number' },
    { field: 'total', type: 'number', allowFormulas: true, editable: true },
    { field: 'note', editable: true },
  ],
};

describe('<DataGridPremium /> - Formulas reference picking', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  type User = Awaited<ReturnType<typeof render>>['user'];

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 700, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  const cell = (id: GridRowId, field: string) => apiRef.current!.getCellElement(id, field)!;

  const getEditable = () =>
    document.querySelector<HTMLElement>('.MuiDataGrid-formulaEditorSurface [contenteditable]');

  /**
   * Sets the text of the formula editor and puts the caret at `caret` (the end by default).
   */
  function typeInEditor(text: string, caret = text.length) {
    const editable = getEditable()!;
    editable.textContent = text;
    fireEvent.input(editable);
    act(() => setCaretOffset(editable, caret));
    // Typing ends with the release of the key, which is when the editor reads the caret.
    fireEvent.keyUp(editable, { key: text.slice(-1) });
  }

  /**
   * Starts editing the Total cell of the row and replaces its text.
   */
  async function editTotal(user: User, id: GridRowId, text: string, caret?: number) {
    await user.dblClick(cell(id, 'total'));
    await waitFor(() => {
      expect(getEditable()).not.to.equal(null);
    });
    typeInEditor(text, caret);
  }

  const isEditing = (id: GridRowId, field = 'total') =>
    apiRef.current!.getCellMode(id, field) === 'edit';

  // The click that adds a reference: Cmd on macOS, Ctrl elsewhere.
  const APPEND_KEY = platform.os.mac ? { metaKey: true } : { ctrlKey: true };
  const OTHER_KEY = platform.os.mac ? { ctrlKey: true } : { metaKey: true };

  /**
   * A click with a modifier key held. The pointer events are dispatched one by one: the
   * mousedown is the one that picks.
   */
  function modifierClick(target: Element, init: MouseEventInit) {
    fireEvent.mouseDown(target, init);
    fireEvent.mouseUp(target, init);
    fireEvent.click(target, init);
  }

  /**
   * Presses the button on the first cell and moves the pointer over the others, in order.
   * The button stays down.
   */
  function dragOver(from: Element, ...over: Element[]) {
    fireEvent.mouseDown(from);
    over.forEach((target) => fireEvent.mouseOver(target));
  }

  /**
   * A whole drag: the button is released over the last cell.
   */
  function drag(from: Element, ...over: Element[]) {
    dragOver(from, ...over);
    fireEvent.mouseUp(over[over.length - 1] ?? from);
  }

  describe.each([
    {
      dialect: 'A1 notation',
      a1Notation: true,
      otherRowPrice: 'B2',
      otherRowQuantity: 'C3',
    },
    {
      dialect: 'canonical',
      a1Notation: false,
      otherRowPrice: 'REF(COLUMN("price"), ROW(12))',
      otherRowQuantity: 'REF(COLUMN("quantity"), ROW(13))',
    },
  ])('$dialect', ({ a1Notation, otherRowPrice, otherRowQuantity }) => {
    it('inserts a reference to the clicked cell and keeps editing', async () => {
      const { user } = await render(<Test formulaA1Notation={a1Notation} />);
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));

      expect(getEditable()!.textContent).to.equal(`=${otherRowPrice}`);
      expect(isEditing(11)).to.equal(true);
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'total' });
    });

    it.each([
      ['=10+', '=10+'],
      ['=SUM(', '=SUM('],
      ['=SUM(price,', '=SUM(price,'],
      ['=SUM(price, ', '=SUM(price, '],
    ])('inserts after `%s`', async (text, prefix) => {
      const { user } = await render(<Test formulaA1Notation={a1Notation} />);
      await editTotal(user, 11, text);
      await user.click(cell(12, 'price'));

      expect(getEditable()!.textContent).to.equal(`${prefix}${otherRowPrice}`);
      expect(isEditing(11)).to.equal(true);
    });

    it('inserts at the caret, in the middle of the formula', async () => {
      const { user } = await render(<Test formulaA1Notation={a1Notation} />);
      await editTotal(user, 11, '=SUM(, 2)', 5);
      await user.click(cell(12, 'price'));

      expect(getEditable()!.textContent).to.equal(`=SUM(${otherRowPrice}, 2)`);
    });

    it('writes the field name for a cell of the row of the formula', async () => {
      const { user } = await render(<Test formulaA1Notation={a1Notation} />);
      await editTotal(user, 11, '=');
      await user.click(cell(11, 'price'));

      expect(getEditable()!.textContent).to.equal('=price');
      expect(isEditing(11)).to.equal(true);
    });

    it('replaces the reference of the previous click', async () => {
      const { user } = await render(<Test formulaA1Notation={a1Notation} />);
      await editTotal(user, 11, '=2*');
      await user.click(cell(12, 'price'));
      await user.click(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal(`=2*${otherRowQuantity}`);
      await user.click(cell(11, 'quantity'));
      expect(getEditable()!.textContent).to.equal('=2*quantity');
      expect(isEditing(11)).to.equal(true);
    });

    it('inserts a new reference once an operator is typed after the picked one', async () => {
      const { user } = await render(<Test formulaA1Notation={a1Notation} />);
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      typeInEditor(`=${otherRowPrice}+`);
      await user.click(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal(`=${otherRowPrice}+${otherRowQuantity}`);
    });

    it('commits the picked reference with Enter', async () => {
      const { user } = await render(
        <Test formulaA1Notation={a1Notation} processRowUpdate={(row) => row} />,
      );
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      fireEvent.keyDown(getEditable()!, { key: 'Enter' });

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      expect(cell(11, 'total').textContent).to.equal('20');
      expect(apiRef.current!.getRow(11).total).to.equal('=REF(COLUMN("price"), ROW(12))');
    });
  });

  describe('caret on a reference', () => {
    it.each([
      ['at the end of a field name', '=price * quantity', undefined, '=price * C3'],
      ['inside a field name', '=price * quantity', 3, '=C3 * quantity'],
      ['at the start of a field name', '=price * quantity', 1, '=C3 * quantity'],
      ['at the end of a cell reference', '=SUM(B1, 2)', 7, '=SUM(C3, 2)'],
      ['inside a range', '=SUM(B1:C2)', 8, '=SUM(C3)'],
    ])('replaces the reference with the caret %s', async (_, text, caret, expected) => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, text, caret);
      await user.click(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal(expected);
      expect(isEditing(11)).to.equal(true);
    });

    it('replaces a canonical reference', async () => {
      const { user } = await render(<Test />);
      await editTotal(user, 11, '=2*REF(COLUMN("price"), ROW(12))');
      await user.click(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal('=2*REF(COLUMN("quantity"), ROW(13))');
    });

    it('replaces the reference of a formula that was just opened', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await user.dblClick(cell(11, 'total'));
      await waitFor(() => {
        expect(getEditable()?.textContent).to.equal('=price * quantity');
      });
      await user.click(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal('=price * C3');
      // The written reference is the pending one: the next click replaces it.
      await user.click(cell(12, 'price'));
      expect(getEditable()!.textContent).to.equal('=price * B2');
    });

    it('replaces the picked reference after its text was changed by typing', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      typeInEditor('=B22');
      await user.click(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal('=C3');
    });

    it('does not replace a name that is not a column', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=unknown');
      await user.click(cell(13, 'quantity'));

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });
  });

  describe('clicks that are not picks', () => {
    it.each([
      ['a complete formula', '=price*2', undefined],
      ['a number', '=5', undefined],
      ['a partially typed name', '=pri', undefined],
      ['a string', '="abc', undefined],
      ['a function name', '=SUM', undefined],
      ['a caret right before a number', '=5', 1],
      ['a plain value', '7', undefined],
    ])('ends the edit when the caret is after %s', async (_, text, caret) => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, text, caret);
      await user.click(cell(12, 'price'));

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 12, field: 'price' });
    });

    it('ends the edit of a plain text cell', async () => {
      const { user } = await render(<Test />);
      await user.dblClick(cell(11, 'note'));
      expect(isEditing(11, 'note')).to.equal(true);
      await user.click(cell(12, 'price'));

      await waitFor(() => {
        expect(isEditing(11, 'note')).to.equal(false);
      });
    });

    it.each([
      ['a pinned row', 'pinned', 'price'],
      ['the checkbox column', 12, GRID_CHECKBOX_SELECTION_FIELD],
    ])('ends the edit on a click in %s', async (_, id, field) => {
      const { user } = await render(
        <Test
          formulaA1Notation
          checkboxSelection
          pinnedRows={{ bottom: [{ id: 'pinned', item: 'Sum', price: 60, quantity: 10 }] }}
        />,
      );
      await editTotal(user, 11, '=');
      await user.click(cell(id, field));

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });

    it.each([
      ['Alt', { altKey: true }],
      // Ctrl on macOS (the context menu), the Windows key elsewhere.
      ['the modifier that does not add a reference', OTHER_KEY],
      ['Shift and the modifier that adds a reference', { shiftKey: true, ...APPEND_KEY }],
      ['the right button', { button: 2 }],
    ])('does not pick with %s', async (_, init) => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=');
      const target = cell(12, 'price');
      fireEvent.mouseDown(target, init);
      fireEvent.mouseUp(target, init);

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });

    it('does not pick while an IME composition is in flight', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=');
      fireEvent.compositionStart(getEditable()!);
      const target = cell(12, 'price');
      fireEvent.mouseDown(target);
      fireEvent.mouseUp(target);

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });
  });

  describe('prop off', () => {
    it('ends the edit on a click', async () => {
      const onCellEditStop = vi.fn();
      const { user } = await render(
        <Test formulaReferencePicking={false} onCellEditStop={onCellEditStop} />,
      );
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      expect(onCellEditStop.mock.calls[0][0].reason).to.equal('cellFocusOut');
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 12, field: 'price' });
    });
  });

  describe('grid state during a pick', () => {
    it('does not change the cell selection or the row selection', async () => {
      const onCellSelectionModelChange = vi.fn();
      const onRowSelectionModelChange = vi.fn();
      const { user } = await render(
        <Test
          formulaA1Notation
          cellSelection
          onCellSelectionModelChange={onCellSelectionModelChange}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );
      await editTotal(user, 11, '=');
      const cellSelectionModel = apiRef.current!.getCellSelectionModel();
      onCellSelectionModelChange.mockClear();
      onRowSelectionModelChange.mockClear();
      await user.click(cell(12, 'price'));

      expect(getEditable()!.textContent).to.equal('=B2');
      expect(onCellSelectionModelChange.mock.calls).to.have.length(0);
      expect(onRowSelectionModelChange.mock.calls).to.have.length(0);
      expect(apiRef.current!.getCellSelectionModel()).to.equal(cellSelectionModel);
      expect(apiRef.current!.isRowSelected(12)).to.equal(false);
    });

    it('does not start editing the clicked cell on a double click', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=');
      await user.dblClick(cell(12, 'price'));

      expect(getEditable()!.textContent).to.equal('=B2');
      expect(isEditing(12, 'price')).to.equal(false);
      expect(isEditing(11)).to.equal(true);
    });

    it('still calls `onCellClick` for the clicked cell', async () => {
      const onCellClick = vi.fn();
      const { user } = await render(<Test formulaA1Notation onCellClick={onCellClick} />);
      await editTotal(user, 11, '=');
      onCellClick.mockClear();
      await user.click(cell(12, 'price'));

      expect(onCellClick.mock.calls).to.have.length(1);
      expect(onCellClick.mock.calls[0][0].id).to.equal(12);
    });

    it('keeps the focus and the caret in the editor', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=SUM(, 2)', 5);
      await user.click(cell(12, 'price'));

      const editable = getEditable()!;
      expect(document.activeElement).to.equal(editable);
      expect(getSelectionOffsets(editable)).to.deep.equal({ start: 7, end: 7 });
    });

    it('lets the next click move the focus once the edit is over', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      fireEvent.keyDown(getEditable()!, { key: 'Escape' });
      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      await user.click(cell(13, 'quantity'));

      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 13, field: 'quantity' });
      expect(cell(11, 'total').textContent).to.equal('30');
    });

    it('commits the picked reference with Tab and moves to the next cell', async () => {
      const { user } = await render(<Test formulaA1Notation processRowUpdate={(row) => row} />);
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      fireEvent.keyDown(getEditable()!, { key: 'Tab' });

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      expect(cell(11, 'total').textContent).to.equal('20');
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'note' });
    });
  });

  describe('ranges', () => {
    // The formula is in D1: B2 is 2 columns to its left and 1 row below, C3 is 1 column to
    // its left and 2 rows below.
    const CANONICAL_B2_C3 =
      'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(2)))';

    describe.each([
      { dialect: 'A1 notation', a1Notation: true, b2: 'B2', b2c3: 'B2:C3' },
      {
        dialect: 'canonical',
        a1Notation: false,
        b2: 'REF(COLUMN("price"), ROW(12))',
        b2c3: CANONICAL_B2_C3,
      },
    ])('$dialect', ({ a1Notation, b2, b2c3 }) => {
      it('writes the range under a drag, live', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        dragOver(cell(12, 'price'));
        expect(getEditable()!.textContent).to.equal(`=SUM(${b2}`);

        fireEvent.mouseOver(cell(13, 'quantity'));
        expect(getEditable()!.textContent).to.equal(`=SUM(${b2c3}`);

        fireEvent.mouseUp(cell(13, 'quantity'));
        expect(getEditable()!.textContent).to.equal(`=SUM(${b2c3}`);
        expect(isEditing(11)).to.equal(true);
        expect(document.activeElement).to.equal(getEditable());
        expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'total' });
      });

      it('writes one cell again when the pointer comes back to the first cell', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(13, 'quantity'), cell(12, 'price'));

        expect(getEditable()!.textContent).to.equal(`=SUM(${b2}`);
      });

      it('turns the picked reference into a range with Shift+click', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        modifierClick(cell(13, 'quantity'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal(`=SUM(${b2c3}`);
        expect(isEditing(11)).to.equal(true);
        expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'total' });
      });

      it('turns a typed reference into a range with Shift+click', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, `=${b2}`);
        modifierClick(cell(13, 'quantity'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal(`=${b2c3}`);
      });

      it('starts the range of a field name on its cell in the row of the formula', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=price');
        modifierClick(cell(13, 'quantity'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal(
          a1Notation
            ? '=B1:C3'
            : '=RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(2)))',
        );
      });

      it('commits the picked range with Enter', async () => {
        const { user } = await render(
          <Test formulaA1Notation={a1Notation} processRowUpdate={(row) => row} />,
        );
        await editTotal(user, 11, '=SUM()', 5);
        drag(cell(12, 'price'), cell(13, 'quantity'));
        expect(getEditable()!.textContent).to.equal(`=SUM(${b2c3})`);
        fireEvent.keyDown(getEditable()!, { key: 'Enter' });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
        // 20 + 5 + 30 + 2
        expect(cell(11, 'total').textContent).to.equal('57');
        expect(apiRef.current!.getRow(11).total).to.equal(`=SUM(${CANONICAL_B2_C3})`);
      });

      it('draws the range as the pending reference', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(13, 'quantity'));

        await waitFor(() => {
          expect(
            document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight--pending'),
          ).to.have.length(1);
        });
        expect(document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight')).to.have.length(
          1,
        );
      });
    });

    describe('drag', () => {
      it('writes the range from its top-left cell, whatever the direction', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        dragOver(cell(13, 'quantity'), cell(12, 'price'));
        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');

        // The range still starts on the cell of the mousedown.
        fireEvent.mouseOver(cell(13, 'price'));
        expect(getEditable()!.textContent).to.equal('=SUM(B3:C3');
        fireEvent.mouseOver(cell(12, 'note'));
        expect(getEditable()!.textContent).to.equal('=SUM(C2:E3');
      });

      it('writes a range outside a function call', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=');
        drag(cell(12, 'price'), cell(13, 'quantity'));

        expect(getEditable()!.textContent).to.equal('=B2:C3');
      });

      it('replaces the reference the caret is on', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(price) + 1', 10);
        drag(cell(12, 'price'), cell(13, 'price'));

        expect(getEditable()!.textContent).to.equal('=SUM(B2:B3) + 1');
      });

      it('writes the cell of the row of the formula as a cell once it is in a range', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=');
        dragOver(cell(11, 'price'));
        expect(getEditable()!.textContent).to.equal('=price');

        fireEvent.mouseOver(cell(12, 'quantity'));
        expect(getEditable()!.textContent).to.equal('=B1:C2');
        fireEvent.mouseOver(cell(11, 'price'));
        expect(getEditable()!.textContent).to.equal('=price');
      });

      it('writes a range that covers the cell of the formula', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(11, 'total'));

        expect(getEditable()!.textContent).to.equal('=SUM(B1:D2');
      });

      it('keeps the last range while the pointer is over a cell that cannot be referenced', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            checkboxSelection
            pinnedRows={{ bottom: [{ id: 'pinned', item: 'Sum', price: 60, quantity: 10 }] }}
          />,
        );
        await editTotal(user, 11, '=SUM(');
        dragOver(cell(12, 'price'), cell(13, 'quantity'));
        fireEvent.mouseOver(cell('pinned', 'quantity'));
        fireEvent.mouseOver(cell(13, GRID_CHECKBOX_SELECTION_FIELD));

        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');
      });

      it('stops following the pointer once the button is released', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(13, 'quantity'));
        fireEvent.mouseOver(cell(13, 'note'));

        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');
      });

      it('replaces the whole range on the next click', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(13, 'quantity'));
        await user.click(cell(13, 'price'));

        expect(getEditable()!.textContent).to.equal('=SUM(B3');
      });

      it('keeps the range once something is typed after it', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(13, 'quantity'));
        typeInEditor('=SUM(B2:C3,');
        await user.click(cell(13, 'price'));

        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3,B3');
      });

      it('does not change the cell selection or the row selection', async () => {
        const onCellSelectionModelChange = vi.fn();
        const onRowSelectionModelChange = vi.fn();
        const { user } = await render(
          <Test
            formulaA1Notation
            cellSelection
            onCellSelectionModelChange={onCellSelectionModelChange}
            onRowSelectionModelChange={onRowSelectionModelChange}
          />,
        );
        await editTotal(user, 11, '=SUM(');
        const cellSelectionModel = apiRef.current!.getCellSelectionModel();
        onCellSelectionModelChange.mockClear();
        onRowSelectionModelChange.mockClear();
        drag(cell(12, 'price'), cell(13, 'quantity'));
        modifierClick(cell(13, 'note'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=SUM(B2:E3');
        expect(onCellSelectionModelChange.mock.calls).to.have.length(0);
        expect(onRowSelectionModelChange.mock.calls).to.have.length(0);
        expect(apiRef.current!.getCellSelectionModel()).to.equal(cellSelectionModel);
      });

      it('turns off the text selection of the grid while the button is down', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        const root = document.querySelector(`.${gridClasses.root}`)!;
        const NO_SELECTION_CLASS = gridClasses['root--disableUserSelection'];
        await editTotal(user, 11, '=SUM(');
        dragOver(cell(12, 'price'), cell(13, 'quantity'));
        expect(root.classList.contains(NO_SELECTION_CLASS)).to.equal(true);

        fireEvent.mouseUp(cell(13, 'quantity'));
        expect(root.classList.contains(NO_SELECTION_CLASS)).to.equal(false);
      });

      it('turns the text selection back on when the edit ends during a drag', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        const root = document.querySelector(`.${gridClasses.root}`)!;
        await editTotal(user, 11, '=');
        dragOver(cell(12, 'price'), cell(13, 'quantity'));
        fireEvent.keyDown(getEditable()!, { key: 'Escape' });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
        expect(root.classList.contains(gridClasses['root--disableUserSelection'])).to.equal(false);
        // The pointer is still down: nothing is written anywhere.
        fireEvent.mouseOver(cell(13, 'note'));
        expect(apiRef.current!.getRow(11).total).to.equal('=price * quantity');
      });
    });

    describe('Shift+click', () => {
      it('starts the range of a typed range on its first cell', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(B2:C3)', 10);
        modifierClick(cell(13, 'note'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=SUM(B2:E3)');
      });

      it('starts the range of a dragged range on the cell of the mousedown', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        // Dragged up: the text reads `B2:C3`, but the range was started on C3.
        drag(cell(13, 'quantity'), cell(12, 'price'));
        modifierClick(cell(11, 'price'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=SUM(B1:C3');
      });

      it('extends the range again on the next Shift+click', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        modifierClick(cell(13, 'quantity'), { shiftKey: true });
        modifierClick(cell(12, 'note'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=SUM(B2:E2');
      });

      it('writes one cell when the clicked cell is the one the reference points at', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(B2:C3)', 10);
        modifierClick(cell(12, 'price'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=SUM(B2)');
      });

      it('picks the clicked cell when no reference is at the caret', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=B2+');
        modifierClick(cell(13, 'quantity'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=B2+C3');
      });

      it('replaces a reference that is not made of cells', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=SUM(COLUMN_VALUES("price"))', 27);
        modifierClick(cell(13, 'quantity'), { shiftKey: true });

        expect(getEditable()!.textContent).to.equal('=SUM(REF(COLUMN("quantity"), ROW(13)))');
      });

      it('ends the edit where a click is not a pick', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=5');
        modifierClick(cell(12, 'price'), { shiftKey: true });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
      });

      it('does not pick a cell that cannot be referenced', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            pinnedRows={{ bottom: [{ id: 'pinned', item: 'Sum', price: 60, quantity: 10 }] }}
          />,
        );
        await editTotal(user, 11, '=B2');
        modifierClick(cell('pinned', 'price'), { shiftKey: true });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
      });
    });
  });

  describe('adding a reference with Ctrl/Cmd+click', () => {
    describe.each([
      { dialect: 'A1 notation', a1Notation: true, b2: 'B2', c3: 'C3', b3: 'B3' },
      {
        dialect: 'canonical',
        a1Notation: false,
        b2: 'REF(COLUMN("price"), ROW(12))',
        c3: 'REF(COLUMN("quantity"), ROW(13))',
        b3: 'REF(COLUMN("price"), ROW(13))',
      },
    ])('$dialect', ({ a1Notation, b2, c3, b3 }) => {
      it('adds the clicked cells one after the other to the function call', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        modifierClick(cell(13, 'quantity'), APPEND_KEY);
        expect(getEditable()!.textContent).to.equal(`=SUM(${b2}, ${c3}`);

        modifierClick(cell(13, 'price'), APPEND_KEY);
        expect(getEditable()!.textContent).to.equal(`=SUM(${b2}, ${c3}, ${b3}`);
        expect(isEditing(11)).to.equal(true);
        expect(document.activeElement).to.equal(getEditable());
      });

      it('lets a plain click replace the added reference only', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        modifierClick(cell(13, 'quantity'), APPEND_KEY);
        await user.click(cell(13, 'price'));

        expect(getEditable()!.textContent).to.equal(`=SUM(${b2}, ${b3}`);
      });

      it('adds a reference after a typed one', async () => {
        const { user } = await render(<Test formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(price)', 10);
        modifierClick(cell(12, 'price'), APPEND_KEY);

        expect(getEditable()!.textContent).to.equal(`=SUM(price, ${b2})`);
      });

      it('commits the added references with Enter', async () => {
        const { user } = await render(
          <Test formulaA1Notation={a1Notation} processRowUpdate={(row) => row} />,
        );
        await editTotal(user, 11, '=SUM()', 5);
        await user.click(cell(12, 'price'));
        modifierClick(cell(13, 'quantity'), APPEND_KEY);
        fireEvent.keyDown(getEditable()!, { key: 'Enter' });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
        // 20 + 2
        expect(cell(11, 'total').textContent).to.equal('22');
      });
    });

    it.each([
      ['at the start of the formula', '=', '=B2'],
      ['after an operator', '=C3+', '=C3+B2'],
      ['at the start of the arguments', '=SUM(', '=SUM(B2'],
      ['on a reference outside a function call', '=price', '=B2'],
      ['on a reference inside a group', '=(price', '=(B2'],
    ])('behaves like a plain click %s', async (_, text, expected) => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, text);
      modifierClick(cell(12, 'price'), APPEND_KEY);

      expect(getEditable()!.textContent).to.equal(expected);
      expect(isEditing(11)).to.equal(true);
    });

    it('adds a range when the pointer is dragged', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=SUM(');
      await user.click(cell(12, 'price'));
      fireEvent.mouseDown(cell(12, 'quantity'), APPEND_KEY);
      fireEvent.mouseOver(cell(13, 'quantity'));
      fireEvent.mouseUp(cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal('=SUM(B2, C2:C3');
    });

    it('adds a reference after a range', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=SUM(');
      drag(cell(12, 'price'), cell(13, 'price'));
      modifierClick(cell(12, 'note'), APPEND_KEY);

      expect(getEditable()!.textContent).to.equal('=SUM(B2:B3, E2');
    });

    it('marks the added reference as the pending one', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=SUM(');
      await user.click(cell(12, 'price'));
      modifierClick(cell(13, 'quantity'), APPEND_KEY);

      await waitFor(() => {
        expect(document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight')).to.have.length(
          2,
        );
      });
      expect(
        document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight--pending'),
      ).to.have.length(1);
    });

    it('ends the edit where a click is not a pick', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=SUM(5');
      modifierClick(cell(12, 'price'), APPEND_KEY);

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });
  });

  // The hit area of the fill handle is a corner of the cell: it needs a layout.
  describe.skipIf(isJSDOM)('fill handle of the cell selection', () => {
    async function renderWithFillHandle() {
      const utils = await render(<Test formulaA1Notation cellSelection cellSelectionFillHandle />);
      await editTotal(utils.user, 11, '=');
      // The selection ends on B3, which shows the fill handle. The formula is edited in D1.
      act(() => {
        apiRef.current!.setCellSelectionModel({ 12: { price: true }, 13: { price: true } });
      });
      await waitFor(() => {
        expect(cell(13, 'price').classList.contains(gridClasses['cell--withFillHandle'])).to.equal(
          true,
        );
      });
      return utils;
    }

    it('does not pick the cell when the mousedown is on its fill handle', async () => {
      await renderWithFillHandle();
      const target = cell(13, 'price');
      const rect = target.getBoundingClientRect();
      const corner = { clientX: rect.right - 3, clientY: rect.bottom - 3 };
      fireEvent.mouseDown(target, corner);

      expect(getEditable()!.textContent).to.equal('=');
      expect(
        document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight--pending'),
      ).to.have.length(0);
      // The fill handle took the mousedown: its drag is what turns the text selection off.
      expect(
        document
          .querySelector(`.${gridClasses.root}`)!
          .classList.contains(gridClasses['root--disableUserSelection']),
      ).to.equal(true);
      // Like any click that is not a pick, it ends the edit.
      fireEvent.mouseUp(target, corner);
      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });

    it('picks the cell when the mousedown is anywhere else on it', async () => {
      await renderWithFillHandle();
      const target = cell(13, 'price');
      const rect = target.getBoundingClientRect();
      const inside = { clientX: rect.left + 5, clientY: rect.top + 5 };
      fireEvent.mouseDown(target, inside);
      fireEvent.mouseUp(target, inside);

      expect(getEditable()!.textContent).to.equal('=B3');
    });
  });

  describe('several grids', () => {
    it('does not pick a cell of another grid', async () => {
      let otherApiRef: RefObject<GridApi | null>;
      function Other() {
        otherApiRef = useGridApiRef();
        return (
          <div style={{ width: 700, height: 400 }}>
            <DataGridPremium {...baselineProps} formulaA1Notation apiRef={otherApiRef} />
          </div>
        );
      }
      const { user } = await render(
        <React.Fragment>
          <Test formulaA1Notation />
          <Other />
        </React.Fragment>,
      );
      await editTotal(user, 11, '=');
      await user.click(otherApiRef!.current!.getCellElement(12, 'price')!);

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      expect(gridFocusCellSelector(otherApiRef!)).to.deep.equal({ id: 12, field: 'price' });
    });
  });

  describe('visual feedback', () => {
    const PICKING_CLASS = gridClasses['root--formulaReferencePicking'];
    const RECT_CLASS = 'MuiDataGrid-formulaReferenceHighlight';
    const PENDING_CLASS = 'MuiDataGrid-formulaReferenceHighlight--pending';

    const isPickingClassOn = () =>
      document.querySelector(`.${gridClasses.root}`)!.classList.contains(PICKING_CLASS);
    const rects = () => Array.from(document.querySelectorAll<HTMLElement>(`.${RECT_CLASS}`));
    const pendingRects = () =>
      Array.from(document.querySelectorAll<HTMLElement>(`.${PENDING_CLASS}`));

    /**
     * Moves the caret the way an arrow key does.
     */
    function moveCaret(offset: number) {
      const editable = getEditable()!;
      act(() => setCaretOffset(editable, offset));
      fireEvent.keyUp(editable, { key: 'ArrowLeft' });
    }

    describe('pending reference rectangle', () => {
      it('marks the rectangle of the picked reference until something is typed', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=');
        expect(rects()).to.have.length(0);

        await user.click(cell(12, 'price'));
        await waitFor(() => {
          expect(rects()).to.have.length(1);
        });
        expect(pendingRects()).to.have.length(1);

        typeInEditor('=B2+');
        await waitFor(() => {
          expect(pendingRects()).to.have.length(0);
        });
        expect(rects()).to.have.length(1);
      });

      it('moves to the reference of the next pick', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=');
        await user.click(cell(12, 'price'));
        typeInEditor('=B2+');
        await user.click(cell(13, 'quantity'));

        await waitFor(() => {
          expect(rects()).to.have.length(2);
        });
        expect(pendingRects()).to.have.length(1);
        // B2 keeps the first color, the pending C3 has the second one.
        expect(pendingRects()[0].style.borderColor).to.equal('var(--DataGrid-formulaRefColor-1)');
      });

      it('draws the rectangle of a canonical formula that does not parse yet', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));

        expect(getEditable()!.textContent).to.equal('=SUM(REF(COLUMN("price"), ROW(12))');
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });
        expect(rects()).to.have.length(1);
        expect(pendingRects()[0].style.borderColor).to.equal('var(--DataGrid-formulaRefColor-0)');

        // Typing ends the pick, and the text still does not parse: no rectangle is left.
        typeInEditor('=SUM(REF(COLUMN("price"), ROW(12)),');
        await waitFor(() => {
          expect(rects()).to.have.length(0);
        });
      });

      it('marks a cell of the row of the formula', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=2*');
        await user.click(cell(11, 'price'));

        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });
        expect(rects()).to.have.length(1);
      });

      it('stops being pending when the caret leaves the end of the reference', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=');
        await user.click(cell(12, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });

        moveCaret(1);
        await waitFor(() => {
          expect(pendingRects()).to.have.length(0);
        });
        expect(rects()).to.have.length(1);
      });

      it('is removed when the edit is cancelled', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });
        fireEvent.keyDown(getEditable()!, { key: 'Escape' });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
        expect(rects()).to.have.length(0);
      });

      it('is not pending for a reference that was typed', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=B2');

        await waitFor(() => {
          expect(rects()).to.have.length(1);
        });
        expect(pendingRects()).to.have.length(0);
      });
    });

    describe('root class', () => {
      it.each([
        ['=', true],
        ['=10+', true],
        ['=SUM(', true],
        ['=SUM(price, ', true],
        // The caret is on a reference: a click replaces it.
        ['=price', true],
        ['=10', false],
        ['=SUM(price)', false],
        ['="a', false],
        ['=pri', false],
        ['10', false],
        ['', false],
      ])('for `%s`: %s', async (text, expected) => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, text);

        expect(isPickingClassOn()).to.equal(expected);
      });

      it('follows the caret', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=10+');
        expect(isPickingClassOn()).to.equal(true);

        moveCaret(3);
        expect(isPickingClassOn()).to.equal(false);

        moveCaret(4);
        expect(isPickingClassOn()).to.equal(true);
      });

      it('stays on after a pick, as the next click replaces the reference', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=');
        await user.click(cell(12, 'price'));

        expect(getEditable()!.textContent).to.equal('=B2');
        expect(isPickingClassOn()).to.equal(true);
      });

      it('is removed when the edit ends', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=');
        expect(isPickingClassOn()).to.equal(true);
        fireEvent.keyDown(getEditable()!, { key: 'Escape' });

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
        expect(isPickingClassOn()).to.equal(false);
      });

      it('is removed when the click ends the edit', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=');
        expect(isPickingClassOn()).to.equal(true);
        typeInEditor('=10');
        expect(isPickingClassOn()).to.equal(false);
        await user.click(cell(12, 'price'));

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
        expect(isPickingClassOn()).to.equal(false);
      });

      it('is never set when the prop is off', async () => {
        const { user } = await render(<Test formulaReferencePicking={false} />);
        await editTotal(user, 11, '=');

        expect(isPickingClassOn()).to.equal(false);
      });

      it('is not set while editing a column without formulas', async () => {
        const { user } = await render(<Test />);
        await user.dblClick(cell(11, 'note'));
        await waitFor(() => {
          expect(isEditing(11, 'note')).to.equal(true);
        });

        expect(isPickingClassOn()).to.equal(false);
      });
    });

    describe.skipIf(isJSDOM)('layout', () => {
      it('draws the pending rectangle solid, over the picked cell', async () => {
        const { user } = await render(<Test />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        await waitFor(() => {
          expect(pendingRects()).to.have.length(1);
        });

        const rect = pendingRects()[0].getBoundingClientRect();
        const target = cell(12, 'price').getBoundingClientRect();
        expect(rect.left).to.be.closeTo(target.left, 1);
        expect(rect.top).to.be.closeTo(target.top, 1);
        expect(rect.width).to.be.closeTo(target.width, 1);
        expect(rect.height).to.be.closeTo(target.height, 1);
        expect(getComputedStyle(pendingRects()[0]).borderTopStyle).to.equal('solid');
      });

      it('draws the other rectangles dashed', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=B2+');
        await user.click(cell(13, 'quantity'));
        await waitFor(() => {
          expect(rects()).to.have.length(2);
        });

        expect(
          rects().map((rect) => [
            rect.classList.contains(PENDING_CLASS),
            getComputedStyle(rect).borderTopStyle,
          ]),
        ).to.deep.equal([
          [false, 'dashed'],
          [true, 'solid'],
        ]);
      });

      it('shows the picking cursor on the cells that can be referenced', async () => {
        const { user } = await render(
          <Test
            checkboxSelection
            pinnedRows={{ bottom: [{ id: 99, item: 'Pinned', price: 1 }] }}
          />,
        );
        await editTotal(user, 11, '=10');
        expect(getComputedStyle(cell(12, 'price')).cursor).not.to.equal('cell');

        typeInEditor('=10+');
        expect(getComputedStyle(cell(12, 'price')).cursor).to.equal('cell');
        expect(getComputedStyle(cell(11, 'price')).cursor).to.equal('cell');
        // The cell being edited, a utility column, a pinned row.
        expect(getComputedStyle(cell(11, 'total')).cursor).not.to.equal('cell');
        expect(getComputedStyle(cell(12, GRID_CHECKBOX_SELECTION_FIELD)).cursor).not.to.equal(
          'cell',
        );
        expect(getComputedStyle(cell(99, 'price')).cursor).not.to.equal('cell');
      });
    });
  });

  // A real pointer: the browser moves the focus on mousedown unless the grid prevents it.
  describe('row edit mode', () => {
    const isRowEditing = (id: GridRowId) => apiRef.current!.getRowMode(id) === 'edit';

    describe.each([
      {
        dialect: 'A1 notation',
        a1Notation: true,
        otherRowPrice: 'B2',
        range: 'B2:C3',
      },
      {
        dialect: 'canonical',
        a1Notation: false,
        otherRowPrice: 'REF(COLUMN("price"), ROW(12))',
        range:
          'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(2)))',
      },
    ])('$dialect', ({ a1Notation, otherRowPrice, range }) => {
      it('inserts a reference to a cell of another row and keeps the row in edit mode', async () => {
        const { user } = await render(<Test editMode="row" formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=');
        await user.click(cell(12, 'price'));

        expect(getEditable()!.textContent).to.equal(`=${otherRowPrice}`);
        expect(isRowEditing(11)).to.equal(true);
        expect(document.activeElement).to.equal(getEditable());
        expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'total' });
      });

      it('writes the range of a drag, then adds a reference with the modifier click', async () => {
        const { user } = await render(<Test editMode="row" formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=SUM(');
        drag(cell(12, 'price'), cell(13, 'quantity'));
        expect(getEditable()!.textContent).to.equal(`=SUM(${range}`);

        modifierClick(cell(12, 'price'), APPEND_KEY);
        expect(getEditable()!.textContent).to.equal(`=SUM(${range}, ${otherRowPrice}`);
        expect(isRowEditing(11)).to.equal(true);
      });

      it('writes the field name for a cell of the edited row that has no editor', async () => {
        const { user } = await render(<Test editMode="row" formulaA1Notation={a1Notation} />);
        await editTotal(user, 11, '=');
        // The Quantity column is not editable: its cell stays in view mode.
        await user.click(cell(11, 'quantity'));

        expect(getEditable()!.textContent).to.equal('=quantity');
        expect(isRowEditing(11)).to.equal(true);
        expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'total' });
      });
    });

    it('moves the focus to the editor of a clicked cell of the edited row', async () => {
      const { user } = await render(<Test editMode="row" formulaA1Notation />);
      await editTotal(user, 11, '=');
      // The Price cell of the row holds its own editor: the click goes to it.
      await user.click(cell(11, 'price'));

      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 11, field: 'price' });
      expect(isRowEditing(11)).to.equal(true);
      expect(cell(11, 'price').contains(document.activeElement)).to.equal(true);
      expect(apiRef.current!.getRowWithUpdatedValues(11, 'total').total).to.equal('=');
    });

    it('commits the row with the picked reference on Enter', async () => {
      const { user } = await render(
        <Test editMode="row" formulaA1Notation processRowUpdate={(row) => row} />,
      );
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      fireEvent.keyDown(getEditable()!, { key: 'Enter' });

      await waitFor(() => {
        expect(isRowEditing(11)).to.equal(false);
      });
      expect(apiRef.current!.getRow(11).total).to.equal('=REF(COLUMN("price"), ROW(12))');
      expect(cell(11, 'total').textContent).to.equal('20');
    });

    it('ends the row edit on a click where no reference is expected', async () => {
      const { user } = await render(<Test editMode="row" formulaA1Notation />);
      await editTotal(user, 11, '=1+1');
      await user.click(cell(12, 'price'));

      await waitFor(() => {
        expect(isRowEditing(11)).to.equal(false);
      });
      expect(gridFocusCellSelector(apiRef)).to.deep.equal({ id: 12, field: 'price' });
    });

    it('does not pick while another editor of the row has the focus', async () => {
      const { user } = await render(<Test editMode="row" formulaA1Notation />);
      await user.dblClick(cell(11, 'price'));
      await waitFor(() => {
        expect(isRowEditing(11)).to.equal(true);
      });
      expect(cell(11, 'price').contains(document.activeElement)).to.equal(true);
      const formula = apiRef.current!.getRowWithUpdatedValues(11, 'total').total;
      await user.click(cell(12, 'quantity'));

      await waitFor(() => {
        expect(isRowEditing(11)).to.equal(false);
      });
      expect(apiRef.current!.getRow(11).total).to.equal(formula);
    });

    it('does not change the row selection or the cell selection', async () => {
      const onCellSelectionModelChange = vi.fn();
      const onRowSelectionModelChange = vi.fn();
      const { user } = await render(
        <Test
          editMode="row"
          formulaA1Notation
          cellSelection
          onCellSelectionModelChange={onCellSelectionModelChange}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />,
      );
      await editTotal(user, 11, '=');
      onCellSelectionModelChange.mockClear();
      onRowSelectionModelChange.mockClear();
      await user.click(cell(12, 'price'));

      expect(getEditable()!.textContent).to.equal('=B2');
      expect(onCellSelectionModelChange.mock.calls).to.have.length(0);
      expect(onRowSelectionModelChange.mock.calls).to.have.length(0);
    });
  });

  describe('compatibility with other features', () => {
    const isPickingClassOn = () =>
      document
        .querySelector(`.${gridClasses.root}`)!
        .classList.contains(gridClasses['root--formulaReferencePicking']);

    it.each([
      ['cell edit mode', {}],
      ['row edit mode', { editMode: 'row' as const }],
    ])(
      'shows the picking class as soon as a formula opens with the caret on a reference, in %s',
      async (_, props) => {
        const { user } = await render(<Test {...props} />);
        await user.dblClick(cell(11, 'total'));

        await waitFor(() => {
          expect(getEditable()?.textContent).to.equal('=price * quantity');
        });
        // Nothing was typed: the caret sits at the end of `quantity`, which a click replaces.
        await waitFor(() => {
          expect(isPickingClassOn()).to.equal(true);
        });
      },
    );

    it('picks with `disableRowSelectionOnClick` and without cell selection', async () => {
      const { user } = await render(<Test formulaA1Notation disableRowSelectionOnClick />);
      await editTotal(user, 11, '=SUM(');
      drag(cell(12, 'price'), cell(13, 'quantity'));

      expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');
      expect(isEditing(11)).to.equal(true);
      expect(apiRef.current!.getSelectedRows().size).to.equal(0);
    });

    it('picks a cell of a pinned column, named by its place in the view', async () => {
      const { user } = await render(
        <Test formulaA1Notation initialState={{ pinnedColumns: { left: ['quantity'] } }} />,
      );
      await editTotal(user, 11, '=');
      // The pinned Quantity column is the first one of the view: column A.
      await user.click(cell(12, 'quantity'));
      expect(getEditable()!.textContent).to.equal('=A2');

      await user.click(cell(13, 'price'));
      expect(getEditable()!.textContent).to.equal('=C3');
      expect(isEditing(11)).to.equal(true);
    });

    it('writes the same canonical reference for a cell of a pinned column', async () => {
      const { user } = await render(
        <Test initialState={{ pinnedColumns: { left: ['quantity'], right: ['price'] } }} />,
      );
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'quantity'));
      expect(getEditable()!.textContent).to.equal('=REF(COLUMN("quantity"), ROW(12))');

      await user.click(cell(13, 'price'));
      expect(getEditable()!.textContent).to.equal('=REF(COLUMN("price"), ROW(13))');
    });

    it('counts the top pinned rows in the row number, and does not pick them', async () => {
      const { user } = await render(
        <Test
          formulaA1Notation
          pinnedRows={{ top: [{ id: 'top', item: 'Top', price: 1, quantity: 1 }] }}
        />,
      );
      await editTotal(user, 11, '=');
      await user.click(cell(12, 'price'));
      expect(getEditable()!.textContent).to.equal('=B3');

      await user.click(cell('top', 'price'));
      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
    });

    describe('row grouping and aggregation', () => {
      const groupingProps: Partial<DataGridPremiumProps> = {
        initialState: {
          rowGrouping: { model: ['item'] },
          aggregation: { model: { price: 'sum' } },
        },
        defaultGroupingExpansionDepth: -1,
      };
      const GROUP_ROW = 'auto-generated-row-item/Banana';
      const FOOTER_ROW = 'auto-generated-group-footer-root';

      it('picks a row of another group', async () => {
        const { user } = await render(<Test {...groupingProps} />);
        await editTotal(user, 11, '=');
        await user.click(cell(12, 'price'));

        expect(getEditable()!.textContent).to.equal('=REF(COLUMN("price"), ROW(12))');
        expect(isEditing(11)).to.equal(true);
      });

      it('writes a range that spans several groups', async () => {
        const { user } = await render(<Test {...groupingProps} formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        // The group rows between the two cells are not part of the positions.
        drag(cell(12, 'price'), cell(GROUP_ROW, 'price'), cell(13, 'quantity'));

        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');
      });

      it.each([
        ['a group row', GROUP_ROW],
        ['an aggregation footer row', FOOTER_ROW],
      ])('ends the edit on a click in %s', async (_, id) => {
        const { user } = await render(<Test {...groupingProps} />);
        expect(apiRef.current!.getRowNode(id)).not.to.equal(null);
        await editTotal(user, 11, '=');
        await user.click(cell(id, 'price'));

        await waitFor(() => {
          expect(isEditing(11)).to.equal(false);
        });
      });
    });

    describe('right-to-left', () => {
      const rtlTheme = createTheme({ direction: 'rtl' });

      it('picks a cell, a range and an added reference', async () => {
        const { user } = await render(
          <ThemeProvider theme={rtlTheme}>
            <div dir="rtl">
              <Test formulaA1Notation />
            </div>
          </ThemeProvider>,
        );
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        expect(getEditable()!.textContent).to.equal('=SUM(B2');

        drag(cell(12, 'price'), cell(13, 'quantity'));
        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');

        modifierClick(cell(13, 'price'), APPEND_KEY);
        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3, B3');
        expect(document.activeElement).to.equal(getEditable());
      });
    });

    describe('column resize', () => {
      it('keeps the edit and the pending reference while a column is resized', async () => {
        const { user } = await render(<Test formulaA1Notation />);
        await editTotal(user, 11, '=SUM(');
        await user.click(cell(12, 'price'));
        expect(getEditable()!.textContent).to.equal('=SUM(B2');

        const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 130, buttons: 1 });
        fireEvent.mouseUp(separator);

        expect(isEditing(11)).to.equal(true);
        expect(getEditable()!.textContent).to.equal('=SUM(B2');
        // The reference is still the pending one: the next click replaces it.
        await user.click(cell(13, 'quantity'));
        expect(getEditable()!.textContent).to.equal('=SUM(C3');
      });
    });

    // Needs a layout: jsdom renders every row.
    describe.skipIf(isJSDOM)('virtualization', () => {
      const manyRows = Array.from({ length: 200 }, (_, index) => ({
        id: index + 1,
        item: `Item ${index + 1}`,
        price: index + 1,
        quantity: 2,
        total: '=price * quantity',
        note: '',
      }));

      it('picks a cell while the edited row is scrolled out of the view', async () => {
        const { user } = await render(
          <Test
            formulaA1Notation
            rows={manyRows}
            disableVirtualization={false}
            processRowUpdate={(row) => row}
          />,
        );
        await editTotal(user, 1, '=');
        await act(async () => apiRef.current!.scrollToIndexes({ rowIndex: 150 }));
        await waitFor(() => {
          expect(apiRef.current!.getCellElement(150, 'price')).not.to.equal(null);
        });
        // The edited row left the render zone, the editor still holds the focus.
        expect(document.activeElement).to.equal(getEditable());
        await user.click(cell(150, 'price'));

        expect(getEditable()!.textContent).to.equal('=B150');
        expect(isEditing(1)).to.equal(true);
        expect(document.activeElement).to.equal(getEditable());

        fireEvent.keyDown(getEditable()!, { key: 'Enter' });
        await waitFor(() => {
          expect(isEditing(1)).to.equal(false);
        });
        expect(apiRef.current!.getRow(1).total).to.equal('=REF(COLUMN("price"), ROW(150))');
      });
    });
  });

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

    it('keeps the DOM focus and the caret in the editor after a pick', async () => {
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=10+');
      await realClick(cell(12, 'price'));

      await waitFor(() => {
        expect(getEditable()!.textContent).to.equal('=10+B2');
      });
      const editable = getEditable()!;
      expect(document.activeElement).to.equal(editable);
      expect(getSelectionOffsets(editable)).to.deep.equal({ start: 6, end: 6 });
      expect(isEditing(11)).to.equal(true);

      await realClick(cell(13, 'quantity'));
      await waitFor(() => {
        expect(getEditable()!.textContent).to.equal('=10+C3');
      });
      expect(document.activeElement).to.equal(getEditable());
    });

    it('writes the range of a drag and keeps the focus in the editor', async () => {
      const { userEvent } = await import('vitest/browser');
      const { user } = await render(<Test formulaA1Notation />);
      await editTotal(user, 11, '=SUM(');
      const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
      globalThis.IS_REACT_ACT_ENVIRONMENT = false;
      try {
        await userEvent.dragAndDrop(cell(12, 'price'), cell(13, 'quantity'));
      } finally {
        globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
      }

      await waitFor(() => {
        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');
      });
      const editable = getEditable()!;
      expect(document.activeElement).to.equal(editable);
      expect(getSelectionOffsets(editable)).to.deep.equal({ start: 10, end: 10 });
      expect(isEditing(11)).to.equal(true);
      expect(
        document
          .querySelector(`.${gridClasses.root}`)!
          .classList.contains(gridClasses['root--disableUserSelection']),
      ).to.equal(false);
      // The drag selected no text in the grid.
      expect(document.getSelection()!.isCollapsed).to.equal(true);

      // The range is the pending reference: the next click replaces it.
      await realClick(cell(13, 'price'));
      await waitFor(() => {
        expect(getEditable()!.textContent).to.equal('=SUM(B3');
      });
    });

    it('extends the reference with a real Shift+click and keeps the focus in the editor', async () => {
      const { userEvent } = await import('vitest/browser');
      const { user } = await render(<Test formulaA1Notation cellSelection />);
      await editTotal(user, 11, '=SUM(');
      await realClick(cell(12, 'price'));
      await waitFor(() => {
        expect(getEditable()!.textContent).to.equal('=SUM(B2');
      });
      const cellSelectionModel = apiRef.current!.getCellSelectionModel();
      const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
      globalThis.IS_REACT_ACT_ENVIRONMENT = false;
      try {
        await userEvent.click(cell(13, 'quantity'), { modifiers: ['Shift'] });
      } finally {
        globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
      }

      await waitFor(() => {
        expect(getEditable()!.textContent).to.equal('=SUM(B2:C3');
      });
      expect(document.activeElement).to.equal(getEditable());
      expect(isEditing(11)).to.equal(true);
      expect(apiRef.current!.getCellSelectionModel()).to.equal(cellSelectionModel);
    });

    it('moves the focus to the clicked cell when the prop is off', async () => {
      const { user } = await render(<Test formulaA1Notation formulaReferencePicking={false} />);
      await editTotal(user, 11, '=10+');
      await realClick(cell(12, 'price'));

      await waitFor(() => {
        expect(isEditing(11)).to.equal(false);
      });
      expect(document.activeElement).to.equal(cell(12, 'price'));
    });
  });
});
