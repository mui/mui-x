import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridCellModesModel,
  GridColDef,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe('<DataGrid /> - Cell editable state', () => {
  const { render } = createRenderer();

  function expectCellEditable(rowIndex: number, colIndex: number) {
    expect(getCell(rowIndex, colIndex)).to.have.class(gridClasses['cell--editable']);
  }

  function expectCellNotEditable(rowIndex: number, colIndex: number) {
    expect(getCell(rowIndex, colIndex)).not.to.have.class(gridClasses['cell--editable']);
  }

  // based on https://github.com/mui/mui-x/issues/19732
  it('should update cell editable state when `isCellEditable` prop changes', async () => {
    const rows: GridRowsProp = [
      { id: 1, name: 'A', age: 20 },
      { id: 2, name: 'B', age: 21 },
    ];

    const columns: GridColDef[] = [
      { field: 'name', editable: true, width: 150 },
      { field: 'age', type: 'number', editable: true, width: 150 },
    ];

    function GridWithState() {
      const [editable, setEditable] = React.useState(true);
      const [editMode, setEditMode] = React.useState<'row' | 'cell'>('cell');

      return (
        <div style={{ width: 400, height: 400 }}>
          <button onClick={() => setEditable((s) => !s)}>toggle-editable</button>
          <button onClick={() => setEditMode((s) => (s === 'row' ? 'cell' : 'row'))}>
            toggle-mode
          </button>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode={editMode}
            isCellEditable={(params) => params.row.age % 2 === 0 && editable && editMode === 'cell'}
          />
        </div>
      );
    }

    const { user } = render(<GridWithState />);

    // Initially: editMode = 'cell', editable = true → row 0 cells editable
    expectCellEditable(0, 0);
    expectCellEditable(0, 1);
    expectCellNotEditable(1, 0);

    // Toggle editable → should remove editable class immediately
    await user.click(screen.getByRole('button', { name: 'toggle-editable' }));
    expectCellNotEditable(0, 0);
    expectCellNotEditable(0, 1);

    // Toggle mode to 'cell' again (it was set to false only) by switching mode away and back
    await user.click(screen.getByRole('button', { name: 'toggle-mode' }));
    // Now editMode = 'row' → should not be editable regardless of row parity
    expectCellNotEditable(0, 0);

    await user.click(screen.getByRole('button', { name: 'toggle-mode' }));
    // Back to 'cell' but editable state is false → still not editable
    expectCellNotEditable(0, 0);
  });

  // based on https://github.com/mui/mui-x/issues/20143
  it('should update cell editable state when `colDef.editable` changes', async () => {
    const rows: GridRowsProp = [{ id: 1, firstName: 'Jon', lastName: 'Snow', age: 14 }];

    function Component() {
      const [isEditable, setIsEditable] = React.useState(true);
      const cols: GridColDef[] = [
        { field: 'id', width: 100 },
        { field: 'firstName', width: 150, editable: isEditable },
        { field: 'lastName', width: 150, editable: true },
      ];

      return (
        <div style={{ width: 500, height: 400 }}>
          <button onClick={() => setIsEditable((p) => !p)}>toggle-coldef</button>
          <DataGrid rows={rows} columns={cols} isCellEditable={() => true} />
        </div>
      );
    }

    const { user } = render(<Component />);

    // firstName column is editable initially
    expectCellEditable(0, 1);

    // Toggle colDef.editable to false → class should be removed immediately
    await user.click(screen.getByRole('button', { name: 'toggle-coldef' }));
    expectCellNotEditable(0, 1);
  });
});

declare global {
  // eslint-disable-next-line vars-on-top
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

// `user.keyboard` renders all pending updates between `keydown` and the text insertion.
// A real browser does not, so these tests send real keys without `act()`.
async function pressKeyWithBrowserTiming(key: string) {
  const { userEvent } = await import('vitest/browser');
  const previousActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  try {
    await userEvent.keyboard(key);
  } finally {
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  }
}

describe.skipIf(isJSDOM)('<DataGrid /> - Start editing with a key', () => {
  const { render } = createRenderer();

  const rows: GridRowsProp = [{ id: 1, name: 'Nike' }];
  const columns: GridColDef[] = [{ field: 'name', editable: true }];

  type GridProps = Pick<DataGridProps, 'editMode'> & Partial<Pick<DataGridProps, 'columns'>>;

  function ControlledGrid(props: GridProps) {
    const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          cellModesModel={cellModesModel}
          onCellModesModelChange={setCellModesModel}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          {...props}
        />
      </div>
    );
  }

  function UncontrolledGrid(props: GridProps) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={rows} columns={columns} {...props} />
      </div>
    );
  }

  (['cell', 'row'] as const).forEach((editMode) => {
    [
      { name: 'controlled', Grid: ControlledGrid },
      { name: 'uncontrolled', Grid: UncontrolledGrid },
    ].forEach(({ name, Grid }) => {
      it(`types the first character once with the ${name} ${editMode} modes model`, async () => {
        const { user } = render(<Grid editMode={editMode} />);
        const cell = getCell(0, 0);
        await user.click(cell);

        await pressKeyWithBrowserTiming('x');

        expect(cell).to.have.class(gridClasses['cell--editing']);
        expect(cell.querySelector('input')!.value).to.equal('x');
      });

      it(`does not insert the Enter key with the ${name} ${editMode} modes model`, async () => {
        const { user } = render(
          <Grid
            editMode={editMode}
            columns={[{ field: 'name', type: 'longText', editable: true }]}
          />,
        );
        const cell = getCell(0, 0);
        await user.click(cell);

        await pressKeyWithBrowserTiming('{Enter}');

        expect(cell).to.have.class(gridClasses['cell--editing']);
        expect(document.activeElement!.tagName).to.equal('TEXTAREA');
        expect((document.activeElement as HTMLTextAreaElement).value).to.equal('Nike');
      });
    });
  });
});
