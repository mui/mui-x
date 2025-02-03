import * as React from 'react';
import { createRenderer, fireEvent, screen, act, waitFor } from '@mui/internal-test-utils';
import { config } from 'react-transition-group';
import { expect } from 'chai';
import { gridClasses, DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import { getColumnHeaderCell, getColumnValues } from 'test/utils/helperFn';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Column headers', () => {
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
    disableColumnResize: false,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        foundationYear: 1964,
      },
      {
        id: 1,
        brand: 'Adidas',
        foundationYear: 1949,
      },
      {
        id: 2,
        brand: 'Puma',
        foundationYear: 1948,
      },
    ],
  };

  // JSDOM version of .focus() doesn't scroll
  testSkipIf(isJSDOM)('should not scroll the column headers when a column is focused', async () => {
    const { user } = render(
      <div style={{ width: 102, height: 500 }}>
        <DataGridPro
          {...baselineProps}
          columns={[{ field: 'brand' }, { field: 'foundationYear' }]}
        />
      </div>,
    );
    const columnHeaders = document.querySelector('.MuiDataGrid-columnHeaders')!;
    expect(columnHeaders.scrollLeft).to.equal(0);
    const columnCell = getColumnHeaderCell(0);

    await act(async () => {
      columnCell.focus();
    });

    await user.keyboard('{End}');
    expect(columnHeaders.scrollLeft).to.equal(0);
  });

  describe('GridColumnHeaderMenu', () => {
    it('should close the menu when the window is scrolled', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 200 }}>
          <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );
      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      await user.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);
      const virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller')!;
      fireEvent.wheel(virtualScroller);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
    });

    it('should not close the menu when updating the rows prop', async () => {
      function Test(props: Partial<DataGridProProps>) {
        return (
          <div style={{ width: 300, height: 500 }}>
            <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} {...props} />
          </div>
        );
      }
      const { setProps, user } = render(<Test />);
      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      await user.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);
      setProps({ rows: [...baselineProps.rows] });
      expect(screen.queryByRole('menu')).not.to.equal(null);
    });

    it('should not modify column order when menu is clicked', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      await user.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);
      await user.click(screen.getByRole('menu'));
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });

    it('should sort column when sort by Asc is clicked', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );
      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      await user.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);
      await user.click(screen.getByRole('menuitem', { name: 'Sort by ASC' }));
      expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    });

    it('should close the menu of a column when resizing this column', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro
            {...baselineProps}
            columns={[
              { field: 'brand', resizable: true },
              { field: 'foundationYear', resizable: true },
            ]}
          />
        </div>,
      );

      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;

      await user.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);

      const separator = columnCell.querySelector('.MuiDataGrid-iconSeparator')!.parentElement!;
      await user.click(separator);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
    });

    it('should close the menu of a column when resizing another column', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro
            {...baselineProps}
            columns={[
              { field: 'brand', resizable: true },
              { field: 'foundationYear', resizable: true },
            ]}
          />
        </div>,
      );

      const columnWithMenuCell = getColumnHeaderCell(0);
      const columnToResizeCell = getColumnHeaderCell(1);

      const menuIconButton = columnWithMenuCell.querySelector('button[aria-label="Menu"]')!;

      fireEvent.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);

      const separator = columnToResizeCell.querySelector(
        `.${gridClasses['columnSeparator--resizable']}`,
      )!;
      fireEvent.mouseDown(separator);
      expect(screen.queryByRole('menu')).to.equal(null);
      // cleanup
      fireEvent.mouseUp(separator);
    });

    it('should close the menu of a column when pressing the Escape key', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );

      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;

      fireEvent.click(menuIconButton);
      expect(screen.queryByRole('menu')).not.to.equal(null);
      /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      expect(screen.queryByRole('menu')).to.equal(null);
    });

    it('should remove the MuiDataGrid-menuOpen CSS class only after the transition has ended', () => {
      const restoreDisabledConfig = config.disabled;
      // enable `react-transition-group` transitions for this test
      config.disabled = false;

      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
        </div>,
      );
      const columnCell = getColumnHeaderCell(0);
      const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
      fireEvent.click(menuIconButton);
      expect(menuIconButton?.parentElement).to.have.class(gridClasses.menuOpen);
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      expect(menuIconButton?.parentElement).to.have.class(gridClasses.menuOpen);
      expect(menuIconButton?.parentElement).not.to.have.class(gridClasses.menuOpen);

      // restore previous config
      config.disabled = restoreDisabledConfig;
    });

    it('should restore focus to the column header when dismissing the menu by selecting any item', async () => {
      function Test(props: Partial<DataGridProProps>) {
        return (
          <div style={{ width: 300, height: 500 }}>
            <DataGridPro
              {...baselineProps}
              columns={[
                { field: 'brand', resizable: true },
                { field: 'foundationYear', resizable: true },
              ]}
            />
          </div>
        );
      }

      const { user } = render(<Test />);
      const columnWithMenuCell = getColumnHeaderCell(0);
      const columnToResizeCell = getColumnHeaderCell(1);

      const menuIconButton = columnWithMenuCell.querySelector('button[aria-label="Menu"]')!;

      await user.click(menuIconButton);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.to.equal(null);
      });

      const separator = columnToResizeCell.querySelector(
        `.${gridClasses['columnSeparator--resizable']}`,
      )!;
      await user.pointer([{ keys: '[MouseLeft>]', target: separator }]);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).to.equal(null);
      });
      // cleanup
      await user.pointer([{ keys: '[/MouseLeft]', target: separator }]);
    });

    // Flaky on JSDOM
    testSkipIf(isJSDOM)(
      'should close the menu of a column when pressing the Escape key',
      async () => {
        const { user } = render(
          <div style={{ width: 300, height: 500 }}>
            <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
          </div>,
        );

        await user.click(await screen.findByLabelText('Menu'));

        await screen.findByRole(
          'menu',
          {},
          {
            timeout: 1000,
          },
        );

        await user.keyboard('[Escape]');
        await waitFor(() => {
          expect(screen.queryByRole('menu')).to.equal(null);
        });
      },
    );

    // This works on browser mode because the transition is async
    testSkipIf(isJSDOM)(
      'should remove the MuiDataGrid-menuOpen CSS class only after the transition has ended',
      async () => {
        const { user } = render(
          <div style={{ width: 300, height: 500 }}>
            <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} />
          </div>,
        );
        const columnCell = getColumnHeaderCell(0);
        const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
        await user.click(menuIconButton);
        expect(menuIconButton?.parentElement).to.have.class(gridClasses.menuOpen);
        await user.keyboard('[Escape]');
        expect(menuIconButton?.parentElement).to.have.class(gridClasses.menuOpen);
        await waitFor(() => {
          expect(menuIconButton?.parentElement).not.to.have.class(gridClasses.menuOpen);
        });
      },
    );

    // Flaky on JSDOM
    testSkipIf(isJSDOM)(
      'should restore focus to the column header when dismissing the menu by selecting any item',
      async () => {
        function Test(props: Partial<DataGridProProps>) {
          return (
            <div style={{ width: 300, height: 500 }}>
              <DataGridPro
                {...baselineProps}
                columns={[{ field: 'brand' }]}
                initialState={{ sorting: { sortModel: [{ field: 'brand', sort: 'asc' }] } }}
                {...props}
              />
            </div>
          );
        }
        const { user } = render(<Test />);
        const columnCell = getColumnHeaderCell(0);
        const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
        await user.click(menuIconButton);

        const menu = await screen.findByRole('menu');
        const descMenuitem = screen.getByRole('menuitem', { name: /sort by desc/i });
        expect(menu).toHaveFocus();

        await user.keyboard('[ArrowDown]');
        expect(descMenuitem).toHaveFocus();
        await user.keyboard('[Enter]');
        expect(columnCell).toHaveFocus();
      },
    );

    // Flaky on JSDOM
    testSkipIf(isJSDOM)(
      'should restore focus to the column header when dismissing the menu without selecting any item',
      async () => {
        function Test(props: Partial<DataGridProProps>) {
          return (
            <div style={{ width: 300, height: 500 }}>
              <DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} {...props} />
            </div>
          );
        }
        const { user } = render(<Test />);
        const columnCell = getColumnHeaderCell(0);
        const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
        await user.click(menuIconButton);

        const menu = await screen.findByRole('menu');
        expect(menu).toHaveFocus();
        await user.keyboard('[Escape]');

        expect(menu).not.toHaveFocus();
        expect(columnCell).toHaveFocus();
      },
    );
  });
});
