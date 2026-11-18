import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { useDemoData } from '@mui/x-data-grid-generator';
import ClipboardCopyButton from '../../../data/data-grid/clipboard/ClipboardCopyButton.tsx';
import RestoreStateInitialState from '../../../data/data-grid/state/RestoreStateInitialState.tsx';
import ExportCustomToolbar from '../../../data/data-grid/export/ExportCustomToolbar.tsx';

vi.mock('@mui/x-data-grid-generator', () => ({
  useDemoData: vi.fn(() => ({
    data: {
      rows: [{ id: 1, name: 'One' }],
      columns: [{ field: 'name' }],
      initialState: { density: 'compact' },
    },
    loading: false,
  })),
}));

const { render } = createRenderer();

describe('Toolbar migration', () => {
  it('shows the grid density in the state restoration control', () => {
    render(<RestoreStateInitialState />);
    fireEvent.click(screen.getByRole('button', { name: 'Density' }));
    expect(screen.getByRole('menuitem', { name: 'Compact' })).to.have.class('Mui-selected');
  });

  it('keeps export actions in a menu', () => {
    render(<ExportCustomToolbar />);
    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(screen.getByRole('menuitem', { name: 'Download as CSV' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Print' })).toBeVisible();
  });

  it('copies rows with an exclude selection after filtering', () => {
    vi.mocked(useDemoData).mockReturnValue({
      data: {
        rows: [
          { id: 1, name: 'One', code: 'A' },
          { id: 2, name: 'Two', code: 'B' },
        ],
        columns: [{ field: 'name' }, { field: 'code' }],
        rowSelectionModel: { type: 'exclude', ids: new Set([1]) },
        keepNonExistentRowsSelected: true,
        initialState: {
          filter: { filterModel: { items: [{ field: 'name', operator: 'equals', value: 'One' }] } },
        },
      },
      loading: false,
      setRowLength: vi.fn(),
      loadNewData: vi.fn(),
    } as ReturnType<typeof useDemoData>);
    const writeText = vi.fn();
    render(<ClipboardCopyButton />);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    fireEvent.click(screen.getByRole('gridcell', { name: 'One' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy selection' }));
    expect(writeText).toHaveBeenCalledWith('One,A');
  });
});
