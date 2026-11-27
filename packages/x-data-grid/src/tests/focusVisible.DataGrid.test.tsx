import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import type { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { getCell, getColumnHeaderCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';
import { afterEach, describe, expect, it } from 'vitest';
import type { userEvent as BrowserUserEvent } from 'vitest/browser';

const columns: GridColDef[] = [
  { field: 'name', editable: true },
  { field: 'age', type: 'number' },
];
const rows = [
  { id: 1, name: 'Ada', age: 36 },
  { id: 2, name: 'Grace', age: 45 },
];

const ringTheme = createTheme({ focusVisible: { outlineColor: 'rgb(1, 2, 3)' } });

const ringOf = (element: Element) => {
  const layer = getComputedStyle(element, '::before');
  return {
    style: layer.content === 'none' ? 'none' : layer.outlineStyle,
    color: layer.outlineColor,
    offset: layer.outlineOffset,
  };
};

describe.skipIf(isJSDOM)('<DataGrid /> - theme.focusVisible', () => {
  const { render } = createRenderer();

  function Grid(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 400, height: 300 }}>
        <DataGrid rows={rows} columns={columns} checkboxSelection hideFooter {...props} />
      </div>
    );
  }

  it('draws the theme ring inside the column header and the cell reached with the keyboard', async () => {
    const { user } = render(
      <ThemeProvider theme={ringTheme}>
        <Grid />
      </ThemeProvider>,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('{ArrowRight}');
    const header = getColumnHeaderCell(1);
    expect(ringOf(header)).to.deep.equal({ style: 'solid', color: 'rgb(1, 2, 3)', offset: '-2px' });
    expect(header).to.have.style('outline-style', 'none');

    await user.keyboard('{ArrowDown}');
    const cell = getCell(0, 1);
    expect(ringOf(cell)).to.deep.equal({ style: 'solid', color: 'rgb(1, 2, 3)', offset: '-2px' });
    expect(cell).to.have.style('outline-style', 'none');
  });

  it('lets a focused checkbox draw the only ring in its cell', async () => {
    const { user } = render(
      <ThemeProvider theme={ringTheme}>
        <Grid />
      </ThemeProvider>,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('{ArrowDown}');
    const cell = getCell(0, 0);
    expect(cell.querySelector('.Mui-focusVisible')).not.to.equal(null);
    expect(ringOf(cell).style).to.equal('none');
    expect(cell).to.have.style('outline-style', 'none');
  });

  it('draws the theme ring on the editing cell instead of the clipped input ring', async () => {
    const { user } = render(
      <ThemeProvider theme={ringTheme}>
        <Grid />
      </ThemeProvider>,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    const cell = getCell(0, 1);
    expect(ringOf(cell)).to.deep.equal({ style: 'solid', color: 'rgb(1, 2, 3)', offset: '-2px' });
    expect(cell.querySelector('.MuiInputBase-root')).to.have.style('outline-style', 'none');
  });

  it('keeps the default cell outline without the option', async () => {
    const { user } = render(<Grid />);

    await user.keyboard('{Tab}');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowDown}');

    const cell = getCell(0, 1);
    expect(ringOf(cell).style).to.equal('none');
    expect(cell).to.have.style('outline-style', 'solid');
    expect(cell).to.have.style('outline-width', '1px');
  });

  describe('after a real mouse click', () => {
    const sendRealInput = async (send: (input: typeof BrowserUserEvent) => Promise<void>) => {
      const { userEvent } = await import('vitest/browser');
      await act(() => send(userEvent));
    };

    afterEach(() => sendRealInput((input) => input.keyboard('{Tab}')));

    it('keeps the default cell outline as the cursor', async () => {
      render(
        <ThemeProvider theme={ringTheme}>
          <Grid />
        </ThemeProvider>,
      );

      const cell = getCell(0, 1);
      await sendRealInput((input) => input.click(cell));

      expect(ringOf(cell).style).to.equal('none');
      expect(cell).to.have.style('outline-style', 'solid');
      expect(cell).to.have.style('outline-width', '1px');
    });
  });
});
