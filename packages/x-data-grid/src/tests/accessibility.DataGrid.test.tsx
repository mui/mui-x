import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { getCell, openLongTextEditPopup, openLongTextViewPopup } from 'test/utils/helperFn';

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

  it('should keep row header cells mounted during horizontal virtualization', async () => {
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

    const virtualScroller = document.querySelector<HTMLElement>(`.${gridClasses.virtualScroller}`)!;
    fireEvent.scroll(virtualScroller, { target: { scrollLeft: 700 } });

    await waitFor(() => {
      expect(getCell(0, 7)).to.have.attribute('data-field', 'field7');
    });
    expect(getCell(0, 0)).to.equal(firstRowHeader);
    expect(getCell(0, 9)).to.equal(lastRowHeader);
  });

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
