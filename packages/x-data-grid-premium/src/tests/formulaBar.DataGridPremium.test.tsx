import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, waitFor } from '@mui/internal-test-utils';
import { getCell, microtasks } from 'test/utils/helperFn';
import { spy } from 'sinon';
import {
  DataGridPremium,
  FormulaBar,
  Toolbar,
  gridFocusCellSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import type { DataGridPremiumProps, GridApi } from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';
import { setCaretOffset } from '../components/formulaEditorCaret';

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
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
    it('shows the canonical formula source of the focused formula cell', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
    });

    it('shows the A1 rendering with formulaA1Notation', async () => {
      render(<Test formulaA1Notation />);
      await microtasks();
      focusCell(0, 'total');
      // Same-row references keep their field names in the A1 dialect.
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      act(() => {
        apiRef.current!.updateRows([{ id: 2, total: '=REF(COLUMN("price"), ROW(0))' }]);
      });
      focusCell(2, 'total');
      expect(getBarEditable().textContent).to.equal('=B1');
    });

    it('shows the plain value of a non-formula cell', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'price');
      expect(getBarEditable().textContent).to.equal('2');
      focusCell(2, 'total');
      expect(getBarEditable().textContent).to.equal('8');
    });

    it('updates on keyboard-driven focus changes', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'total');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      focusCell(1, 'total');
      expect(getBarEditable().textContent).to.equal('=price * quantity');
      focusCell(2, 'total');
      expect(getBarEditable().textContent).to.equal('8');
    });

    it('is read-only for a non-editable column', async () => {
      render(<Test />);
      await microtasks();
      focusCell(0, 'item');
      const editable = getBarEditable();
      expect(editable.getAttribute('contenteditable')).to.equal('false');
      expect(editable.getAttribute('aria-readonly')).to.equal('true');
    });

    it('shows the cell address in the name box', async () => {
      render(<Test formulaA1Notation />);
      await microtasks();
      focusCell(0, 'total');
      const address = getBar()!.querySelector('[aria-label="Active cell"]')!;
      expect(address.textContent).to.equal('D1');
    });
  });

  describe('view-mode editing (draft)', () => {
    it('publishes the draft for reference highlighting', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=price * 2');
      const activeEdit = privateApi().current.state.formula.activeEdit;
      expect(activeEdit).to.deep.equal({ id: 2, field: 'total', draft: '=price * 2' });
      // The bar text shows the draft, the cell keeps its committed value.
      expect(getBarEditable().textContent).to.equal('=price * 2');
      expect(getCell(2, 3).textContent).to.equal('8');
    });

    it('colors reference tokens in the bar', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=price * 2');
      const tokens = getBar()!.querySelectorAll('.MuiDataGrid-formulaReferenceToken');
      expect(tokens).to.have.length(1);
      expect(tokens[0].textContent).to.equal('price');
    });

    it('previews the draft result on the fly', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=price * 2');
      await waitFor(() => {
        const preview = getBar()!.querySelector('[role="status"]');
        expect(preview?.textContent).to.equal('= 8');
      });
    });

    it('previews error results', async () => {
      render(<Test />);
      await microtasks();
      focusCell(2, 'total');
      typeInBar('=1 / 0');
      await waitFor(() => {
        const preview = getBar()!.querySelector('[role="status"]');
        expect(preview?.textContent).to.equal('#DIV/0!');
      });
    });

    it('commits on Enter through processRowUpdate and moves the focus below', async () => {
      const processRowUpdate = spy((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await microtasks();
      focusCell(0, 'total');
      typeInBar('=price * quantity * 2');
      focusBar();
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity * 2');
      });
      expect(processRowUpdate.callCount).to.equal(1);
      expect(processRowUpdate.lastCall.args[0].total).to.equal('=price * quantity * 2');
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
