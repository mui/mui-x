import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  GRID_AGGREGATION_FUNCTIONS,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  gridClasses,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridAggregationFunction,
  GridApi,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { getCell, getRows, microtasks } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';

const EDITOR_SELECTOR = '[data-cell-editor]';
const PRE_MOUNTED_SELECTOR = '[data-cell-editor="preMounted"]';

const getInput = (cell: HTMLElement) => cell.querySelector('input');
const getEditors = () => document.querySelectorAll(EDITOR_SELECTOR);

// The element that has the focus in a focused editable string cell: the hidden editor with the flag, the cell without it.
function getFocusTarget(cell: HTMLElement, imeFastEdit: boolean) {
  const target = imeFastEdit ? getInput(cell)! : cell;
  expect(document.activeElement).to.equal(target);
  return target;
}

// Joins the string values of a column, so that an edit of a leaf changes the aggregated value.
const joinAggregation: GridAggregationFunction<string> = {
  apply: ({ values }) => values.filter((value) => value != null).join(','),
  label: 'join',
  columnTypes: ['string'],
};

const rows = [
  { id: 0, category: 'Cat A', name: 'Nike', amount: 10 },
  { id: 1, category: 'Cat A', name: 'Adidas', amount: 20 },
  { id: 2, category: 'Cat B', name: 'Puma', amount: 30 },
];

const columns: GridColDef[] = [
  { field: 'category', editable: true },
  { field: 'name', editable: true },
  { field: 'amount', type: 'number', editable: true },
];

function compose(input: HTMLInputElement, value: string) {
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value } });
  fireEvent.compositionEnd(input);
}

describe('<DataGridPremium /> - IME fast edit with analytics features', () => {
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
      <div style={{ width: 600, height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          autoHeight={isJSDOM}
          disableVirtualization
          rows={rows}
          columns={columns}
          experimentalFeatures={{ imeFastEdit: true }}
          {...props}
        />
      </div>
    );
  }

  function colIndex(field: string) {
    return apiRef.current!.getColumnIndex(field);
  }

  describe('row grouping', () => {
    const groupingProps: Partial<DataGridPremiumProps> = {
      initialState: { rowGrouping: { model: ['category'] } },
      defaultGroupingExpansionDepth: -1,
      rowGroupingColumnMode: 'single',
    };

    it('focuses the hidden editor in a leaf cell of an editable string column', async () => {
      const { user } = await render(<Test {...groupingProps} />);
      // Rows: Cat A (group), Nike, Adidas, Cat B (group), Puma
      const cell = getCell(1, colIndex('name'));
      await user.click(cell);
      const input = getInput(cell);
      expect(input).not.to.equal(null);
      expect(document.activeElement).to.equal(input);
      expect(cell.textContent).to.equal('Nike');
      expect(getEditors()).to.have.length(1);
    });

    it('does not render the editor in a group row', async () => {
      const { user } = await render(<Test {...groupingProps} />);
      const groupingCell = getCell(0, colIndex(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD));
      await user.click(groupingCell);
      expect(document.activeElement).to.equal(groupingCell);
      expect(getEditors()).to.have.length(0);

      // The `name` column is editable, but the group row is not.
      const nameCell = getCell(0, colIndex('name'));
      await user.click(nameCell);
      expect(document.activeElement).to.equal(nameCell);
      expect(getEditors()).to.have.length(0);
    });

    it('moves the editor across a group row with the keyboard', async () => {
      const { user } = await render(<Test {...groupingProps} />);
      const nameIndex = colIndex('name');
      await user.click(getCell(1, nameIndex));
      expect(document.activeElement).to.equal(getInput(getCell(1, nameIndex)));

      await user.keyboard('{ArrowUp}');
      await waitFor(() => {
        expect(document.activeElement).to.equal(getCell(0, nameIndex));
      });
      expect(getEditors()).to.have.length(0);

      await user.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(1, nameIndex)));
      });
      expect(getEditors()).to.have.length(1);
    });

    [true, false].forEach((imeFastEdit) => {
      it(`collapses and expands a group with Space after the focus leaves a leaf editor (flag ${imeFastEdit})`, async () => {
        const { user } = await render(
          <Test {...groupingProps} experimentalFeatures={{ imeFastEdit }} />,
        );
        const nameIndex = colIndex('name');
        const groupingIndex = colIndex(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD);
        expect(getRows()).to.have.length(5);

        await user.click(getCell(1, nameIndex));
        getFocusTarget(getCell(1, nameIndex), imeFastEdit);

        await user.keyboard('{ArrowUp}');
        // The grouping column is the first column.
        await user.keyboard('{Home}');
        await waitFor(() => {
          expect(document.activeElement).to.equal(getCell(0, groupingIndex));
        });

        await user.keyboard(' ');
        await waitFor(() => {
          expect(getRows()).to.have.length(3);
        });
        expect(getEditors()).to.have.length(0);

        await user.keyboard(' ');
        await waitFor(() => {
          expect(getRows()).to.have.length(5);
        });
      });
    });

    it('commits a composed value in a leaf cell and keeps the grouping', async () => {
      const { user } = await render(<Test {...groupingProps} />);
      const nameIndex = colIndex('name');
      const cell = getCell(1, nameIndex);
      await user.click(cell);
      const input = getInput(cell)!;

      compose(input, '나이키');
      expect(cell).to.have.class(gridClasses['cell--editing']);
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('나이키');

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(1, nameIndex).textContent).to.equal('나이키');
      });
      expect(getRows()).to.have.length(5);
      expect(getCell(0, colIndex(GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD)).textContent).to.equal(
        'Cat A (2)',
      );
      expect(apiRef.current!.getRow(0).name).to.equal('나이키');
    });

    it('starts edit mode with a Latin key in a leaf cell', async () => {
      const { user } = await render(<Test {...groupingProps} />);
      const cell = getCell(2, colIndex('name'));
      await user.click(cell);
      const input = getInput(cell)!;
      await user.keyboard('x');
      expect(cell).to.have.class(gridClasses['cell--editing']);
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('x');
    });

    it.skipIf(isJSDOM)('does not scroll the content of a focused leaf cell', async () => {
      const { user } = await render(<Test {...groupingProps} />);
      const cell = getCell(1, colIndex('name'));
      await user.click(cell);
      expect(document.activeElement).to.equal(getInput(cell));
      expect(cell.scrollTop).to.equal(0);
      expect(cell.scrollLeft).to.equal(0);
    });
  });

  describe('aggregation', () => {
    const aggregationProps: Partial<DataGridPremiumProps> = {
      aggregationFunctions: { ...GRID_AGGREGATION_FUNCTIONS, join: joinAggregation },
      initialState: { aggregation: { model: { amount: 'sum', name: 'join' } } },
    };

    it('does not render the editor in the aggregation footer row', async () => {
      const { user } = await render(<Test {...aggregationProps} />);
      const footerCell = getCell(3, colIndex('name'));
      expect(footerCell.textContent).to.equal('Nike,Adidas,Puma');
      await user.click(footerCell);
      expect(document.activeElement).to.equal(footerCell);
      expect(getEditors()).to.have.length(0);
    });

    it('does not render the editor in an aggregated group row', async () => {
      const { user } = await render(
        <Test
          {...aggregationProps}
          initialState={{
            rowGrouping: { model: ['category'] },
            aggregation: { model: { amount: 'sum', name: 'join' } },
          }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      const groupCell = getCell(0, colIndex('name'));
      expect(groupCell.textContent).to.equal('Nike,Adidas');
      await user.click(groupCell);
      expect(document.activeElement).to.equal(groupCell);
      expect(getEditors()).to.have.length(0);
    });

    it('recomputes the footer aggregation after a composed value is committed', async () => {
      const { user } = await render(<Test {...aggregationProps} />);
      const nameIndex = colIndex('name');
      const cell = getCell(0, nameIndex);
      await user.click(cell);
      const input = getInput(cell)!;
      expect(document.activeElement).to.equal(input);

      compose(input, '나이키');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(3, nameIndex).textContent).to.equal('나이키,Adidas,Puma');
      });
      expect(getCell(0, nameIndex).textContent).to.equal('나이키');
    });

    it('recomputes the group and footer aggregations after a Latin edit', async () => {
      const { user } = await render(
        <Test
          {...aggregationProps}
          initialState={{
            rowGrouping: { model: ['category'] },
            aggregation: { model: { amount: 'sum', name: 'join' } },
          }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      const nameIndex = colIndex('name');
      // Rows: Cat A (group), Nike, Adidas, Cat B (group), Puma, footer
      await user.click(getCell(2, nameIndex));
      await user.keyboard('Z');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, nameIndex).textContent).to.equal('Nike,Z');
      });
      expect(getCell(5, nameIndex).textContent).to.equal('Nike,Z,Puma');
    });
  });

  describe('pivoting', () => {
    const pivotModel = {
      rows: [{ field: 'category' }],
      columns: [],
      values: [{ field: 'amount', aggFunc: 'sum' }],
    };

    it('does not render the editor in pivot mode', async () => {
      const { user } = await render(<Test pivotActive pivotModel={pivotModel} />);
      await waitFor(() => {
        expect(getCell(0, 0).textContent).to.equal('Cat A (2)');
      });
      await user.click(getCell(0, 0));
      expect(document.activeElement).to.equal(getCell(0, 0));
      await user.click(getCell(0, 1));
      expect(document.activeElement).to.equal(getCell(0, 1));
      expect(getEditors()).to.have.length(0);
    });

    it('removes the hidden editor when pivot mode starts and renders it again after pivot mode stops', async () => {
      const { user, setProps } = await render(<Test pivotActive={false} pivotModel={pivotModel} />);
      const cell = getCell(0, colIndex('name'));
      await user.click(cell);
      expect(document.activeElement).to.equal(getInput(cell));

      setProps({ pivotActive: true });
      await waitFor(() => {
        expect(getCell(0, 0).textContent).to.equal('Cat A (2)');
      });
      expect(getEditors()).to.have.length(0);

      setProps({ pivotActive: false });
      await waitFor(() => {
        expect(getCell(0, colIndex('name')).textContent).to.equal('Nike');
      });
      const cellAfter = getCell(0, colIndex('name'));
      await user.click(cellAfter);
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(cellAfter));
      });
      expect(getEditors()).to.have.length(1);
    });
  });

  describe('formulas', () => {
    const formulaRows = [
      { id: 0, item: 'Apple', label: 'a', price: 2, quantity: 3, total: '=price * quantity' },
      { id: 1, item: 'Banana', label: 'b', price: 1, quantity: 5, total: '=price * quantity' },
      { id: 2, item: 'Cherry', label: 'c', price: 4, quantity: 2, total: 8 },
    ];
    const formulaColumns: GridColDef[] = [
      { field: 'item', editable: true },
      { field: 'label', editable: true, allowFormulas: true },
      { field: 'price', type: 'number', editable: true },
      { field: 'quantity', type: 'number' },
      { field: 'total', type: 'number', allowFormulas: true, editable: true },
    ];
    const formulaProps: Partial<DataGridPremiumProps> = {
      featureDependencies: { formula: formulaFeature },
      rows: formulaRows,
      columns: formulaColumns,
    };

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

    // See formulaBar.DataGridPremium.test.tsx
    function clickIntoBar() {
      const editable = getBarEditable();
      fireEvent.mouseDown(editable);
      act(() => {
        editable.focus();
      });
      fireEvent.mouseUp(editable);
    }

    it('does not render the editor in an `allowFormulas` string column', async () => {
      const { user } = await render(<Test {...formulaProps} />);
      const cell = getCell(0, 1);
      expect(cell.textContent).to.equal('a');
      await user.click(cell);
      expect(document.activeElement).to.equal(cell);
      expect(getEditors()).to.have.length(0);

      // Editing still works with the formula edit component.
      await user.keyboard('x');
      await waitFor(() => {
        expect(cell).to.have.class(gridClasses['cell--editing']);
      });
    });

    it('does not render the editor in a formula cell', async () => {
      const { user } = await render(<Test {...formulaProps} />);
      const cell = getCell(0, 4);
      expect(cell.textContent).to.equal('6');
      await user.click(cell);
      expect(document.activeElement).to.equal(cell);
      expect(getEditors()).to.have.length(0);
    });

    it('composes in a plain string column next to a formula column', async () => {
      const { user } = await render(<Test {...formulaProps} />);
      const cell = getCell(0, 0);
      await user.click(cell);
      const input = getInput(cell)!;
      expect(document.activeElement).to.equal(input);

      compose(input, 'りんご');
      expect(cell).to.have.class(gridClasses['cell--editing']);
      expect(getInput(cell)).to.equal(input);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 0).textContent).to.equal('りんご');
      });
      expect(getCell(0, 4).textContent).to.equal('6');
      expect(apiRef.current!.getRow(0).total).to.equal('=price * quantity');
    });

    it('does not take the focus from the formula bar', async () => {
      const { user } = await render(
        <Test {...formulaProps} showToolbar slotProps={{ toolbar: { formulaBar: true } }} />,
      );
      const cell = getCell(0, 0);
      await user.click(cell);
      expect(document.activeElement).to.equal(getInput(cell));
      expect(getBarEditable().textContent).to.equal('Apple');

      clickIntoBar();
      expect(document.activeElement).to.equal(getBarEditable());
      // The hidden editor stays rendered for the active cell, but it does not take the focus.
      expect(getEditors()).to.have.length(1);

      // A composition in the bar does not start edit mode in the cell.
      fireEvent.compositionStart(getBarEditable());
      expect(cell).not.to.have.class(gridClasses['cell--editing']);
      expect(document.activeElement).to.equal(getBarEditable());

      typeInBar('Pear');
      expect(document.activeElement).to.equal(getBarEditable());
      expect(getCell(0, 0).textContent).to.equal('Apple');
    });

    it('moves the focus to the hidden editor of the cell below after Enter in the formula bar', async () => {
      const { user } = await render(
        <Test {...formulaProps} showToolbar slotProps={{ toolbar: { formulaBar: true } }} />,
      );
      await user.click(getCell(0, 0));
      clickIntoBar();
      typeInBar('Pear');
      fireEvent.keyDown(getBarEditable(), { key: 'Enter' });
      await waitFor(() => {
        expect(getCell(0, 0).textContent).to.equal('Pear');
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(1, 0)));
      });
      expect(getEditors()).to.have.length(1);
      expect(getBarEditable().textContent).to.equal('Banana');
    });
  });

  describe('cell selection and fill handle', () => {
    const fillColumns: GridColDef[] = [
      { field: 'id', type: 'number' },
      { field: 'name', editable: true },
      { field: 'category', editable: true },
      { field: 'value', type: 'number', editable: true },
    ];
    const fillRows = [
      { id: 0, name: 'Alice', category: 'A', value: 10 },
      { id: 1, name: 'Bob', category: 'B', value: 20 },
      { id: 2, name: 'Charlie', category: 'C', value: 30 },
    ];

    function FillTest(props: Partial<DataGridPremiumProps>) {
      return (
        <Test
          rows={fillRows}
          columns={fillColumns}
          rowSelection={false}
          cellSelection
          cellSelectionFillHandle
          hideFooter
          {...props}
        />
      );
    }

    [true, false].forEach((imeFastEdit) => {
      it(`fills down with Ctrl+D sent to the active element (flag ${imeFastEdit})`, async () => {
        const processRowUpdate = vi.fn((newRow) => newRow);
        const { user } = await render(
          <FillTest experimentalFeatures={{ imeFastEdit }} processRowUpdate={processRowUpdate} />,
        );
        const cell = getCell(0, 1);
        await user.click(cell);
        const target = getFocusTarget(cell, imeFastEdit);

        fireEvent.keyDown(target, { key: 'd', keyCode: 68, ctrlKey: true });
        await waitFor(() => {
          expect(getCell(1, 1).textContent).to.equal('Alice');
        });
        expect(processRowUpdate.mock.calls.length).to.equal(1);
        expect(getCell(1, 1)).to.have.class('Mui-selected');
      });

      it(`fills right with Ctrl+R sent to the active element (flag ${imeFastEdit})`, async () => {
        const { user } = await render(<FillTest experimentalFeatures={{ imeFastEdit }} />);
        const cell = getCell(0, 1);
        await user.click(cell);
        const target = getFocusTarget(cell, imeFastEdit);
        fireEvent.keyDown(target, { key: 'r', keyCode: 82, ctrlKey: true });
        await waitFor(() => {
          expect(getCell(0, 2).textContent).to.equal('Alice');
        });
      });
    });

    it('shows the fill handle on the focused cell with the hidden editor', async () => {
      const { user } = await render(<FillTest />);
      const cell = getCell(0, 1);
      await user.click(cell);
      expect(document.activeElement).to.equal(getInput(cell));
      expect(cell).to.have.class(gridClasses['cell--withFillHandle']);
    });

    it('extends the cell selection with Shift+ArrowDown from the hidden editor', async () => {
      const { user } = await render(<FillTest />);
      const cell = getCell(0, 1);
      await user.click(cell);
      const input = getInput(cell)!;
      fireEvent.keyDown(input, { key: 'ArrowDown', shiftKey: true });
      await waitFor(() => {
        expect(getCell(1, 1)).to.have.class('Mui-selected');
      });
      expect(getCell(0, 1)).to.have.class('Mui-selected');
      expect(document.activeElement).to.equal(input);
      expect(cell).not.to.have.class(gridClasses['cell--editing']);
    });

    it('selects all cells with Ctrl+A from the hidden editor', async () => {
      const { user } = await render(<FillTest />);
      const cell = getCell(0, 1);
      await user.click(cell);
      fireEvent.keyDown(getInput(cell)!, { key: 'a', keyCode: 65, ctrlKey: true });
      await waitFor(() => {
        expect(getCell(2, 2)).to.have.class('Mui-selected');
      });
      expect(cell).not.to.have.class(gridClasses['cell--editing']);
    });

    it.skipIf(isJSDOM)('fills down with the mouse from a cell with the hidden editor', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      const { user } = await render(<FillTest processRowUpdate={processRowUpdate} />);
      const sourceCell = getCell(0, 1);
      await user.click(sourceCell);
      expect(document.activeElement).to.equal(getInput(sourceCell));
      const targetCell = getCell(2, 1);

      /* eslint-disable testing-library/no-unnecessary-act */
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
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve as FrameRequestCallback);
          });
        });
      });
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });
      /* eslint-enable testing-library/no-unnecessary-act */

      await waitFor(() => {
        expect(getCell(2, 1).textContent).to.equal('Alice');
      });
      expect(getCell(1, 1).textContent).to.equal('Alice');
      expect(processRowUpdate.mock.calls.length).to.equal(2);
    });
  });

  describe('clipboard', () => {
    let writeText: MockInstance | undefined;

    afterEach(() => {
      writeText?.mockRestore();
    });

    function ClipboardTest(props: Partial<DataGridPremiumProps>) {
      return <Test rowSelection={false} cellSelection disableRowSelectionOnClick {...props} />;
    }

    function paste(target: Element, pasteText: string) {
      const pasteEvent = new Event('paste');
      // @ts-expect-error The synthetic Event supplies clipboardData, which only ClipboardEvent declares.
      pasteEvent.clipboardData = { getData: () => pasteText };
      fireEvent.keyDown(target, { key: 'v', keyCode: 86, ctrlKey: true });
      act(() => document.activeElement!.dispatchEvent(pasteEvent));
    }

    it('copies the focused cell with Ctrl+C sent to the hidden editor', async () => {
      const { user } = await render(<ClipboardTest />);
      writeText = vi.spyOn(navigator.clipboard, 'writeText');
      const cell = getCell(0, colIndex('name'));
      await user.click(cell);
      const input = getInput(cell)!;
      expect(document.activeElement).to.equal(input);

      fireEvent.keyDown(input, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.mock.calls[0][0]).to.equal('Nike');
      expect(cell).not.to.have.class(gridClasses['cell--editing']);
    });

    it('copies a cell range with Ctrl+C sent to the hidden editor', async () => {
      const { user } = await render(<ClipboardTest />);
      writeText = vi.spyOn(navigator.clipboard, 'writeText');
      const nameIndex = colIndex('name');
      await user.click(getCell(0, nameIndex));
      const input = getFocusTarget(getCell(0, nameIndex), true);
      fireEvent.keyDown(input, { key: 'Shift' });
      fireEvent.click(getCell(1, nameIndex), { shiftKey: true });

      expect(document.activeElement).to.equal(input);
      fireEvent.keyDown(input, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.mock.calls[0][0]).to.equal(['Nike', 'Adidas'].join('\r\n'));
    });

    [true, false].forEach((imeFastEdit) => {
      it(`pastes into the focused cell with Ctrl+V sent to the active element (flag ${imeFastEdit})`, async () => {
        const { user } = await render(<ClipboardTest experimentalFeatures={{ imeFastEdit }} />);
        const nameIndex = colIndex('name');
        const cell = getCell(0, nameIndex);
        await user.click(cell);
        const target = getFocusTarget(cell, imeFastEdit);

        paste(target, 'X\nY');
        await waitFor(() => {
          expect(getCell(0, nameIndex).textContent).to.equal('X');
        });
        expect(getCell(1, nameIndex).textContent).to.equal('Y');
        // The paste returns the focus to the element that had it.
        await waitFor(() => {
          expect(document.activeElement).to.equal(
            imeFastEdit ? getInput(getCell(0, nameIndex)) : getCell(0, nameIndex),
          );
        });
        expect(getCell(0, nameIndex)).not.to.have.class(gridClasses['cell--editing']);
      });
    });

    it('does not paste while a composition is in progress', async () => {
      const { user } = await render(<ClipboardTest />);
      const nameIndex = colIndex('name');
      const cell = getCell(0, nameIndex);
      await user.click(cell);
      const input = getInput(cell)!;
      fireEvent.compositionStart(input);
      expect(cell).to.have.class(gridClasses['cell--editing']);

      fireEvent.keyDown(input, { key: 'v', keyCode: 86, ctrlKey: true });
      await microtasks();
      // The paste did not create its own input, so the editor keeps the focus.
      expect(document.activeElement).to.equal(input);
      expect(apiRef.current!.getRow(0).name).to.equal('Nike');
    });
  });

  describe('undo and redo', () => {
    function HistoryTest(props: Partial<DataGridPremiumProps>) {
      return <Test rowSelection={false} cellSelection {...props} />;
    }

    it('undoes and redoes a committed composition with Ctrl+Z and Ctrl+Y sent to the hidden editor', async () => {
      const { user } = await render(<HistoryTest />);
      const nameIndex = colIndex('name');
      const cell = getCell(0, nameIndex);
      await user.click(cell);
      compose(getInput(cell)!, '나이키');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, nameIndex).textContent).to.equal('나이키');
      });
      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });
      // Enter moved the focus to the cell below.
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(1, nameIndex)));
      });
      const inputBelow = getInput(getCell(1, nameIndex))!;

      fireEvent.keyDown(inputBelow, { key: 'z', keyCode: 90, ctrlKey: true });
      await waitFor(() => {
        expect(getCell(0, nameIndex).textContent).to.equal('Nike');
      });
      expect(getCell(1, nameIndex)).not.to.have.class(gridClasses['cell--editing']);

      // Undo moves the focus to the reverted cell, so its hidden editor gets the DOM focus.
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(0, nameIndex)));
      });
      fireEvent.keyDown(getInput(getCell(0, nameIndex))!, {
        key: 'y',
        keyCode: 89,
        ctrlKey: true,
      });
      await waitFor(() => {
        expect(getCell(0, nameIndex).textContent).to.equal('나이키');
      });
      expect(getEditors()).to.have.length(1);
    });

    it('undoes a paste with Ctrl+Z sent to the hidden editor', async () => {
      const { user } = await render(<HistoryTest />);
      const nameIndex = colIndex('name');
      const cell = getCell(0, nameIndex);
      await user.click(cell);
      const input = getInput(cell)!;

      const pasteEvent = new Event('paste');
      // @ts-expect-error The synthetic Event supplies clipboardData, which only ClipboardEvent declares.
      pasteEvent.clipboardData = { getData: () => 'Pasted' };
      fireEvent.keyDown(input, { key: 'v', keyCode: 86, ctrlKey: true });
      act(() => document.activeElement!.dispatchEvent(pasteEvent));
      await waitFor(() => {
        expect(getCell(0, nameIndex).textContent).to.equal('Pasted');
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(0, nameIndex)));
      });

      fireEvent.keyDown(getInput(getCell(0, nameIndex))!, { key: 'z', keyCode: 90, ctrlKey: true });
      await waitFor(() => {
        expect(getCell(0, nameIndex).textContent).to.equal('Nike');
      });
      expect(document.querySelector(PRE_MOUNTED_SELECTOR)).not.to.equal(null);
    });
  });
});
