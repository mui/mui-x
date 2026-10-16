import * as React from 'react';
import { createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGrid, GridCellEditStartReasons, GridEditInputCell } from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridCellModesModel,
  GridColDef,
  GridRenderCellParams,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { getCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { describe, it, expect, vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { focusCell, getEditorWrappers, getFocusTarget, getInput } from 'test/utils/imeFastEdit';
import type { User } from 'test/utils/imeFastEdit';

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

describe('<DataGrid /> - IME fast edit', () => {
  const { render } = createRenderer();

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
      expect(getEditorWrappers()).to.have.length(0);
      const cell = await focusCell(user, 0, 1);
      const wrappers = getEditorWrappers();
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
      expect(getEditorWrappers()).to.have.length(1);
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => {
        expect(document.activeElement).to.equal(getInput(getCell(1, 0)));
      });
      expect(getEditorWrappers()).to.have.length(1);
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
      expect(getEditorWrappers()).to.have.length(0);
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
      expect(getEditorWrappers()).to.have.length(1);
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

  describe('Enter in a form', () => {
    function FormTestCase(props: Partial<DataGridProps> & { onSubmit: () => void }) {
      const { onSubmit, ...other } = props;
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <TestCase {...other} />
          <button type="submit">submit</button>
        </form>
      );
    }

    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'does not submit the form when `onCellKeyDown` prevents Enter (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const submits: number[] = [];
        const { user } = render(
          <FormTestCase
            experimentalFeatures={{ imeFastEdit }}
            onSubmit={() => submits.push(1)}
            onCellKeyDown={(_, event) => {
              if (event.key === 'Enter') {
                event.defaultMuiPrevented = true;
              }
            }}
          />,
        );
        const cell = await focusCell(user, 0, 1);
        await user.keyboard('{Enter}');
        expect(submits).to.deep.equal([]);
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      },
    );

    it('does not prevent the Enter that confirms an IME composition', async () => {
      const { user } = render(<TestCase />);
      const input = getInput(await focusCell(user, 0, 1))!;
      expect(fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 })).to.equal(true);
      expect(fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })).to.equal(false);
    });
  });

  describe('click timing', () => {
    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'stops edit mode of the edited cell on mouseup, not on mousedown (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const { user } = render(<TestCase experimentalFeatures={{ imeFastEdit }} />);
        const edited = getCell(0, 1);
        await user.dblClick(edited);
        expect(edited).to.have.class('MuiDataGrid-cell--editing');

        const target = getCell(1, 0);
        await user.pointer({ keys: '[MouseLeft>]', target });
        expect(edited).to.have.class('MuiDataGrid-cell--editing');

        await user.pointer({ keys: '[/MouseLeft]', target });
        await waitFor(() => {
          expect(edited).not.to.have.class('MuiDataGrid-cell--editing');
        });
        // With the flag, the focus moves from the cell to its hidden editor.
        const getExpectedFocus = () => (imeFastEdit ? getInput(target) : target);
        await waitFor(() => {
          expect(document.activeElement).to.equal(getExpectedFocus());
        });
      },
    );
  });

  describe('IME keys during a composition', () => {
    // Starts edit mode with a composition and returns the input.
    async function startComposition(user: User, text: string) {
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.keyDown(input, { key: 'Process', keyCode: 229 });
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: text } });
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      return { cell, input };
    }

    it.each([{ editMode: 'cell' as const }, { editMode: 'row' as const }])(
      'does not commit with the Enter that confirms an IME candidate ($editMode edit mode)',
      async ({ editMode }) => {
        const processRowUpdate = vi.fn((newRow: any) => newRow);
        const { user } = render(
          <TestCase editMode={editMode} processRowUpdate={processRowUpdate} />,
        );
        const { cell, input } = await startComposition(user, '東京');

        fireEvent.keyDown(input, { key: 'Enter', keyCode: 229, isComposing: true });
        fireEvent.compositionEnd(input);
        expect(cell).to.have.class('MuiDataGrid-cell--editing');
        expect(processRowUpdate.mock.calls).to.have.length(0);
        expect(input.value).to.equal('東京');

        await user.keyboard('{Enter}');
        await waitFor(() => {
          expect(getCell(0, 1).textContent).to.equal('東京');
        });
        expect(processRowUpdate.mock.calls).to.have.length(1);
      },
    );

    it('does not commit with the IME Enter that Safari sends after `compositionend`', async () => {
      const { user } = render(<TestCase />);
      const { cell, input } = await startComposition(user, '東京');
      fireEvent.compositionEnd(input);
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(input.value).to.equal('東京');
    });

    it.each([{ editMode: 'cell' as const }, { editMode: 'row' as const }])(
      'does not cancel edit mode with the Escape that cancels an IME candidate ($editMode edit mode)',
      async ({ editMode }) => {
        const { user } = render(<TestCase editMode={editMode} />);
        const { cell, input } = await startComposition(user, 'とう');
        fireEvent.keyDown(input, { key: 'Escape', keyCode: 229, isComposing: true });
        expect(cell).to.have.class('MuiDataGrid-cell--editing');
        expect(getInput(cell)).to.equal(input);
      },
    );

    it('keeps edit mode and the text when a Korean composition restarts for each syllable', async () => {
      const reasons: string[] = [];
      const { user } = render(
        <TestCase onCellEditStart={(params) => reasons.push(params.reason!)} />,
      );
      const { cell, input } = await startComposition(user, '한');
      fireEvent.compositionEnd(input);
      fireEvent.keyDown(input, { key: 'Process', keyCode: 229 });
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '한글' } });
      fireEvent.compositionEnd(input);

      expect(reasons).to.deep.equal(['compositionStart']);
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('한글');
      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(getCell(0, 1).textContent).to.equal('한글');
      });
    });
  });

  describe('devices with a coarse pointer', () => {
    it('does not render the editor when the primary pointer is coarse', async () => {
      // jsdom has no `matchMedia`, so replace it instead of a spy.
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = (query: string) => {
        if (query === '(pointer: coarse)' || !originalMatchMedia) {
          return {
            matches: query === '(pointer: coarse)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          };
        }
        return originalMatchMedia.call(window, query);
      };
      try {
        const { user } = render(<TestCase />);
        const cell = await focusCell(user, 0, 1);
        expect(getInput(cell)).to.equal(null);
        expect(document.activeElement).to.equal(cell);
        expect(cell).to.have.attribute('tabindex', '0');
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });
  });

  describe('column changes while the cell has the focus', () => {
    it('removes the editor and keeps the DOM focus in the cell when `renderEditCell` changes', async () => {
      const { user, setProps } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      expect(document.activeElement).to.equal(getInput(cell));
      setProps({
        columns: columns.map((column) =>
          column.field === 'city'
            ? { ...column, renderEditCell: () => <input data-testid="custom" /> }
            : column,
        ),
      });
      await waitFor(() => {
        expect(document.activeElement).to.equal(getCell(0, 1));
      });
      expect(getInput(getCell(0, 1))).to.equal(null);
    });

    it('keeps the DOM focus and does not start edit mode when the column becomes non-editable', async () => {
      const { user, setProps } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      setProps({
        columns: columns.map((column) =>
          column.field === 'city' ? { ...column, editable: false } : column,
        ),
      });
      expect(cell.contains(document.activeElement)).to.equal(true);
      fireEvent.compositionStart(input);
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    });
  });

  describe('clipboard', () => {
    it.each([{ imeFastEdit: true }, { imeFastEdit: false }])(
      'copies the focused cell with Ctrl+C (imeFastEdit: $imeFastEdit)',
      async ({ imeFastEdit }) => {
        const copied: string[] = [];
        const { user } = render(
          <TestCase
            experimentalFeatures={{ imeFastEdit }}
            disableRowSelectionOnClick
            onClipboardCopy={(text) => copied.push(text)}
          />,
        );
        const cell = await focusCell(user, 0, 1);
        const target = getFocusTarget(cell, imeFastEdit);
        // The copy shortcut check reads `keyCode`, which `user.keyboard` does not set for letters.
        fireEvent.keyDown(target, { key: 'c', keyCode: 67, ctrlKey: true });
        expect(copied).to.deep.equal(['Seoul']);
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      },
    );

    it('pastes the text once with Ctrl+V into the hidden editor', async () => {
      const { user } = render(<TestCase />);
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      // The browser sends the keydown, then the paste into the input that has the focus.
      // The paste shortcut check reads `keyCode`, which `user.keyboard` does not set for letters.
      fireEvent.keyDown(input, { key: 'v', keyCode: 86, ctrlKey: true });
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      expect(getInput(cell)).to.equal(input);
      await user.paste('Busan');
      expect(input.value).to.equal('Busan');
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
      expect(reasons).to.deep.equal([]);
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      fireEvent.compositionStart(input);
      expect(reasons).to.deep.equal(['compositionStart']);
      expect(getInput(cell)).to.equal(input);
      expect(input.value).to.equal('');
      expect(document.activeElement).to.equal(input);
    });

    it('starts row edit mode with the composition when the IME keydown has a printable key', async () => {
      const reasons: string[] = [];
      const { user } = render(
        <TestCase editMode="row" onRowEditStart={(params) => reasons.push(params.reason!)} />,
      );
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.keyDown(input, { key: 'ㅁ', keyCode: 229 });
      expect(reasons).to.deep.equal([]);
      fireEvent.compositionStart(input);
      expect(reasons).to.deep.equal(['compositionStart']);
      expect(getInput(cell)).to.equal(input);
    });

    it('starts edit mode with a printable key when the keydown does not come from an IME', async () => {
      const reasons: string[] = [];
      const { user } = render(
        <TestCase onCellEditStart={(params) => reasons.push(params.reason!)} />,
      );
      await focusCell(user, 0, 1);
      await user.keyboard('x');
      expect(reasons).to.deep.equal(['printableKeyDown']);
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

    it('does not start edit mode when `onCellEditStart` prevents the `compositionStart` reason', async () => {
      const { user } = render(
        <TestCase
          onCellEditStart={(params, event) => {
            if (params.reason === GridCellEditStartReasons.compositionStart) {
              event.defaultMuiPrevented = true;
            }
          }}
        />,
      );
      const cell = await focusCell(user, 0, 1);
      const input = getInput(cell)!;
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '한' } });
      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      expect(cell.textContent).to.contain('Seoul');
    });

    it('gives the hidden input as `event.target` to `onCellKeyDown`', async () => {
      const targets: EventTarget[] = [];
      const { user } = render(
        <TestCase onCellKeyDown={(_, event) => targets.push(event.target)} />,
      );
      const input = getInput(await focusCell(user, 0, 1));
      await user.keyboard('{ArrowRight}');
      expect(targets).to.deep.equal([input]);
    });

    describe.each([
      { editMode: 'cell' as const, model: 'cellModesModel' },
      { editMode: 'row' as const, model: 'rowModesModel' },
    ])('with a controlled `$model`', ({ editMode }) => {
      function ControlledTest() {
        const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
        const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
        if (editMode === 'row') {
          return (
            <TestCase
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel}
            />
          );
        }
        return (
          <TestCase cellModesModel={cellModesModel} onCellModesModelChange={setCellModesModel} />
        );
      }

      it('types the first character once', async () => {
        const { user } = render(<ControlledTest />);
        const cell = await focusCell(user, 0, 1);
        const input = getInput(cell)!;
        await user.keyboard('x');
        expect(cell).to.have.class('MuiDataGrid-cell--editing');
        expect(getInput(cell)).to.equal(input);
        expect(input.value).to.equal('x');
      });

      it('keeps the same input when a composition starts', async () => {
        const { user } = render(<ControlledTest />);
        const cell = await focusCell(user, 0, 1);
        const input = getInput(cell)!;
        fireEvent.compositionStart(input);
        expect(cell).to.have.class('MuiDataGrid-cell--editing');
        expect(getInput(cell)).to.equal(input);
        expect(input.value).to.equal('');
      });
    });
  });
});
