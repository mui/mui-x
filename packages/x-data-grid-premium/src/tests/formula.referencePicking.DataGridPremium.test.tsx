import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
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
      ['Shift', { shiftKey: true }],
      ['Ctrl', { ctrlKey: true }],
      ['Meta', { metaKey: true }],
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
