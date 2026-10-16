import * as React from 'react';
import { act, createEvent, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import type {
  DataGridProProps,
  GridApi,
  GridColDef,
  GridListViewColDef,
  GridRowsProp,
} from '@mui/x-data-grid-pro';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getActiveCell, getCell, getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import {
  compareWithBaseline,
  composeAndCommitInCell,
  describeActiveElement,
  expectFocusMatchesCell as expectFocusMatchesCellWithLookup,
  focusCell,
  getEditorWrappers,
  getInput,
  pressKeys as pressKeysWithLookup,
} from 'test/utils/imeFastEdit';
import type { User } from 'test/utils/imeFastEdit';

const columns: GridColDef[] = [
  { field: 'id', type: 'number', width: 100 },
  { field: 'name', editable: true, width: 100 },
  { field: 'city', editable: true, width: 100 },
  { field: 'age', type: 'number', editable: true, width: 100 },
  { field: 'note', width: 100 },
  { field: 'country', editable: true, width: 100 },
];

const rows: GridRowsProp = [
  { id: 0, name: 'Nike', city: 'Seoul', age: 25, note: 'A', country: 'KR' },
  { id: 1, name: 'Adidas', city: 'Tokyo', age: 36, note: 'B', country: 'JP' },
  { id: 2, name: 'Puma', city: 'Osaka', age: 41, note: 'C', country: 'JP' },
];

type TestCaseProps = Partial<DataGridProProps> & {
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
      <DataGridPro
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

describe('<DataGridPro /> - IME fast edit layout', () => {
  const { render } = createRenderer();

  const pressKeys = (user: User, keys: string[], imeFastEdit: boolean) =>
    pressKeysWithLookup(user, keys, imeFastEdit, apiRef);
  const expectFocusMatchesCell = (imeFastEdit: boolean) =>
    expectFocusMatchesCellWithLookup(imeFastEdit, apiRef);

  [false, true].forEach((rtl) => {
    describe(`pinned columns${rtl ? ' in RTL' : ''}`, () => {
      const pinnedProps: TestCaseProps = {
        rtl,
        initialState: { pinnedColumns: { left: ['name'], right: ['country'] } },
      } as TestCaseProps;

      it('focuses the hidden editor in the pinned cells', async () => {
        const { user } = render(<TestCase {...pinnedProps} />);
        // Pinned left columns are rendered first.
        const leftCell = await focusCell(user, 0, 0);
        expect(leftCell).to.have.attribute('data-field', 'name');
        expect(leftCell).to.have.class('MuiDataGrid-cell--pinnedLeft');
        expect(document.activeElement).to.equal(getInput(leftCell));
        expect(getActiveCell()).to.equal('0-0');

        const rightCell = await focusCell(user, 0, 5);
        expect(rightCell).to.have.attribute('data-field', 'country');
        expect(rightCell).to.have.class('MuiDataGrid-cell--pinnedRight');
        expect(document.activeElement).to.equal(getInput(rightCell));
        expect(getActiveCell()).to.equal('0-5');
        expect(getEditorWrappers()).to.have.length(1);
      });

      it('navigates across the pinned columns like the baseline', async () => {
        // In RTL, the arrow keys move in the opposite column direction.
        const next = rtl ? '{ArrowLeft}' : '{ArrowRight}';
        const previous = rtl ? '{ArrowRight}' : '{ArrowLeft}';
        const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
          const { user, unmount } = render(<TestCase {...pinnedProps} imeFastEdit={imeFastEdit} />);
          await focusCell(user, 0, 0);
          const result = await pressKeys(
            user,
            [
              next,
              previous,
              '{End}',
              previous,
              next,
              '{Home}',
              '{ArrowDown}',
              '{Control>}{End}{/Control}',
            ],
            imeFastEdit,
          );
          unmount();
          return result;
        });
        expect(baseline).to.deep.equal([
          'cell:0-1',
          'cell:0-0',
          'cell:0-5',
          'cell:0-4',
          'cell:0-5',
          'cell:0-0',
          'cell:1-0',
          'cell:2-5',
        ]);
        expect(withFlag).to.deep.equal(baseline);
      });

      it('commits a composition in the pinned cells', async () => {
        const { user } = render(<TestCase {...pinnedProps} />);
        const leftCell = await focusCell(user, 0, 0);
        await composeAndCommitInCell(user, leftCell, '나이키');
        const rightCell = await focusCell(user, 1, 5);
        await composeAndCommitInCell(user, rightCell, '日本');
        expect(getCell(0, 0).textContent).to.equal('나이키');
      });

      it('commits a composition in row edit mode', async () => {
        const { user } = render(<TestCase {...pinnedProps} editMode="row" />);
        const cell = await focusCell(user, 0, 5);
        const input = getInput(cell)!;
        fireEvent.compositionStart(input);
        expect(getCell(0, 0)).to.have.class('MuiDataGrid-cell--editing');
        expect(getInput(cell)).to.equal(input);
        expect(document.activeElement).to.equal(input);
        expect(getInput(getCell(0, 0))!.value).to.equal('Nike');
        fireEvent.change(input, { target: { value: '韓国' } });
        fireEvent.compositionEnd(input);
        await user.keyboard('{Enter}');
        await waitFor(() => {
          expect(getCell(0, 5).textContent).to.equal('韓国');
        });
      });

      it.skipIf(isJSDOM)('keeps the layout of the pinned cells', async () => {
        const measure = async (imeFastEdit: boolean) => {
          const { user, unmount } = render(<TestCase {...pinnedProps} imeFastEdit={imeFastEdit} />);
          const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
          const measureCell = async (row: number, col: number) => {
            const cell = await focusCell(user, row, col);
            const range = document.createRange();
            range.selectNodeContents(cell.firstChild!);
            const textRect = range.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();
            return {
              position: getComputedStyle(cell).position,
              cellScrollLeft: cell.scrollLeft,
              cellScrollTop: cell.scrollTop,
              textInsideCell:
                textRect.left >= cellRect.left &&
                textRect.right <= cellRect.right &&
                textRect.top >= cellRect.top &&
                textRect.bottom <= cellRect.bottom,
              textLeft: Math.round(textRect.left - cellRect.left),
              cellLeft: Math.round(cellRect.left - scrollerRect.left),
              cellRight: Math.round(scrollerRect.right - cellRect.right),
              scrollLeft: Math.round(scroller.scrollLeft),
              scrollWidth: scroller.scrollWidth,
              rowHeight: Math.round(getRow(row).getBoundingClientRect().height),
            };
          };
          const left = await measureCell(0, 0);
          const right = await measureCell(0, 5);
          const activeElement = describeActiveElement();
          unmount();
          return { left, right, activeElement };
        };
        const { baseline, withFlag } = await compareWithBaseline(measure);
        expect(withFlag.left.position).to.equal('sticky');
        expect(withFlag.left.cellScrollLeft).to.equal(0);
        expect(withFlag.right.cellScrollLeft).to.equal(0);
        expect(withFlag.left.textInsideCell).to.equal(true);
        expect(withFlag.right.textInsideCell).to.equal(true);
        expect(withFlag).to.deep.equal(baseline);
      });

      it.skipIf(isJSDOM)('keeps the focus outline of the pinned cells', async () => {
        const { user } = render(<TestCase {...pinnedProps} />);
        const numberCell = await focusCell(user, 0, 1);
        const expected = getComputedStyle(numberCell);
        const expectedOutline = [
          expected.outlineStyle,
          expected.outlineWidth,
          expected.outlineColor,
        ];
        expect(expectedOutline[0]).not.to.equal('none');

        const leftCell = await focusCell(user, 0, 0);
        const left = getComputedStyle(leftCell);
        expect([left.outlineStyle, left.outlineWidth, left.outlineColor]).to.deep.equal(
          expectedOutline,
        );

        const rightCell = await focusCell(user, 0, 5);
        const right = getComputedStyle(rightCell);
        expect([right.outlineStyle, right.outlineWidth, right.outlineColor]).to.deep.equal(
          expectedOutline,
        );
        expect(getComputedStyle(leftCell).outlineStyle).to.equal('none');
      });

      it.skipIf(isJSDOM)(
        'keeps the focus in a pinned cell when the scroller is scrolled',
        async () => {
          const { user } = render(<TestCase {...pinnedProps} columnBufferPx={0} />);
          const cell = await focusCell(user, 0, 0);
          const input = getInput(cell)!;
          const scroller = document.querySelector<HTMLElement>('.MuiDataGrid-virtualScroller')!;
          await act(async () => {
            scroller.scrollLeft = rtl ? -100 : 100;
            scroller.dispatchEvent(new Event('scroll'));
          });
          await waitFor(() => {
            expect(Math.abs(scroller.scrollLeft)).to.be.greaterThan(0);
          });
          expect(document.activeElement).to.equal(input);
          expect(getCell(0, 0)).to.equal(cell);
        },
      );
    });
  });

  describe('pinned rows', () => {
    const pinnedRows = {
      top: [{ id: 100, name: 'Top', city: 'Busan', age: 1, note: 'T', country: 'KR' }],
      bottom: [{ id: 101, name: 'Bottom', city: 'Kyoto', age: 2, note: 'B', country: 'JP' }],
    };

    it('focuses the hidden editor in the pinned rows and commits a composition', async () => {
      const { user } = render(<TestCase pinnedRows={pinnedRows} />);
      // The top pinned row is the first row.
      const topCell = await focusCell(user, 0, 2);
      expect(topCell.textContent).to.equal('Busan');
      expect(topCell.closest('.MuiDataGrid-pinnedRows--top')).not.to.equal(null);
      await composeAndCommitInCell(user, topCell, '부산');

      const bottomCell = await focusCell(user, 4, 2);
      expect(bottomCell.textContent).to.equal('Kyoto');
      await composeAndCommitInCell(user, bottomCell, '京都');
    });

    it('navigates between the pinned rows and the body like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase imeFastEdit={imeFastEdit} pinnedRows={pinnedRows} />,
        );
        await focusCell(user, 0, 2);
        const result = await pressKeys(
          user,
          ['{ArrowDown}', '{ArrowUp}', '{Control>}{End}{/Control}', '{ArrowUp}', '{PageUp}'],
          imeFastEdit,
        );
        unmount();
        return result;
      });
      expect(baseline[0]).to.equal('cell:1-2');
      expect(withFlag).to.deep.equal(baseline);
    });

    it.skipIf(isJSDOM)('keeps the layout of the pinned rows', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase imeFastEdit={imeFastEdit} pinnedRows={pinnedRows} />,
        );
        const heightsBefore = [0, 1, 4].map((i) => getRow(i).getBoundingClientRect().height);
        const cell = await focusCell(user, 0, 2);
        const heightsAfter = [0, 1, 4].map((i) => getRow(i).getBoundingClientRect().height);
        const result = {
          heightsBefore,
          heightsAfter,
          cellScrollTop: cell.scrollTop,
          cellScrollLeft: cell.scrollLeft,
          cellTop: Math.round(cell.getBoundingClientRect().top),
        };
        unmount();
        return result;
      });
      expect(withFlag.heightsAfter).to.deep.equal(withFlag.heightsBefore);
      expect(withFlag).to.deep.equal(baseline);
    });
  });

  describe('tree data', () => {
    const treeRows: GridRowsProp = [
      { id: 0, path: 'A', name: 'Nike', city: 'Seoul' },
      { id: 1, path: 'A.B', name: 'Adidas', city: 'Tokyo' },
      { id: 2, path: 'C', name: 'Puma', city: 'Osaka' },
    ];
    const treeColumns: GridColDef[] = [
      { field: 'name', editable: true, width: 100 },
      { field: 'city', editable: true, width: 100 },
    ];
    const treeProps: TestCaseProps = {
      rows: treeRows,
      columns: treeColumns,
      treeData: true,
      getTreeDataPath: (row) => row.path.split('.'),
    };

    it('does not render the editor in the grouping cell and renders it in the other cells', async () => {
      const { user } = render(<TestCase {...treeProps} />);
      const groupingCell = await focusCell(user, 0, 0);
      expect(groupingCell).to.have.attribute('data-field', '__tree_data_group__');
      expect(getInput(groupingCell)).to.equal(null);
      expect(document.activeElement).to.equal(groupingCell);
      expect(getEditorWrappers()).to.have.length(0);

      const nameCell = await focusCell(user, 0, 1);
      expect(document.activeElement).to.equal(getInput(nameCell));
      await composeAndCommitInCell(user, nameCell, '나이키');
    });

    it('expands a group with the keyboard and edits a child like the baseline', async () => {
      let committedText = '';
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase {...treeProps} imeFastEdit={imeFastEdit} />);
        await focusCell(user, 0, 1);
        const result = await pressKeys(user, ['{ArrowLeft}', '[Space]'], imeFastEdit);
        await waitFor(() => {
          expect(getRow(1).textContent).to.contain('Adidas');
        });
        result.push(...(await pressKeys(user, ['{ArrowDown}', '{ArrowRight}'], imeFastEdit)));
        // Only the flag starts edit mode with a composition.
        if (imeFastEdit) {
          await composeAndCommitInCell(user, getCell(1, 1), '아디다스');
          committedText = getCell(1, 1).textContent!;
        }
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal(['cell:0-0', 'cell:0-0', 'cell:1-0', 'cell:1-1']);
      expect(withFlag).to.deep.equal(baseline);
      expect(committedText).to.equal('아디다스');
    });
  });

  describe('detail panel', () => {
    const detailProps: TestCaseProps = {
      getDetailPanelContent: ({ id }) => <input data-testid={`panel-${id}`} />,
      getDetailPanelHeight: () => 50,
      initialState: { detailPanel: { expandedRowIds: new Set([0]) } },
    };

    it('moves the focus between the detail panel and the cells like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase {...detailProps} imeFastEdit={imeFastEdit} />);
        await focusCell(user, 0, 2);
        const result = [describeActiveElement()];
        expectFocusMatchesCell(imeFastEdit);

        const panelInput = document.querySelector<HTMLInputElement>('[data-testid="panel-0"]')!;
        await user.click(panelInput);
        result.push(describeActiveElement());
        await user.keyboard('{ArrowDown}');
        result.push(describeActiveElement());
        await user.keyboard('x');
        result.push(`panel:${panelInput.value}`);
        // No cell is in edit mode.
        result.push(`editing:${document.querySelectorAll('.MuiDataGrid-cell--editing').length}`);

        await focusCell(user, 1, 2);
        result.push(describeActiveElement());
        expectFocusMatchesCell(imeFastEdit);
        result.push(...(await pressKeys(user, ['{ArrowUp}', '{ArrowDown}'], imeFastEdit)));
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal([
        'cell:0-2',
        'input:panel-0',
        'input:panel-0',
        'panel:x',
        'editing:0',
        'cell:1-2',
        'cell:0-2',
        'cell:1-2',
      ]);
      expect(withFlag).to.deep.equal(baseline);
    });

    it('toggles the detail panel with the keyboard like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase
            {...detailProps}
            initialState={{ detailPanel: { expandedRowIds: new Set() } }}
            imeFastEdit={imeFastEdit}
          />,
        );
        await focusCell(user, 0, 2);
        await user.keyboard('{ArrowLeft}');
        await user.keyboard('{ArrowLeft}');
        await user.keyboard('{ArrowLeft}');
        const toggle = describeActiveElement();
        await user.keyboard('[Space]');
        await waitFor(() => {
          expect(document.querySelector('[data-testid="panel-0"]')).not.to.equal(null);
        });
        const result = [toggle, describeActiveElement()];
        result.push(
          ...(await pressKeys(user, ['{ArrowRight}', '{ArrowRight}', '{ArrowRight}'], imeFastEdit)),
        );
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal(['cell:0-0', 'cell:0-0', 'cell:0-1', 'cell:0-2', 'cell:0-3']);
      expect(withFlag).to.deep.equal(baseline);
    });
  });

  describe('header filters', () => {
    it('moves the focus between the header filters and the hidden editor like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase headerFilters imeFastEdit={imeFastEdit} />);
        await focusCell(user, 0, 2);
        const result = await pressKeys(
          user,
          ['{ArrowUp}', '{ArrowDown}', '{ArrowUp}', '{ArrowUp}', '{ArrowDown}', '{ArrowDown}'],
          imeFastEdit,
        );
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal([
        'filter:3',
        'cell:0-2',
        'filter:3',
        'header:3:city',
        'filter:3',
        'cell:0-2',
      ]);
      expect(withFlag).to.deep.equal(baseline);
    });

    it('types in a header filter without starting edit mode', async () => {
      const { user } = render(<TestCase headerFilters />);
      await focusCell(user, 0, 2);
      const filterCell = getColumnHeaderCell(2, 1);
      const filterInput = filterCell.querySelector('input')!;
      await user.click(filterInput);
      expect(document.activeElement).to.equal(filterInput);
      await user.keyboard('Se');
      await waitFor(() => {
        expect(filterInput.value).to.equal('Se');
      });
      expect(document.querySelectorAll('.MuiDataGrid-cell--editing')).to.have.length(0);
      expect(document.activeElement).to.equal(filterInput);
    });

    it('moves the focus from the last header filter to the first cell with Tab like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(
          <TestCase headerFilters tabNavigation="content" imeFastEdit={imeFastEdit} />,
        );
        const filterCell = getColumnHeaderCell(5, 1);
        await act(async () => filterCell.focus());
        const result = await pressKeys(user, ['{Tab}', '{Tab}'], imeFastEdit);
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal(['cell:0-0', 'cell:0-1']);
      expect(withFlag).to.deep.equal(baseline);
    });
  });

  describe('column reorder', () => {
    it('keeps the focus in the moved column like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} />);
        const cell = await focusCell(user, 0, 2);
        const input = getInput(cell);
        await act(async () => apiRef.current!.setColumnIndex('city', 0));
        const result = {
          activeElement: describeActiveElement(),
          field: document.activeElement!.closest('[role="gridcell"]')?.getAttribute('data-field'),
          sameInput: getInput(getCell(0, 0)) === input,
        };
        expectFocusMatchesCell(imeFastEdit);
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal({ activeElement: 'cell:0-0', field: 'city', sameInput: true });
      expect(withFlag).to.deep.equal(baseline);
    });

    it('keeps the focus after a drag and drop reorder like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} />);
        const cell = await focusCell(user, 0, 1);
        const input = getInput(cell);
        // Drags the `name` column over the `age` cell, with the cursor moving to the right.
        const dragCol = getColumnHeaderCell(1).firstChild!;
        const targetCell = getCell(0, 3);
        fireEvent.dragStart(dragCol);
        fireEvent.dragEnter(targetCell);
        const dragOverEvent = createEvent.dragOver(targetCell);
        Object.defineProperty(dragOverEvent, 'clientX', { value: 1 });
        Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
        fireEvent(targetCell, dragOverEvent);
        const dragEndEvent = createEvent.dragEnd(dragCol);
        Object.defineProperty(dragEndEvent, 'dataTransfer', { value: { dropEffect: 'copy' } });
        fireEvent(dragCol, dragEndEvent);
        const result = {
          activeElement: describeActiveElement(),
          field: document.activeElement!.closest('[role="gridcell"]')?.getAttribute('data-field'),
          order: apiRef.current!.getVisibleColumns().map((c) => c.field),
          sameInput: getInput(getCell(0, 3)) === input,
        };
        expectFocusMatchesCell(imeFastEdit);
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal({
        activeElement: 'cell:0-3',
        field: 'name',
        order: ['id', 'city', 'age', 'name', 'note', 'country'],
        sameInput: true,
      });
      expect(withFlag).to.deep.equal(baseline);
    });
  });

  describe('row reordering', () => {
    it('keeps the focus in the moved row like the baseline', async () => {
      const { baseline, withFlag } = await compareWithBaseline(async (imeFastEdit) => {
        const { user, unmount } = render(<TestCase imeFastEdit={imeFastEdit} rowReordering />);
        // The reorder column is rendered first.
        const cell = await focusCell(user, 0, 3);
        const input = getInput(cell);
        await act(async () => apiRef.current!.setRowIndex(0, 2));
        const result = {
          activeElement: describeActiveElement(),
          rowId: apiRef.current!.getRowId(
            apiRef.current!.getRow(
              Number(document.activeElement!.closest('[role="row"]')!.getAttribute('data-id')),
            )!,
          ),
          sameInput: getInput(getCell(2, 3)) === input,
          firstRow: getCell(0, 3).textContent,
        };
        expectFocusMatchesCell(imeFastEdit);
        unmount();
        return result;
      });
      expect(baseline).to.deep.equal({
        activeElement: 'cell:2-3',
        rowId: 0,
        sameInput: true,
        firstRow: 'Tokyo',
      });
      expect(withFlag).to.deep.equal(baseline);
    });

    it('does not render the editor in the reorder cell', async () => {
      const { user } = render(<TestCase rowReordering />);
      const cell = await focusCell(user, 0, 0);
      expect(cell).to.have.attribute('data-field', '__reorder__');
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
    });
  });

  describe('list view', () => {
    const listColumn: GridListViewColDef = {
      field: 'listColumn',
      renderCell: (params) => <div data-testid="list-column">{params.row.name}</div>,
    };

    it('does not render the editor in the list column', async () => {
      const { user } = render(<TestCase listView listViewColumn={listColumn} />);
      const cell = await focusCell(user, 0, 0);
      expect(cell.querySelector('[data-testid="list-column"]')).not.to.equal(null);
      expect(getInput(cell)).to.equal(null);
      expect(document.activeElement).to.equal(cell);
      await user.keyboard('{ArrowDown}');
      expect(getActiveCell()).to.equal('1-0');
    });
  });
});
