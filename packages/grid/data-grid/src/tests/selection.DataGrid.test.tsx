import * as React from 'react';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, screen, createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { getCell, getRow } from 'test/utils/helperFn';
import { useData } from 'storybook/src/hooks/useData';

describe('<DataGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const TestDataGridSelection = (
    props: Omit<DataGridProps, 'rows' | 'columns'> &
      Partial<Pick<DataGridProps, 'rows' | 'columns'>>,
  ) => {
    const data = useData(2, 2);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...data} {...props} />
      </div>
    );
  };

  describe('no checkboxSelection prop - selection/deselection', () => {
    it('should select one row at a time on click WITHOUT ctrl or meta keypress', () => {
      render(<TestDataGridSelection />);
      const firstRow = getRow(0);
      const secondRow = getRow(1);
      fireEvent.click(getCell(0, 0));
      expect(firstRow).to.have.class('Mui-selected');
      fireEvent.click(getCell(1, 0));
      expect(firstRow).not.to.have.class('Mui-selected');
      expect(secondRow).to.have.class('Mui-selected');
    });

    ['metaKey', 'ctrlKey'].forEach((key) => {
      it(`should select one row at a time on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        const firstRow = getRow(0);
        const secondRow = getRow(1);
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(firstRow).to.have.class('Mui-selected');
        fireEvent.click(getCell(1, 0), { [key]: true });
        expect(firstRow).not.to.have.class('Mui-selected');
        expect(secondRow).to.have.class('Mui-selected');
      });

      it(`should deselect the selected row on click WITH ${key} pressed`, () => {
        render(<TestDataGridSelection />);
        const firstRow = getRow(0);
        fireEvent.click(getCell(0, 0));
        expect(firstRow).to.have.class('Mui-selected');
        fireEvent.click(getCell(0, 0), { [key]: true });
        expect(firstRow).not.to.have.class('Mui-selected');
      });
    });

    it('should not deselect the selected row on click WITHOUT meta or ctrl keypress', () => {
      render(<TestDataGridSelection />);
      const firstRow = getRow(0);
      fireEvent.click(getCell(0, 0));
      expect(firstRow).to.have.class('Mui-selected');
      fireEvent.click(getCell(0, 0));
      expect(firstRow).to.have.class('Mui-selected');
    });
  });

  describe('prop: checkboxSelection', () => {
    it('should check and uncheck when double clicking the row', () => {
      render(<TestDataGridSelection checkboxSelection />);
      const row = getRow(0);
      const checkbox = row!.querySelector('input');
      expect(row).not.to.have.class('Mui-selected');
      expect(checkbox).to.have.property('checked', false);

      fireEvent.click(getCell(0, 0));
      expect(row!.classList.contains('Mui-selected')).to.equal(true, 'class mui-selected 1');
      expect(checkbox).to.have.property('checked', true);

      fireEvent.click(getCell(0, 0));
      expect(row!.classList.contains('Mui-selected')).to.equal(false, 'class mui-selected 2');
      expect(checkbox).to.have.property('checked', false);
    });

    it('should select all visible rows regardless of pagination', () => {
      render(<TestDataGridSelection checkboxSelection pageSize={1} rowsPerPageOptions={[1]} />);
      const selectAllCheckbox = document.querySelector('input[type="checkbox"]');
      fireEvent.click(selectAllCheckbox);
      expect(getRow(0)).to.have.class('Mui-selected');
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(getRow(1)).to.have.class('Mui-selected');
    });

    it('with no rows, the checkbox should not be checked', () => {
      render(<TestDataGridSelection rows={[]} checkboxSelection />);
      const selectAll = screen.getByRole('checkbox', {
        name: /select all rows checkbox/i,
      });
      expect(selectAll).to.have.property('checked', false);
    });

    it('should disable the checkbox if isRowSelectable returns false', () => {
      render(
        <TestDataGridSelection isRowSelectable={(params) => params.id === 0} checkboxSelection />,
      );
      expect(getRow(0).querySelector('input')).to.have.property('disabled', false);
      expect(getRow(1).querySelector('input')).to.have.property('disabled', true);
    });
  });

  describe('props: selectionModel', () => {
    it('should select rows when initialised (array-version)', () => {
      render(<TestDataGridSelection selectionModel={[1]} />);
      const row = getRow(1);
      expect(row).to.have.class('Mui-selected');
    });

    it('should select rows when initialised (non-array version)', () => {
      render(<TestDataGridSelection selectionModel={1} />);
      const row = getRow(1);
      expect(row).to.have.class('Mui-selected');
    });

    it('should allow to switch selectionModel from array version to non array version', () => {
      const { setProps } = render(<TestDataGridSelection />);

      setProps({ selectionModel: 1 });
      const row = getRow(1);
      expect(row).to.have.class('Mui-selected');
    });

    it('should deselect other selected rows', () => {
      const { setProps } = render(<TestDataGridSelection />);

      const row1 = getRow(1);
      expect(row1).not.to.have.class('Mui-selected');

      fireEvent.click(getCell(0, 0));
      const row0 = getRow(0);
      expect(row0).to.have.class('Mui-selected');

      setProps({ selectionModel: [1] });
      // TODO fix this assertion. The model is forced from the outside, hence shouldn't change.
      // https://github.com/mui-org/material-ui-x/issues/190
      expect(row0).not.to.have.class('Mui-selected');
      expect(row1).to.have.class('Mui-selected');
    });

    it('should filter out unselectable rows when the selectionModel prop changes', () => {
      const { setProps } = render(
        <TestDataGridSelection selectionModel={[1]} isRowSelectable={(params) => params.id > 0} />,
      );
      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).to.have.class('Mui-selected');

      setProps({ selectionModel: [0] });
      expect(getRow(0)).to.have.class('Mui-selected');
      expect(getRow(1)).not.to.have.class('Mui-selected');
    });
  });

  describe('props: isRowSelectable', () => {
    it('should update the selected rows when the isRowSelectable prop changes', () => {
      const { setProps } = render(<TestDataGridSelection isRowSelectable={() => true} />);
      fireEvent.click(getRow(0));
      expect(getRow(0)).to.have.class('Mui-selected');
      expect(getRow(1)).not.to.have.class('Mui-selected');

      setProps({ isRowSelectable: (params) => params.id > 0 });
      expect(getRow(0)).not.to.have.class('Mui-selected');
      expect(getRow(1)).not.to.have.class('Mui-selected');
    });
  });

  describe('console error', () => {
    it('should throw console error when selectionModel contains more than 1 item in DataGrid without checkbox selection', () => {
      expect(() => {
        render(<TestDataGridSelection selectionModel={[0, 1]} />);
      })
        // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev('selectionModel can only be of 1 item in DataGrid');
    });

    it('should not throw console error when selectionModel contains more than 1 item in DataGrid with checkbox selection', () => {
      expect(() => {
        render(<TestDataGridSelection selectionModel={[0, 1]} checkboxSelection />);
      })
        .not // @ts-expect-error need to migrate helpers to TypeScript
        .toErrorDev();
    });
  });
});
