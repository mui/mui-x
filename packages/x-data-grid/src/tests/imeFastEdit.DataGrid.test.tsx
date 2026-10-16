import * as React from 'react';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGrid, GridEditInputCell } from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridCellModesModel,
  GridColDef,
  GridRenderCellParams,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { getCell, getColumnHeaderCell } from 'test/utils/helperFn';
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
];

function TestCase(props: Partial<DataGridProps>) {
  return (
    <div style={{ width: 500, height: 300 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        experimentalFeatures={{ imeFastEdit: true }}
        {...props}
      />
    </div>
  );
}

const getInput = (cell: HTMLElement) => cell.querySelector('input');

describe('<DataGrid /> - IME fast edit', () => {
  const { render } = createRenderer();

  async function focusCell(user: any, row: number, col: number) {
    const cell = getCell(row, col);
    await user.click(cell);
    return cell;
  }

  describe('editor rendered before edit mode', () => {
    it('focuses a hidden editor in the focused editable cell', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell);
      expect(input).not.to.equal(null);
      expect(document.activeElement).to.equal(input);
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell.textContent).to.contain('Seoul');
    });

    it('renders the editor only in the focused cell', async () => {
      const { user } = render(<TestCase />);
      expect(document.querySelectorAll('[data-cell-editor]')).to.have.length(0);
      const cell = await focusCell(user, 0, 1);
      const wrappers = document.querySelectorAll('[data-cell-editor]');
      expect(wrappers).to.have.length(1);
      expect(cell.contains(wrappers[0])).to.equal(true);
      expect(wrappers[0]).to.have.attribute('data-cell-editor', 'preMounted');
    });

    it('moves the editor with the focus', async () => {
      const { user } = render(<TestCase />);
      await focusCell(user, 0, 1);
      await user.keyboard('{ArrowDown}');
      const below = getCell(1, 1);
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(below));
      });
      expect(document.querySelectorAll('[data-cell-editor]')).to.have.length(1);
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(1, 0)));
      });
      expect(document.querySelectorAll('[data-cell-editor]')).to.have.length(1);
    });

    it('does not render the editor in non-string columns', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 2);
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
    });

    it('does not render the editor in non-editable cells', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 3);
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
    });

    it('does not render the editor when `isCellEditable` returns false', async () => {
      const { user } = render(<TestCase isCellEditable={() => false} />);
      const cell = await focusCell(user, 0, 1);
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
    });

    it('does not render the editor with a custom `renderEditCell`', async () => {
      const { user } = render(
        <TestCase
          columns={[
            {
              field: 'city',
              editable: true,
              renderEditCell: () => <input data-testid="custom-editor" />,
            },
          ]}
        />,
      );
      const cell = await focusCell(user, 0, 0);
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
    });

    it('does not render the editor without the flag', async () => {
      const { user } = render(<TestCase experimentalFeatures={{}} />);
      const cell = await focusCell(user, 0, 1);
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
      expect(document.querySelectorAll('[data-cell-editor]')).to.have.length(0);
    });

    it('does not remount the content of `renderCell` when the cell gets the focus', async () => {
      let mounts = 0;
      function CityCell(props: GridRenderCellParams) {
        React.useEffect(() => {
          mounts += 1;
        }, []);
        return <span>{props.value}</span>;
      }
      const { user } = render(
        <TestCase
          columns={[
            { field: 'city', editable: true, renderCell: (params) => <CityCell {...params} /> },
          ]}
        />,
      );
      const initialMounts = mounts;
      const cell = await focusCell(user, 0, 0);
      expect(getInput(cell)).not.to.equal(null);
      expect(mounts).to.equal(initialMounts);
    });

    it.skipIf(isJSDOM)('takes no space in the cell layout', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const wrapper = cell.querySelector<HTMLElement>('[data-cell-editor]')!;
      expect(wrapper.getBoundingClientRect().width).to.equal(0);
      expect(getComputedStyle(wrapper).opacity).to.equal('0');
    });

    it.skipIf(isJSDOM)('keeps the focus outline of a focused cell', async () => {
      const { user } = render(<TestCase />);
      // The number cell has no editor, so the cell itself has the focus.
      const numberCell = await focusCell(user, 0, 2);
      const focusedOutline = getComputedStyle(numberCell).outlineColor;

      const cell = await focusCell(user, 0, 1);
      expect(document.activeElement).to.equal(getInput(cell));
      expect(getComputedStyle(cell).outlineColor).to.equal(focusedOutline);
    });
  });

  describe('start editing', () => {
    it('keeps the same input element when a composition starts edit mode', async () => {
      const reasons: string[] = [];
      const onCellEditStart = (params: any) => reasons.push(params.reason);
      const { user } = render(<TestCase onCellEditStart={onCellEditStart} />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;

      fireEvent.compositionStart(input);

      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(reasons).to.deep.equal(['compositionStart']);
      expect(getInput(cell)).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(input.value).to.equal('');

      fireEvent.change(input, { target: { value: '한' } });
      fireEvent.compositionEnd(input);
      fireEvent.change(input, { target: { value: '한글' } });
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('한글');

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('한글');
      });
    });

    it('does not start edit mode for a composition in an input of `renderCell`', async () => {
      const { user } = render(
        <TestCase
          columns={[
            {
              field: 'city',
              editable: true,
              renderCell: () => <input data-testid="view-input" />,
            },
          ]}
        />,
      );
      const cell = await focusCell(user, 0, 0);
      const viewInput = cell.querySelector('[data-testid="view-input"]')!;
      fireEvent.compositionStart(viewInput);
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    });

    it('keeps Latin typing working', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      await user.keyboard('x');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('x');
    });

    it('keeps the existing value when Enter starts edit mode', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      await user.keyboard('{Enter}');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('Seoul');
    });

    it('keeps the same input element when a double click starts edit mode', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.doubleClick(cell);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('Seoul');
    });

    it('returns to the hidden editor after Escape', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      await user.keyboard('x');
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      });
      expect(cell.textContent).to.contain('Seoul');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('');
      expect(document.activeElement).to.equal(input);
    });
  });

  describe('row edit mode', () => {
    it('keeps the same input element when a composition starts edit mode', async () => {
      const reasons: string[] = [];
      const onRowEditStart = (params: any) => reasons.push(params.reason);
      const { user } = render(<TestCase editMode="row" onRowEditStart={onRowEditStart} />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;

      fireEvent.compositionStart(input);

      expect(reasons).to.deep.equal(['compositionStart']);
      expect(getCell(0, 0)).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(document.activeElement).to.equal(input);
      expect(input.value).to.equal('');
      // The other cells of the row keep their values.
      expect(getInput(getCell(0, 0))!.value).to.equal('Nike');
    });

    it('commits the composed value with Enter', async () => {
      const { user } = render(<TestCase editMode="row" />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '東京' } });
      fireEvent.compositionEnd(input);
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('東京');
      });
    });
  });

  describe('focus', () => {
    it('keeps the focus on the editor when the focused cell is clicked again', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      await user.click(cell);
      expect(document.activeElement).to.equal(input);
    });

    it('moves the focus from a column header to the editor with ArrowDown', async () => {
      const { user } = render(<TestCase />);
      await user.click(getColumnHeaderCell(1));
      await user.keyboard('{ArrowDown}');
      const cell = getCell(0, 1);
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(cell));
      });
    });

    it('makes the editor the tab stop instead of the cell', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      expect(cell).to.have.attribute('tabindex', '-1');
      expect(getInput(cell)).to.have.attribute('tabindex', '0');
    });

    it('leaves the grid with one Shift+Tab', async () => {
      const { user } = render(
        <React.Fragment>
          <button type="button">before</button>
          <TestCase />
        </React.Fragment>,
      );
      await focusCell(user, 0, 1);
      await user.tab({ shift: true });
      expect(document.activeElement!.closest('[role="grid"]')).to.equal(null);
    });

    it('gives the focus to the editor when Tab moves the focus back to the grid', async () => {
      const { user } = render(
        <React.Fragment>
          <TestCase hideFooter />
          <button type="button">after</button>
        </React.Fragment>,
      );
      const cell = await focusCell(user, 0, 1);
      await user.tab();
      expect(document.activeElement).to.have.text('after');
      await user.tab({ shift: true });
      expect(document.activeElement).to.equal(getInput(cell));
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
            <TestCase columns={manyColumns} rows={manyRows} columnBufferPx={0} />
          </React.Fragment>,
        );
        const cell = await focusCell(user, 0, 0);
        const input = getInput(cell)!;
        const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;

        await act(async () => {
          scroller.scrollLeft = 3000;
          scroller.dispatchEvent(new Event('scroll'));
        });
        await waitFor(() => {
          expect(getCell(0, 30)).not.to.equal(null);
        });
        expect(document.activeElement).to.equal(input);

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
  });

  describe('focus state changes', () => {
    it('keeps the DOM focus when the focused cell becomes non-editable', async () => {
      const { user, setProps } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      setProps({ isCellEditable: () => false });
      expect(document.activeElement).to.equal(input);
      expect(cell.contains(document.activeElement)).to.equal(true);

      // A composition must not start edit mode in a non-editable cell.
      fireEvent.compositionStart(input);
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    });

    it('removes the editor and keeps the DOM focus in the cell when the column type changes', async () => {
      const { user, setProps } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      expect(document.activeElement).to.equal(getInput(cell));

      const numberColumns = columns.map((column) =>
        column.field === 'city' ? { ...column, type: 'number' as const } : column,
      );
      setProps({ columns: numberColumns });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getCell(0, 1));
      });
      expect(getInput(getCell(0, 1))).to.equal(null);
    });

    it('does not keep the editor in a cell that lost the focus while its editor was removed', async () => {
      const { user, setProps } = render(<TestCase />);
      await focusCell(user, 0, 1);
      setProps({
        columns: columns.map((column) =>
          column.field === 'city' ? { ...column, type: 'number' as const } : column,
        ),
      });
      await focusCell(user, 1, 0);
      setProps({ columns });

      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(1, 0)));
      });
      expect(document.querySelectorAll('[data-cell-editor]')).to.have.length(1);
      expect(getInput(getCell(0, 1))).to.equal(null);
      expect(getCell(0, 1)).to.have.attribute('tabindex', '-1');
    });

    it('removes the editor when the DOM focus leaves it', async () => {
      const { user } = render(
        <React.Fragment>
          <input data-testid="outside" />
          <TestCase />
        </React.Fragment>,
      );
      const cell = await focusCell(user, 0, 1);
      await user.click(document.querySelector('[data-testid="outside"]')!);
      expect(getInput(cell)).to.equal(null);
    });
  });

  describe('hidden editor attributes', () => {
    it('labels the hidden editor with the value of the cell', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      expect(getInput(cell)).to.have.attribute('aria-label', 'Seoul');
    });

    it('labels the hidden editor with the formatted value of the cell', async () => {
      const { user } = render(
        <TestCase
          columns={[{ field: 'city', editable: true, valueFormatter: (value) => `City: ${value}` }]}
        />,
      );
      const cell = await focusCell(user, 0, 0);
      expect(getInput(cell)).to.have.attribute('aria-label', 'City: Seoul');
    });

    it('does not label the hidden editor of an empty cell', async () => {
      const { user } = render(<TestCase rows={[{ id: 0, name: '', city: '' }]} />);
      const cell = await focusCell(user, 0, 1);
      expect(getInput(cell)).not.to.have.attribute('aria-label');
    });

    it('turns off autofill, spell check, and password managers on the hidden editor', async () => {
      const { user } = render(<TestCase />);
      const input = getInput(await focusCell(user, 0, 1))!;
      expect(input).to.have.attribute('autocomplete', 'off');
      expect(input).to.have.attribute('spellcheck', 'false');
      expect(input).to.have.attribute('data-lpignore', 'true');
      expect(input).to.have.attribute('data-1p-ignore', '');
      expect(input).to.have.attribute('data-bwignore', '');
      expect(input).to.have.attribute('data-form-type', 'other');
    });

    it('removes the label when a composition starts edit mode', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.compositionStart(input);
      await waitFor(() => {
        expect(cell).to.have.class('MuiDataGrid-cell--editing');
      });
      expect(getInput(cell)).to.equal(input);
      expect(input).not.to.have.attribute('aria-label');
    });
  });

  describe('edit input in `renderCell`', () => {
    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'keeps the typed text in a `GridEditInputCell` rendered by `renderCell` (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const onValueChange: string[] = [];
        const { user } = render(
          <TestCase
            experimentalFeatures={{ imeFastEdit }}
            columns={[
              {
                field: 'note',
                renderCell: (params) => (
                  <GridEditInputCell
                    {...(params as any)}
                    onValueChange={(_event: unknown, value: string) => {
                      onValueChange.push(value);
                    }}
                  />
                ),
              },
            ]}
          />,
        );
        const input = getInput(getCell(0, 0))!;
        await user.click(input);
        await user.keyboard('x');
        expect(input.value).to.equal('Ax');
        expect(onValueChange).to.deep.equal(['Ax']);
      },
    );
  });

  describe('layout', () => {
    it.skipIf(isJSDOM)('keeps the `:has()` selector out of the other focus outline rules', () => {
      render(<TestCase />);
      const selectors: string[] = [];
      Array.from(document.styleSheets).forEach((sheet) => {
        Array.from(sheet.cssRules).forEach((rule) => {
          if (rule instanceof CSSStyleRule && rule.selectorText.includes('data-cell-editor')) {
            selectors.push(rule.selectorText);
          }
        });
      });
      const hasRules = selectors.filter((selector) => selector.includes(':has('));
      expect(hasRules.length).to.be.greaterThan(0);
      hasRules.forEach((selector) => {
        expect(selector).not.to.contain('columnHeader');
        expect(selector).not.to.contain(':focus,');
      });
    });

    it.skipIf(isJSDOM)('does not scroll or move the content of the focused cell', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      expect(cell.scrollTop).to.equal(0);
      expect(cell.scrollLeft).to.equal(0);
      const range = document.createRange();
      range.selectNodeContents(cell.firstChild!);
      const textRect = range.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      expect(textRect.top).to.be.at.least(cellRect.top);
      expect(textRect.bottom).to.be.at.most(cellRect.bottom);
    });

    it.skipIf(isJSDOM)('does not change the height of a row with an automatic height', async () => {
      const { user } = render(<TestCase getRowHeight={() => 'auto'} />);
      const row = getCell(0, 1).parentElement!;
      const height = row.getBoundingClientRect().height;
      await focusCell(user, 0, 1);
      expect(row.getBoundingClientRect().height).to.equal(height);
    });

    it.skipIf(isJSDOM)('keeps the focus outline style and width', async () => {
      const { user } = render(<TestCase />);
      const numberCell = await focusCell(user, 0, 2);
      const expected = getComputedStyle(numberCell);
      const { outlineStyle, outlineWidth, outlineColor } = expected;
      const cell = await focusCell(user, 0, 1);
      const actual = getComputedStyle(cell);
      expect([actual.outlineStyle, actual.outlineWidth, actual.outlineColor]).to.deep.equal([
        outlineStyle,
        outlineWidth,
        outlineColor,
      ]);
    });
  });

  describe('edit start', () => {
    it('starts edit mode once when the IME keydown comes before compositionstart', async () => {
      const reasons: string[] = [];
      const { user } = render(
        <TestCase onCellEditStart={(params) => reasons.push(params.reason!)} />,
      );
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      // Chromium on Windows
      fireEvent.keyDown(input, { key: 'Process', keyCode: 229 });
      fireEvent.compositionStart(input);
      expect(reasons).to.deep.equal(['compositionStart']);
      expect(getInput(cell)).to.equal(input);
    });

    it('starts edit mode once when the IME keydown has a printable key', async () => {
      const reasons: string[] = [];
      const { user } = render(
        <TestCase onCellEditStart={(params) => reasons.push(params.reason!)} />,
      );
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      // Safari and Chromium on macOS can report the key of the IME keydown.
      fireEvent.keyDown(input, { key: 'ㅁ', keyCode: 229 });
      fireEvent.compositionStart(input);
      expect(reasons).to.have.length(1);
      expect(getInput(cell)).to.equal(input);
      expect(document.activeElement).to.equal(input);
    });

    it('keeps the editor empty when `onCellEditStart` prevents edit mode', async () => {
      const { user } = render(
        <TestCase
          onCellEditStart={(_, event) => {
            event.defaultMuiPrevented = true;
          }}
        />,
      );
      const cell = await focusCell(user, 0, 1);
      await user.keyboard('x');
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)!.value).to.equal('');
      expect(cell.textContent).to.contain('Seoul');
    });

    it('types the first character once with a controlled `cellModesModel`', async () => {
      function ControlledTest() {
        const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
        return (
          <TestCase cellModesModel={cellModesModel} onCellModesModelChange={setCellModesModel} />
        );
      }
      const { user } = render(<ControlledTest />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      await user.keyboard('x');
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('x');
    });

    it('keeps the same input with a controlled `cellModesModel` when a composition starts', async () => {
      function ControlledTest() {
        const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
        return (
          <TestCase cellModesModel={cellModesModel} onCellModesModelChange={setCellModesModel} />
        );
      }
      const { user } = render(<ControlledTest />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.compositionStart(input);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('');
    });

    it('types the first character once with a controlled `rowModesModel`', async () => {
      function ControlledTest() {
        const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
        return (
          <TestCase
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
          />
        );
      }
      const { user } = render(<ControlledTest />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      await user.keyboard('x');
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('x');
    });

    it('keeps the same input with a controlled `rowModesModel` when a composition starts', async () => {
      function ControlledTest() {
        const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
        return (
          <TestCase
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
          />
        );
      }
      const { user } = render(<ControlledTest />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.compositionStart(input);
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('');
    });
  });
});
