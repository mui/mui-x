import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, microtasks } from 'test/utils/helperFn';
import { describe, expect, it } from 'vitest';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { getCaretOffset, setCaretOffset } from '../components/formulaEditorCaret';

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
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

describe('<DataGridPremium /> - Formula autocomplete', () => {
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

  function getCellEditable(rowIndex: number, colIndex: number) {
    return getCell(rowIndex, colIndex).querySelector<HTMLElement>('[contenteditable]')!;
  }

  function getListbox() {
    return document.querySelector('[role="listbox"]');
  }

  function getOptionLabels() {
    const listbox = getListbox();
    if (!listbox) {
      return [];
    }
    // The first span is the suggestion label; the second is the detail/signature.
    return Array.from(listbox.querySelectorAll('li')).map((li) =>
      (li.querySelector('span')?.textContent || '').trim(),
    );
  }

  /**
   * Sets the editor value and the caret position, then dispatches the input the
   * editor listens to so the suggestion context is computed from a deterministic
   * caret. The formula editor is a `contenteditable`: there is no `.value` and no
   * `change` event, so the text is set directly and the caret placed explicitly
   * (jsdom does not move the caret to the end on a programmatic value set).
   */
  function typeFormula(editable: HTMLElement, value: string, caret = value.length) {
    editable.textContent = value;
    setCaretOffset(editable, caret);
    fireEvent.input(editable);
  }

  it('opens a ranked dropdown when typing a function prefix', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=SU');

    await waitFor(() => {
      expect(getListbox()).not.to.equal(null);
    });
    expect(getOptionLabels()[0]).to.contain('SUM');
  });

  it('suggests same-row field references', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=pr');

    await waitFor(() => {
      expect(getOptionLabels().some((label) => label.startsWith('price'))).to.equal(true);
    });
  });

  it('inserts a function with an open parenthesis on Enter', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=SU');
    await waitFor(() => {
      expect(getListbox()).not.to.equal(null);
    });

    fireEvent.keyDown(editable, { key: 'Enter' });
    await microtasks();

    expect(getCellEditable(0, 3).textContent).to.equal('=SUM(');
    // The cell stays in edit mode (the popup captured Enter, no commit).
    expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
  });

  it('moves the highlight with ArrowDown instead of navigating the grid', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=t');
    await waitFor(() => {
      expect(getOptionLabels().length).to.be.greaterThan(1);
    });

    const firstActive = document.querySelector('li[data-focused="true"]');
    fireEvent.keyDown(editable, { key: 'ArrowDown' });
    await microtasks();
    const secondActive = document.querySelector('li[data-focused="true"]');

    expect(secondActive).not.to.equal(firstActive);
    // Still editing the same cell — the grid did not move focus.
    expect(getCellEditable(0, 3)).to.equal(editable);
  });

  it('accepts the highlighted option on click', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=SU');
    await waitFor(() => {
      expect(getListbox()).not.to.equal(null);
    });

    const option = getListbox()!.querySelector('li')!;
    fireEvent.click(option);
    await microtasks();

    expect(getCellEditable(0, 3).textContent).to.equal('=SUM(');
  });

  it('closes the popup on the first Escape and cancels the edit on the second', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=SU');
    await waitFor(() => {
      expect(getListbox()).not.to.equal(null);
    });

    fireEvent.keyDown(editable, { key: 'Escape' });
    await waitFor(() => {
      expect(getListbox()).to.equal(null);
    });
    // The edit is still active after the first Escape closed the popup.
    expect(getCellEditable(0, 3)).not.to.equal(null);

    fireEvent.keyDown(getCellEditable(0, 3), { key: 'Escape' });
    await microtasks();
    // The formula is unchanged and the editor closed.
    expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
  });

  it('commits a completed formula on Enter without re-accepting a suggestion', async () => {
    const { user } = await render(<Test processRowUpdate={(row) => row} />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=price + quantity');
    fireEvent.keyDown(editable, { key: 'Enter' });
    await microtasks();

    expect(apiRef.current!.getRow(0).total).to.equal('=price + quantity');
  });

  it('keeps the accepted suggestion after the keystroke debounce window', async () => {
    const { user } = await render(<Test processRowUpdate={(row) => row} />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=quantit');
    await waitFor(() => {
      expect(getOptionLabels().some((label) => label.startsWith('quantity'))).to.equal(true);
    });
    fireEvent.keyDown(editable, { key: 'Enter' });
    await microtasks();
    expect(getCellEditable(0, 3).textContent).to.equal('=quantity');

    // Wait past the former 200ms keystroke-debounce window: a stranded debounce
    // timer would overwrite the accepted value with the partial token here.
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });

    fireEvent.keyDown(getCellEditable(0, 3), { key: 'Enter' });
    await microtasks();
    expect(apiRef.current!.getRow(0).total).to.equal('=quantity');
  });

  it('shows signature help while the caret is inside a function call', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=ROUND(');

    await waitFor(() => {
      expect(document.body.textContent).to.contain('ROUND(value, [digits])');
    });
  });

  it('does not show the dropdown when `disableFormulaAutocomplete` is set', async () => {
    const { user } = await render(<Test disableFormulaAutocomplete />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=SU');
    await microtasks();

    expect(getListbox()).to.equal(null);
  });

  it('suggests A1 column letters when A1 notation is on', async () => {
    const { user } = await render(<Test formulaA1Notation />);
    // The autogenerated row-number column shifts `total` to column index 4.
    await user.dblClick(getCell(0, 4));
    const editable = getCellEditable(0, 4);

    // "B" is the price column's letter.
    typeFormula(editable, '=B');
    await waitFor(() => {
      expect(getOptionLabels()).to.contain('B');
    });
  });

  it('freezes an A1 formula edited through a spliced suggestion to canonical on commit', async () => {
    const { user } = await render(<Test formulaA1Notation />);
    // The autogenerated row-number column shifts `total` to column index 4.
    await user.dblClick(getCell(0, 4));
    const editable = getCellEditable(0, 4);

    typeFormula(editable, '=SU');
    await waitFor(() => {
      expect(getListbox()).not.to.equal(null);
    });
    fireEvent.keyDown(editable, { key: 'Enter' });
    await microtasks();
    expect(getCellEditable(0, 4).textContent).to.equal('=SUM(');

    // Complete the call with an A1 whole-column reference and commit.
    typeFormula(editable, '=SUM(B:B)');
    fireEvent.keyDown(editable, { key: 'Enter' });
    await microtasks();

    expect(apiRef.current!.getRow(0).total).to.equal('=SUM(COLUMN_VALUES("price"))');
  });

  // Caret-sensitive behavior needs a real browser layout/selection.
  it.skipIf(isJSDOM)('places the caret inside the inserted parentheses', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    typeFormula(editable, '=SU');
    await waitFor(() => {
      expect(getListbox()).not.to.equal(null);
    });
    fireEvent.keyDown(editable, { key: 'Enter' });
    await microtasks();

    expect(getCellEditable(0, 3).textContent).to.equal('=SUM(');
    expect(getCaretOffset(getCellEditable(0, 3))).to.equal(5);
  });

  it.skipIf(isJSDOM)('splices a suggestion at the caret, preserving the suffix', async () => {
    const { user } = await render(<Test />);
    await user.dblClick(getCell(0, 3));
    const editable = getCellEditable(0, 3);

    // Caret right after "pr", before " + 1".
    typeFormula(editable, '=pr + 1', 3);
    await waitFor(() => {
      expect(getOptionLabels().some((label) => label.startsWith('price'))).to.equal(true);
    });
    fireEvent.keyDown(editable, { key: 'Tab' });
    await microtasks();

    expect(getCellEditable(0, 3).textContent).to.equal('=price + 1');
  });
});
