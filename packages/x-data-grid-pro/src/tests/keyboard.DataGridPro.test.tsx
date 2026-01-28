import { createRenderer, act } from '@mui/internal-test-utils';
import { DataGridPro, GridColDef, GridColumnGroupingModel } from '@mui/x-data-grid-pro';
import {
  getActiveCell,
  getActiveColumnHeader,
  getCell,
  getColumnHeaderCell,
} from 'test/utils/helperFn';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'Basic info',
    children: [
      {
        groupId: 'Full name',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

describe('<DataGridPro /> - Tab navigation', () => {
  const { render } = createRenderer();

  describe('default - tabNavigation="none"', () => {
    it('should not handle Tab key in cells', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.click(cell);

      const initialActiveCell = getActiveCell();
      expect(initialActiveCell).to.equal('0-0');

      // Tab should not be handled by the grid - should allow default browser behavior
      await user.keyboard('{Tab}');
      // Active element is body
      expect(document.activeElement).to.equal(document.body);
    });

    it('should not handle Tab key in headers', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} columnGroupingModel={columnGroupingModel} />
        </div>,
      );

      const columnHeader = getColumnHeaderCell(0);
      await act(async () => columnHeader.focus());
      let activeHeader = getActiveColumnHeader();
      expect(activeHeader).to.equal('0');

      await user.keyboard('{Tab}');
      activeHeader = getActiveColumnHeader();
      expect(activeHeader).to.equal(null);

      // Focus the first header group
      // Start from first column header
      await act(async () => columnHeader.focus());
      // Move up to group header
      await user.keyboard('{ArrowUp}');
      // Column group header should be focused
      expect(document.activeElement?.textContent).to.equal('Internal');

      await user.keyboard('{Tab}');
      // Active element is body
      expect(document.activeElement).to.equal(document.body);
    });

    it('should not handle Tab key in header filters', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} headerFilters />
        </div>,
      );

      const headerFilterCell = getColumnHeaderCell(0, 1);
      await act(async () => headerFilterCell.focus());

      await user.keyboard('{Tab}');
      expect(document.activeElement).to.equal(document.body);
    });
  });

  describe('tabNavigation="content"', () => {
    it('should move to next cell in same row when pressing Tab', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-0');

      await user.keyboard('{Tab}');
      expect(getActiveCell()).to.equal('0-1');
    });

    it('should move to first cell of next row when pressing Tab on last cell of row', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const cell = getCell(0, 3); // Last column
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-3');

      await user.keyboard('{Tab}');
      expect(getActiveCell()).to.equal('1-0');
    });

    it('should move to previous cell in same row when pressing Shift+Tab', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const cell = getCell(0, 2);
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-2');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveCell()).to.equal('0-1');
    });

    it('should move to last cell of previous row when pressing Shift+Tab on first cell of row', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const cell = getCell(1, 0); // First column of second row
      await user.click(cell);
      expect(getActiveCell()).to.equal('1-0');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveCell()).to.equal('0-3');
    });

    it('should focus outside of the grid when navigating with tab key at the first or the last cell', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.click(cell);

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(document.activeElement).to.equal(document.body);

      // Focus the last cell
      const lastCell = getCell(3, 3);
      await user.click(lastCell);
      expect(getActiveCell()).to.equal('3-3');

      await user.keyboard('{Tab}');
      expect(document.activeElement).to.equal(document.body);
    });

    it('should move to the first cell when pressing Tab in column header', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const columnHeader = getColumnHeaderCell(0);
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('0');

      await user.keyboard('{Tab}');
      // With tabNavigation="content", Tab should move to the first cell
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should move to the first cell when pressing Tab in header filter', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" headerFilters />
        </div>,
      );

      const headerFilterCell = getColumnHeaderCell(0, 1);
      await act(async () => headerFilterCell.focus());
      expect(document.activeElement).to.equal(headerFilterCell);

      await user.keyboard('{Tab}');
      // With tabNavigation="content", Tab should move to the first cell
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should move to the first cell when pressing Tab in column group header', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            tabNavigation="content"
            columnGroupingModel={columnGroupingModel}
          />
        </div>,
      );

      const columnGroupHeader = getColumnHeaderCell(0);
      await act(async () => columnGroupHeader.focus());
      expect(document.activeElement).to.equal(columnGroupHeader);

      await user.keyboard('{Tab}');
      // With tabNavigation="content", Tab should move to the first cell
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should move outside of the grid when pressing Shift+Tab in column header', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="content" />
        </div>,
      );

      const columnHeader = getColumnHeaderCell(0);
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('0');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(document.activeElement).to.equal(document.body);
    });
  });

  describe('tabNavigation="header"', () => {
    it('should move to next column header when pressing Tab', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" />
        </div>,
      );

      const columnHeader = getColumnHeaderCell(0);
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('0');

      await user.keyboard('{Tab}');
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should move to previous column header when pressing Shift+Tab', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" />
        </div>,
      );

      const columnHeader = getColumnHeaderCell(2);
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('2');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should move to header filter when pressing Tab on last column header', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" headerFilters />
        </div>,
      );

      const columnHeader = getColumnHeaderCell(3); // Last column
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('3');

      await user.keyboard('{Tab}');
      // Should focus on the first header filter cell (not the input, as input has tabindex="-1")
      const headerFilterCell = getColumnHeaderCell(0, 1);
      expect(document.activeElement).to.equal(headerFilterCell);
    });

    it('should move to column header when pressing Shift+Tab on first header filter', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" headerFilters />
        </div>,
      );

      // Start from the header filter cell, not the input
      const headerFilterCell = getColumnHeaderCell(0, 1);
      await act(async () => headerFilterCell.focus());

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveColumnHeader()).to.equal('3');
    });

    it('should navigate through header filters with Tab', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" headerFilters />
        </div>,
      );

      // Start from the header filter cell, not the input
      const headerFilterCell = getColumnHeaderCell(0, 1);
      await act(async () => headerFilterCell.focus());

      await user.keyboard('{Tab}');
      const nextHeaderFilterCell = getColumnHeaderCell(1, 1);
      expect(document.activeElement).to.equal(nextHeaderFilterCell);
    });

    it('should navigate between column groups and column headers', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            columnGroupingModel={columnGroupingModel}
            tabNavigation="header"
          />
        </div>,
      );

      // Start from first column header
      const columnHeader = getColumnHeaderCell(0);
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('0');

      // Move up to group header
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      // Should be on group header now
      expect(document.activeElement?.textContent).to.equal('Internal');

      // We moved back twice, so Tab should move to last group header
      await user.keyboard('{Tab}');
      expect(document.activeElement?.textContent).to.equal('Basic info');

      // Tabbing again should move to first column header
      await user.keyboard('{Tab}');
      expect(getActiveColumnHeader()).to.equal('0');
    });

    it('should not handle Tab key in cells', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-0');

      await user.keyboard('{Tab}');
      expect(document.activeElement).to.equal(document.body);
    });

    it('should move to last header filter when pressing Shift+Tab in cell', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="header" headerFilters />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-0');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      // Should focus on the last header filter cell (not the input, as input has tabindex="-1")
      const lastHeaderFilterCell = getColumnHeaderCell(3, 1);
      expect(document.activeElement).to.equal(lastHeaderFilterCell);
    });
  });

  describe('tabNavigation="all"', () => {
    it('should navigate through all elements', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            tabNavigation="all"
            headerFilters
            columnGroupingModel={columnGroupingModel}
          />
        </div>,
      );

      const cell = getCell(0, 1);
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-1');

      await user.keyboard('{Tab}');
      expect(getActiveCell()).to.equal('0-2');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveCell()).to.equal('0-1');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveCell()).to.equal('0-0');

      // Moving up to the header filter
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(document.activeElement).to.equal(getColumnHeaderCell(3, 3));

      // Move to the first header filter
      const headerFilterCell = getColumnHeaderCell(0, 3);
      await act(async () => headerFilterCell.focus());

      // Shift+Tab to the last column header
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveColumnHeader()).to.equal('3');

      // Move to the first column header
      let columnHeader = getColumnHeaderCell(0, 2);
      await act(async () => columnHeader.focus());

      // Shift+Tab to the last group header
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(document.activeElement?.textContent).to.equal('Full name');

      // Move forward
      await user.keyboard('{Tab}');
      await user.keyboard('{Tab}');
      expect(document.activeElement?.textContent).to.equal('ID');

      columnHeader = getColumnHeaderCell(3, 2);
      await act(async () => columnHeader.focus());

      // Tab to the first header filter
      await user.keyboard('{Tab}');
      expect(document.activeElement?.querySelector('input')).not.to.equal(null);

      columnHeader = getColumnHeaderCell(3, 3);
      await act(async () => columnHeader.focus());

      // Tab to the content
      await user.keyboard('{Tab}');
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should navigate between cells and column headers if there are no header filters', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro rows={rows} columns={columns} tabNavigation="all" />
        </div>,
      );

      const cell = getCell(0, 1);
      await user.click(cell);
      expect(getActiveCell()).to.equal('0-1');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveCell()).to.equal('0-0');

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(getActiveCell()).to.equal(null);
      expect(document.activeElement?.textContent).to.equal('Age');

      await user.keyboard('{Tab}');
      expect(getActiveCell()).to.equal('0-0');
    });

    it('should navigate through column groups with Tab', async () => {
      const { user } = render(
        <div style={{ width: 600, height: 400 }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            columnGroupingModel={columnGroupingModel}
            tabNavigation="all"
          />
        </div>,
      );

      // Start from first column header
      const columnHeader = getColumnHeaderCell(0);
      await act(async () => columnHeader.focus());
      expect(getActiveColumnHeader()).to.equal('0');

      // Move up to group header
      await user.keyboard('{ArrowUp}');
      // Should be on group header now
      expect(document.activeElement?.textContent).to.equal('Internal');

      // Tab to next group header
      await user.keyboard('{Tab}');
      expect(document.activeElement?.textContent).to.equal('Basic info');
    });
  });
});
