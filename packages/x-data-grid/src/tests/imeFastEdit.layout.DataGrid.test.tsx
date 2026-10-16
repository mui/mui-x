import * as React from 'react';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import type { DataGridProps, GridApi, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getActiveCell, getCell, getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';

const columns: GridColDef[] = [
  { field: 'name', editable: true },
  { field: 'city', editable: true },
  { field: 'age', type: 'number', editable: true },
  { field: 'note' },
];

const rows = [
  { id: 0, name: 'Nike', city: 'Seoul', age: 25, note: 'A' },
  { id: 1, name: 'Adidas', city: 'Tokyo', age: 36, note: 'B' },
  { id: 2, name: 'Puma', city: 'Osaka', age: 41, note: 'C' },
];

type TestCaseProps = Partial<DataGridProps> & {
  imeFastEdit?: boolean;
  rtl?: boolean;
  width?: number;
  height?: number;
};

let apiRef: React.RefObject<GridApi | null>;

function TestCase(props: TestCaseProps) {
  const { imeFastEdit = true, rtl = false, width = 500, height = 300, ...other } = props;
  apiRef = useGridApiRef();
  const grid = (
    <div style={{ width, height }} dir={rtl ? 'rtl' : undefined}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        experimentalFeatures={imeFastEdit ? { imeFastEdit: true } : {}}
        {...other}
      />
    </div>
  );
  if (!rtl) {
    return grid;
  }
  return <ThemeProvider theme={createTheme({ direction: 'rtl' })}>{grid}</ThemeProvider>;
}

const getInput = (cell: HTMLElement) => cell.querySelector('input');
const getPreMountedEditor = (cell: HTMLElement) =>
  cell.querySelector<HTMLElement>('[data-cell-editor="preMounted"]');

// Describes the active element without a reference to a DOM node, so that two renders can be compared.
function describeActiveElement() {
  const active = document.activeElement;
  if (!active || active === document.body) {
    return 'body';
  }
  const cell = active.closest('[role="gridcell"], [role="rowheader"]');
  if (cell) {
    // The hidden editor and its cell describe the same position. `expectFocusMatchesCell` checks the element.
    return `cell:${getActiveCell()}`;
  }
  const header = active.closest('[role="columnheader"]');
  if (header) {
    return `header:${header.getAttribute('aria-colindex')}:${header.textContent}`;
  }
  return `${active.tagName.toLowerCase()}:${active.getAttribute('aria-label') ?? active.textContent}`;
}

// With the flag, the active element is the hidden editor when the focused cell is an editable string cell.
function expectFocusMatchesCell(imeFastEdit: boolean) {
  const active = document.activeElement as HTMLElement;
  const cell = active.closest<HTMLElement>('[role="gridcell"]');
  if (!cell) {
    return;
  }
  const field = cell.getAttribute('data-field')!;
  const column = apiRef.current!.getColumn(field);
  const isEditableString = !!column?.editable && (column.type ?? 'string') === 'string';
  if (imeFastEdit && isEditableString) {
    expect(active.tagName).to.equal('INPUT');
    expect(getPreMountedEditor(cell)).not.to.equal(null);
    expect(cell).to.have.attribute('tabindex', '-1');
  } else {
    expect(active).to.equal(cell);
    expect(getPreMountedEditor(cell)).to.equal(null);
  }
}

describe('<DataGrid /> - IME fast edit layout', () => {
  const { render } = createRenderer();

  async function focusCell(user: any, row: number, col: number) {
    const cell = getCell(row, col);
    await user.click(cell);
    return cell;
  }

  // Runs the same scenario without and with the flag and returns the results.
  async function compareWithBaseline<T>(
    scenario: (imeFastEdit: boolean) => Promise<T>,
  ): Promise<{ baseline: T; withFlag: T }> {
    const baseline = await scenario(false);
    const withFlag = await scenario(true);
    return { baseline, withFlag };
  }

  async function pressKeys(user: any, keys: string[], imeFastEdit: boolean) {
    const result: string[] = [];
    for (const key of keys) {
      // eslint-disable-next-line no-await-in-loop
      await user.keyboard(key);
      result.push(describeActiveElement());
      expectFocusMatchesCell(imeFastEdit);
    }
    return result;
  }

  describe('RTL', () => {
    it('focuses the hidden editor in the focused editable cell', async () => {
      const { user } = render(<TestCase rtl />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell);
      expect(input).not.to.equal(null);
      expect(document.activeElement).to.equal(input);
      expect(getPreMountedEditor(cell)).not.to.equal(null);
      expect(cell).to.have.attribute('tabindex', '-1');
      expect(input).to.have.attribute('tabindex', '0');
      expect(getActiveCell()).to.equal('0-1');
      expect(cell.textContent).to.contain('Seoul');
    });

    it('navigates with the keyboard like the baseline', async () => {
      const keys = [
        '{ArrowLeft}',
        '{ArrowLeft}',
        '{ArrowRight}',
        '{End}',
        '{Home}',
        '{ArrowDown}',
        '{ArrowUp}',
        '{Control>}{End}{/Control}',
        '{Control>}{Home}{/Control}',
        '{ArrowRight}',
      ];
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase rtl imeFastEdit={imeFastEdit} />);
        await focusCell(user, 0, 1);
        expectFocusMatchesCell(imeFastEdit);
        const result = await pressKeys(user, keys, imeFastEdit);
        unmount();
        return result;
      });
      // In RTL, ArrowLeft moves to the next column.
      expect(baseline[0]).to.equal('cell:0-2');
      expect(baseline[2]).to.equal('cell:0-2');
      expect(baseline[3]).to.equal('cell:0-3');
      expect(baseline[4]).to.equal('cell:0-0');
      expect(withFlag).to.deep.equal(baseline);
    });

    it('starts cell edit mode with a composition and commits the value', async () => {
      const { user } = render(<TestCase rtl />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;

      fireEvent.compositionStart(input);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(input.value).to.equal('');

      fireEvent.change(input, { target: { value: '한' } });
      fireEvent.compositionEnd(input);
      fireEvent.change(input, { target: { value: '한글' } });
      expect(getInput(cell)).to.equal(input);

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('한글');
      });
      // Enter moves the focus to the cell below, which renders its own hidden editor.
      await waitFor(() => {
        expect(getActiveCell()).to.equal('1-1');
      });
      expect(document.activeElement).to.equal(getInput(getCell(1, 1)));
    });

    it('starts row edit mode with a composition and commits the value', async () => {
      const { user } = render(<TestCase rtl editMode="row" />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;

      fireEvent.compositionStart(input);
      expect(getCell(0, 0)).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(input.value).to.equal('');
      expect(getInput(getCell(0, 0))!.value).to.equal('Nike');

      fireEvent.change(input, { target: { value: '東京' } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('東京');
      });
      expect(getCell(0, 0).textContent).to.equal('Nike');
    });

    it('keeps Latin typing working', async () => {
      const { user } = render(<TestCase rtl />);
      const cell = await focusCell(user, 0, 0);
      const input = getInput(cell)!;
      await user.keyboard('x');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('x');
    });

    it.skipIf(isJSDOM)('keeps the cell layout and the scroll position', async () => {
      const measure = async (imeFastEdit: boolean) => {
        const { user, unmount } = render(<TestCase rtl imeFastEdit={imeFastEdit} />);
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        const cell = await focusCell(user, 0, 1);
        const range = document.createRange();
        range.selectNodeContents(cell.firstChild!);
        const textRect = range.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();
        const result = {
          cellScrollTop: cell.scrollTop,
          cellScrollLeft: cell.scrollLeft,
          textInsideCell:
            textRect.left >= cellRect.left &&
            textRect.right <= cellRect.right &&
            textRect.top >= cellRect.top &&
            textRect.bottom <= cellRect.bottom,
          textLeft: Math.round(textRect.left - cellRect.left),
          textRight: Math.round(cellRect.right - textRect.right),
          cellWidth: Math.round(cellRect.width),
          rowHeight: Math.round(getRow(0).getBoundingClientRect().height),
          scrollerScrollWidth: scroller.scrollWidth,
          scrollerScrollLeft: scroller.scrollLeft,
          scrollerScrollTop: scroller.scrollTop,
        };
        unmount();
        return result;
      };
      const { baseline, withFlag } = await compareWithBaseline(measure);
      expect(withFlag.cellScrollTop).to.equal(0);
      expect(withFlag.cellScrollLeft).to.equal(0);
      expect(withFlag.textInsideCell).to.equal(true);
      expect(withFlag).to.deep.equal(baseline);
    });

    it.skipIf(isJSDOM)('keeps the hidden editor out of the layout', async () => {
      const { user } = render(<TestCase rtl />);
      const cell = await focusCell(user, 0, 1);
      const wrapper = getPreMountedEditor(cell)!;
      const rect = wrapper.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      expect(rect.width).to.equal(0);
      expect(rect.height).to.equal(0);
      expect(getComputedStyle(wrapper).opacity).to.equal('0');
      expect(getComputedStyle(wrapper).position).to.equal('absolute');
      // The wrapper stays inside the cell, so it does not extend the scrollable area.
      expect(rect.left).to.be.at.least(cellRect.left);
      expect(rect.right).to.be.at.most(cellRect.right);
    });

    it.skipIf(isJSDOM)('keeps the focus outline', async () => {
      const { user } = render(<TestCase rtl />);
      const numberCell = await focusCell(user, 0, 2);
      const expected = getComputedStyle(numberCell);
      const expectedOutline = [expected.outlineStyle, expected.outlineWidth, expected.outlineColor];

      const cell = await focusCell(user, 0, 1);
      expect(document.activeElement).to.equal(getInput(cell));
      const actual = getComputedStyle(cell);
      expect([actual.outlineStyle, actual.outlineWidth, actual.outlineColor]).to.deep.equal(
        expectedOutline,
      );
      // The number cell lost its outline.
      expect(getComputedStyle(numberCell).outlineStyle).to.equal('none');
    });

    it.skipIf(isJSDOM)(
      'keeps the focus when the focused column is scrolled out of the render window',
      async () => {
        const manyColumns: GridColDef[] = Array.from({ length: 40 }, (_, index) => ({
          field: `c${index}`,
          editable: true,
          width: 100,
        }));
        const manyRows = [
          Object.fromEntries([['id', 0], ...manyColumns.map((c) => [c.field, 'x'])]),
        ];
        const { user } = render(
          <React.Fragment>
            <input data-testid="outside" />
            <TestCase rtl columns={manyColumns} rows={manyRows} columnBufferPx={0} />
          </React.Fragment>,
        );
        const cell = await focusCell(user, 0, 0);
        const input = getInput(cell)!;
        expect(document.activeElement).to.equal(input);
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;

        // In RTL, the scroll position moves to negative values.
        await act(async () => {
          scroller.scrollLeft = -3000;
          scroller.dispatchEvent(new Event('scroll'));
        });
        await waitFor(() => {
          expect(getCell(0, 30)).not.to.equal(null);
        });
        expect(document.activeElement).to.equal(input);
        expect(getActiveCell()).to.equal('0-0');

        // The editor must not take the focus back from an element outside of the grid.
        const outside = document.querySelector<HTMLInputElement>('[data-testid="outside"]')!;
        await act(async () => {
          outside.focus();
        });
        await act(async () => {
          scroller.scrollLeft = 0;
          scroller.dispatchEvent(new Event('scroll'));
        });
        await waitFor(() => {
          expect(getCell(0, 0)).not.to.equal(null);
        });
        expect(document.activeElement).to.equal(outside);
      },
    );

    it.skipIf(isJSDOM)('keeps the editor focused after a horizontal keyboard scroll', async () => {
      const manyColumns: GridColDef[] = Array.from({ length: 12 }, (_, index) => ({
        field: `c${index}`,
        editable: true,
        width: 100,
      }));
      const manyRows = [Object.fromEntries([['id', 0], ...manyColumns.map((c) => [c.field, 'x'])])];
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase
            rtl
            imeFastEdit={imeFastEdit}
            columns={manyColumns}
            rows={manyRows}
            columnBufferPx={0}
          />,
        );
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
        await focusCell(user, 0, 0);
        const result = await pressKeys(user, ['{End}', '{Home}', '{ArrowLeft}'], imeFastEdit);
        result.push(`scrollLeft:${Math.round(scroller.scrollLeft)}`);
        unmount();
        return result;
      });
      expect(baseline[0]).to.equal('cell:0-11');
      expect(withFlag).to.deep.equal(baseline);
    });
  });

  describe('column spanning', () => {
    const spanningColumns: GridColDef[] = [
      { field: 'name', editable: true, colSpan: (value, row) => (row.id === 0 ? 2 : 1) },
      { field: 'city', editable: true },
      { field: 'age', type: 'number', editable: true },
      { field: 'note' },
    ];

    it('navigates over a spanned cell like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase imeFastEdit={imeFastEdit} columns={spanningColumns} />,
        );
        await focusCell(user, 0, 0);
        const result = await pressKeys(
          user,
          ['{ArrowRight}', '{ArrowLeft}', '{ArrowDown}', '{ArrowRight}', '{ArrowUp}'],
          imeFastEdit,
        );
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal(['cell:0-2', 'cell:0-0', 'cell:1-0', 'cell:1-1', 'cell:0-0']);
      expect(withFlag).to.deep.equal(baseline);
    });

    it('commits a composition in a spanned cell', async () => {
      const { user } = render(<TestCase columns={spanningColumns} />);
      const cell = await focusCell(user, 0, 0);
      const input = getInput(cell)!;
      expect(document.activeElement).to.equal(input);
      fireEvent.compositionStart(input);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      fireEvent.change(input, { target: { value: '나이키' } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 0).textContent).to.equal('나이키');
      });
      expect(getCell(0, 0)).to.have.attribute('aria-colspan', '2');
    });
  });

  describe('row spanning', () => {
    const spanningRows = [
      { id: 0, name: 'Nike', city: 'Seoul', age: 25, note: 'A' },
      { id: 1, name: 'Adidas', city: 'Seoul', age: 36, note: 'B' },
      { id: 2, name: 'Puma', city: 'Osaka', age: 41, note: 'C' },
    ];

    it('navigates over a spanned cell like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase imeFastEdit={imeFastEdit} rows={spanningRows} rowSpanning />,
        );
        await focusCell(user, 0, 1);
        const result = await pressKeys(
          user,
          ['{ArrowDown}', '{ArrowUp}', '{ArrowLeft}', '{ArrowDown}', '{ArrowRight}'],
          imeFastEdit,
        );
        unmount();
        return result;
      });
      expect(withFlag).to.deep.equal(baseline);
    });

    it('focuses the hidden editor in the spanned cell and commits a composition', async () => {
      const { user } = render(<TestCase rows={spanningRows} rowSpanning />);
      const cell = await focusCell(user, 0, 1);
      expect(cell).to.have.attribute('aria-rowspan', '2');
      const input = getInput(cell)!;
      expect(document.activeElement).to.equal(input);
      fireEvent.compositionStart(input);
      expect(getInput(cell)).to.equal(input);
      fireEvent.change(input, { target: { value: '서울' } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('서울');
      });
    });
  });

  describe('column grouping', () => {
    const columnGroupingModel = [
      { groupId: 'Info', children: [{ field: 'name' }, { field: 'city' }] },
    ];

    it('moves the focus between the group headers and the hidden editor like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase imeFastEdit={imeFastEdit} columnGroupingModel={columnGroupingModel} />,
        );
        await focusCell(user, 0, 1);
        const result = await pressKeys(
          user,
          ['{ArrowUp}', '{ArrowUp}', '{ArrowDown}', '{ArrowDown}', '{ArrowRight}'],
          imeFastEdit,
        );
        unmount();
        return result;
      });
      expect(baseline[0]).to.equal('header:2:city');
      expect(baseline[1]).to.equal('header:1:Info');
      expect(baseline[3]).to.equal('cell:0-1');
      expect(withFlag).to.deep.equal(baseline);
    });
  });

  describe.skipIf(isJSDOM)('row heights', () => {
    const scenarios: { name: string; props: TestCaseProps }[] = [
      { name: 'compact density', props: { density: 'compact' } },
      { name: 'comfortable density', props: { density: 'comfortable' } },
      { name: 'dynamic row height', props: { getRowHeight: ({ id }) => (id === 0 ? 80 : 40) } },
      { name: 'auto row height', props: { getRowHeight: () => 'auto' } },
      { name: 'autoHeight', props: { autoHeight: true } },
    ];

    scenarios.forEach(({ name, props }) => {
      it(`keeps the row heights with ${name}`, async () => {
        const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
          const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} {...props} />);
          const heightsBefore = [0, 1].map((i) => getRow(i).getBoundingClientRect().height);
          await focusCell(user, 0, 1);
          const heightsAfter = [0, 1].map((i) => getRow(i).getBoundingClientRect().height);
          const cell = getCell(0, 1);
          const result = {
            heightsBefore,
            heightsAfter,
            cellHeight: cell.getBoundingClientRect().height,
            cellScrollTop: cell.scrollTop,
          };
          unmount();
          return result;
        });
        expect(withFlag.heightsAfter).to.deep.equal(withFlag.heightsBefore);
        expect(withFlag).to.deep.equal(baseline);
      });
    });
  });

  describe.skipIf(isJSDOM)('column sizing', () => {
    const getWidths = () =>
      columns.map((_, i) => Math.round(getColumnHeaderCell(i).getBoundingClientRect().width));

    it('autosizes the columns like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} />);
        await focusCell(user, 0, 1);
        await act(async () => apiRef.current?.autosizeColumns({ includeOutliers: true }));
        const widths = getWidths();
        await act(async () =>
          apiRef.current?.autosizeColumns({ includeHeaders: true, includeOutliers: true }),
        );
        const widthsWithHeaders = getWidths();
        const activeElement = describeActiveElement();
        unmount();
        return { widths, widthsWithHeaders, activeElement };
      });
      expect(withFlag).to.deep.equal(baseline);
    });

    // The `mouseup` of the resize clears the focus state (`useGridFocus.handleDocumentClick`)
    // while the DOM focus stays in the cell. The hidden editor must keep the DOM focus, like the cell
    // element does without the flag.
    it('resizes a column with the focus in the hidden editor like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} />);
        const cell = await focusCell(user, 0, 1);
        const input = getInput(cell);
        const separator = document.querySelectorAll('.MuiDataGrid-columnSeparator--resizable')[1];
        fireEvent.mouseDown(separator, { clientX: 100 });
        fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
        fireEvent.mouseUp(separator);
        await waitFor(() => {
          expect(getColumnHeaderCell(1)).toHaveInlineStyle({ width: '150px' });
        });
        const result = {
          cellWidth: Math.round(getCell(0, 1).getBoundingClientRect().width),
          activeElement: describeActiveElement(),
          sameInput: getInput(cell) === input,
        };
        unmount();
        return result;
      });
      expect(baseline.cellWidth).to.equal(150);
      expect(withFlag).to.deep.equal({ ...baseline, sameInput: true });
    });
  });

  describe('focus', () => {
    // Same root cause as the column resize test: a `mouseup` outside the cells clears the focus
    // state while the DOM focus stays in the hidden editor.
    it.skipIf(isJSDOM)(
      'keeps the DOM focus when a toolbar button prevents the default mousedown',
      async () => {
        const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
          const { user, unmount } = render(
            <React.Fragment>
              <button
                type="button"
                data-testid="toolbar"
                onMouseDown={(event) => event.preventDefault()}
              >
                bold
              </button>
              <TestCase imeFastEdit={imeFastEdit} />
            </React.Fragment>,
          );
          await focusCell(user, 0, 1);
          await user.click(document.querySelector('[data-testid="toolbar"]')!);
          const afterClick = describeActiveElement();
          await user.keyboard('{ArrowDown}');
          const afterArrowDown = describeActiveElement();
          unmount();
          return { afterClick, afterArrowDown };
        });
        expect(baseline).to.deep.equal({ afterClick: 'cell:0-1', afterArrowDown: 'cell:1-1' });
        expect(withFlag).to.deep.equal(baseline);
      },
    );
  });

  describe('keyboard', () => {
    const manyRows = Array.from({ length: 40 }, (_, index) => ({
      id: index,
      name: `Name ${index}`,
      city: `City ${index}`,
      age: index,
      note: '',
    }));

    // Needs the viewport page size.
    it.skipIf(isJSDOM)('moves with PageDown and PageUp like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} rows={manyRows} />);
        await focusCell(user, 0, 1);
        const result = await pressKeys(
          user,
          ['{PageDown}', '{PageDown}', '{PageUp}', '{Control>}{End}{/Control}'],
          imeFastEdit,
        );
        unmount();
        return result;
      });
      expect(baseline[0]).not.to.equal('cell:0-1');
      expect(withFlag).to.deep.equal(baseline);
    });

    (['none', 'content', 'header', 'all'] as const).forEach((tabNavigation) => {
      it(`handles Tab and Shift+Tab with tabNavigation="${tabNavigation}" like the baseline`, async () => {
        const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
          const { user, unmount } = render(
            <React.Fragment>
              <button type="button">before</button>
              <TestCase imeFastEdit={imeFastEdit} tabNavigation={tabNavigation} hideFooter />
              <button type="button">after</button>
            </React.Fragment>,
          );
          await focusCell(user, 0, 1);
          const result = await pressKeys(user, ['{Tab}'], imeFastEdit);
          await focusCell(user, 0, 1);
          result.push(...(await pressKeys(user, ['{Shift>}{Tab}{/Shift}'], imeFastEdit)));
          await focusCell(user, 0, 2);
          result.push(...(await pressKeys(user, ['{Tab}'], imeFastEdit)));
          unmount();
          return result;
        });
        expect(withFlag).to.deep.equal(baseline);
      });
    });

    it('selects all rows with Ctrl+A like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} checkboxSelection />);
        const cell = await focusCell(user, 0, 1);
        // With the flag, the hidden editor has the focus.
        fireEvent.keyDown(getInput(cell) ?? cell, { key: 'a', keyCode: 65, ctrlKey: true });
        const result = {
          selected: apiRef.current!.getSelectedRows().size,
          editing: cell.classList.contains('MuiDataGrid-cell--editing'),
          inputValue: getInput(cell)?.value ?? '',
        };
        unmount();
        return result;
      });
      expect(baseline.selected).to.equal(rows.length);
      expect(withFlag).to.deep.equal(baseline);
    });

    it('toggles the row selection with Shift+Space like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase imeFastEdit={imeFastEdit} checkboxSelection disableRowSelectionOnClick />,
        );
        // Column 0 is the checkbox column, so column 2 is the editable string column `city`.
        const cell = await focusCell(user, 0, 2);
        expect(cell).to.have.attribute('data-field', 'city');
        expectFocusMatchesCell(imeFastEdit);
        await user.keyboard('{Shift>}[Space]{/Shift}');
        const afterShiftSpace = apiRef.current!.getSelectedRows().size;
        await user.keyboard('[Space]');
        const afterSpace = apiRef.current!.getSelectedRows().size;
        await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
        const afterShiftArrow = Array.from(apiRef.current!.getSelectedRows().keys());
        const result = {
          afterShiftSpace,
          afterSpace,
          afterShiftArrow,
          editing: cell.classList.contains('MuiDataGrid-cell--editing'),
          inputValue: getInput(cell)?.value ?? '',
          activeElement: describeActiveElement(),
        };
        unmount();
        return result;
      });
      expect(baseline.afterShiftSpace).to.equal(1);
      expect(baseline.editing).to.equal(false);
      expect(withFlag).to.deep.equal(baseline);
    });

    // Needs the viewport page size.
    it.skipIf(isJSDOM)(
      'moves one page down with Space like the baseline and does not type a space',
      async () => {
        const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
          const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} />);
          const cell = await focusCell(user, 0, 1);
          const input = getInput(cell);
          const result = await pressKeys(user, ['[Space]'], imeFastEdit);
          result.push(`editing:${cell.classList.contains('MuiDataGrid-cell--editing')}`);
          result.push(`value:${input?.value ?? ''}`);
          const target = document.activeElement!.closest<HTMLElement>('[role="gridcell"]')!;
          result.push(`targetValue:${getInput(target)?.value ?? ''}`);
          unmount();
          return result;
        });
        // Space moves one page down in a body cell.
        expect(baseline[0]).to.equal('cell:2-1');
        expect(withFlag).to.deep.equal(baseline);
      },
    );

    it('moves the focus after a commit with Tab like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} />);
        await focusCell(user, 0, 0);
        await user.keyboard('x');
        await user.keyboard('{Tab}');
        const afterTab = describeActiveElement();
        expectFocusMatchesCell(imeFastEdit);
        await user.keyboard('y');
        await user.keyboard('{Shift>}{Tab}{/Shift}');
        const afterShiftTab = describeActiveElement();
        expectFocusMatchesCell(imeFastEdit);
        const values = [getCell(0, 0).textContent, getCell(0, 1).textContent];
        unmount();
        return { afterTab, afterShiftTab, values };
      });
      expect(baseline).to.deep.equal({
        afterTab: 'cell:0-1',
        afterShiftTab: 'cell:0-0',
        values: ['x', 'y'],
      });
      expect(withFlag).to.deep.equal(baseline);
    });
  });
});
