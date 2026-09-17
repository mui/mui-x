import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import type { RefObject } from '@mui/x-internals/types';
import { DataGrid, gridClasses, useGridApiRef } from '@mui/x-data-grid';
import type { GridApi } from '@mui/x-data-grid';
import {
  getCell,
  getColumnHeaderCell,
  openLongTextEditPopup,
  openLongTextViewPopup,
} from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe('<DataGrid /> - Accessibility', () => {
  const { render } = createRenderer();

  const baselineProps = {
    columns: [{ field: 'id' }],
    rows: [{ id: 0 }],
  };

  it('should use the `label` prop as the `aria-label` attribute of role="grid"', () => {
    render(<DataGrid {...baselineProps} label="Grid label" />);
    expect(document.querySelector('div[role="grid"]')).to.have.attribute(
      'aria-label',
      'Grid label',
    );
  });

  it('should only use the `label` prop as the `aria-label` attribute of role="grid" if `aria-label` is not provided', () => {
    render(<DataGrid {...baselineProps} label="Grid label" aria-label="Grid aria-label" />);
    expect(document.querySelector('div[role="grid"]')).to.have.attribute(
      'aria-label',
      'Grid aria-label',
    );
  });

  it('should only use the `label` prop as the `aria-label` attribute of role="grid" if `aria-labelledby` is not provided', () => {
    render(
      <DataGrid {...baselineProps} label="Grid label" aria-labelledby="Grid aria-labelledby" />,
    );
    expect(document.querySelector('div[role="grid"]')).to.have.attribute(
      'aria-labelledby',
      'Grid aria-labelledby',
    );
    expect(document.querySelector('div[role="grid"]')).not.to.have.attribute('aria-label');
  });

  it('should apply the rowheader role to cells in a row header column', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <DataGrid
          rows={[
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
          ]}
          columns={[{ field: 'brand', rowHeader: true }, { field: 'id' }]}
        />
      </div>,
    );

    expect(screen.getAllByRole('rowheader')).to.have.length(3);
    expect(getCell(0, 0)).to.have.attribute('role', 'rowheader');
    expect(getCell(0, 1)).to.have.attribute('role', 'gridcell');
  });

  // JSDOM has no layout, so every column stays inside the render context and the test would pass
  // whether or not row header cells are retained.
  it.skipIf(isJSDOM)(
    'should keep row header cells mounted during horizontal virtualization',
    async () => {
      const columns = Array.from({ length: 10 }, (_, index) => ({
        field: `field${index}`,
        width: 100,
        rowHeader: index === 0 || index === 9,
      }));
      const row = columns.reduce<Record<string, string | number>>(
        (model, column) => ({ ...model, [column.field]: column.field }),
        { id: 0 },
      );

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid rows={[row]} columns={columns} columnBufferPx={0} />
        </div>,
      );

      const firstRowHeader = getCell(0, 0);
      const lastRowHeader = getCell(0, 9);

      const virtualScroller = document.querySelector<HTMLElement>(
        `.${gridClasses.virtualScroller}`,
      )!;
      fireEvent.scroll(virtualScroller, { target: { scrollLeft: 700 } });

      await waitFor(() => {
        expect(getCell(0, 7)).to.have.attribute('data-field', 'field7');
      });
      expect(getCell(0, 0)).to.equal(firstRowHeader);
      expect(getCell(0, 9)).to.equal(lastRowHeader);

      // The retained cells keep their place in the reading order...
      const colIndexes = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[role="row"][data-rowindex] :is([role="gridcell"], [role="rowheader"])',
        ),
      ).map((cell) => Number(cell.getAttribute('data-colindex')));
      expect(colIndexes).to.deep.equal([...colIndexes].sort((a, b) => a - b));

      // ...without taking up space, so the rendered cells stay aligned with their column headers.
      expect(getCell(0, 7).getBoundingClientRect().left).to.equal(
        getColumnHeaderCell(7).getBoundingClientRect().left,
      );
    },
  );

  // A cell collapsed outside the render context can hold the grid's tab stop: the row header is
  // retained, and `tabIndex.cell` outlives the focus state (it survives a click outside the grid).
  // Same JSDOM caveat as above.
  it.skipIf(isJSDOM)(
    'should not make a row header cell a tab stop while it is outside the render context',
    async () => {
      const columns = Array.from({ length: 10 }, (_, index) => ({
        field: `field${index}`,
        width: 100,
        rowHeader: index === 0,
      }));
      const row = columns.reduce<Record<string, string | number>>(
        (model, column) => ({ ...model, [column.field]: column.field }),
        { id: 0 },
      );

      let apiRef: RefObject<GridApi | null>;
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid apiRef={apiRef} rows={[row]} columns={columns} columnBufferPx={0} />
          </div>
        );
      }
      render(<Test />);

      act(() => {
        apiRef.current!.setCellFocus(0, 'field0');
      });
      expect(getCell(0, 0)).to.have.attribute('tabindex', '0');

      const virtualScroller = document.querySelector<HTMLElement>(
        `.${gridClasses.virtualScroller}`,
      )!;
      fireEvent.scroll(virtualScroller, { target: { scrollLeft: 700 } });

      await waitFor(() => {
        expect(getCell(0, 7)).to.have.attribute('data-field', 'field7');
      });

      // The cell keeps the focus it already had, but takes up no space, so tabbing into the grid
      // must not land on it.
      const rowHeader = getCell(0, 0);
      expect(rowHeader.getBoundingClientRect().width).to.equal(0);
      expect(rowHeader).to.have.attribute('tabindex', '-1');
      expect(document.activeElement).to.equal(rowHeader);

      // Scrolling the column back into view makes it a tab stop again.
      fireEvent.scroll(virtualScroller, { target: { scrollLeft: 0 } });
      await waitFor(() => {
        expect(getCell(0, 0)).to.have.attribute('tabindex', '0');
      });
    },
  );

  it('should apply the rowgroup role to the column headers', () => {
    render(<DataGrid {...baselineProps} />);

    expect(document.querySelector(`.${gridClasses.columnHeaders}`)).to.have.attribute(
      'role',
      'rowgroup',
    );
  });

  describe('column type: longText', () => {
    const longTextProps = {
      rows: [{ id: 0, bio: 'Long text content' }],
      columns: [{ field: 'bio', type: 'longText' as const, headerName: 'Biography' }],
    };

    it('expand button should have aria-haspopup and aria-expanded', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...longTextProps} />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.click(cell);

      const expandButton = cell.querySelector(
        'button[aria-haspopup="dialog"]',
      ) as HTMLButtonElement;
      expect(expandButton).to.have.attribute('aria-haspopup', 'dialog');
      expect(expandButton).to.have.attribute('aria-expanded', 'false');
      expect(expandButton).not.to.have.attribute('aria-controls');
    });

    it('edit popup should have role="dialog" with aria-label', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            rows={[{ id: 0, bio: 'Long text content' }]}
            columns={[{ field: 'bio', type: 'longText', headerName: 'Biography', editable: true }]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const popup = screen.getByRole('dialog');
      expect(popup).to.have.attribute('aria-label', 'Biography');

      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName).to.equal('TEXTAREA');
    });

    it('expand button should set aria-controls when view popup is open', async () => {
      const { user } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...longTextProps} />
        </div>,
      );

      const cell = getCell(0, 0);
      await openLongTextViewPopup(cell, user, 'spacebar');

      const expandButton = cell.querySelector(
        'button[aria-haspopup="dialog"]',
      ) as HTMLButtonElement;
      expect(expandButton).to.have.attribute('aria-expanded', 'true');
      expect(expandButton).to.have.attribute('aria-controls');
    });
  });
});
