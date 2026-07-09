import * as React from 'react';
import { createRenderer, screen, act, waitFor } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import type { RefObject } from '@mui/x-internals/types';
import { useGridApiRef, DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import type { GridApi, DataGridProProps } from '@mui/x-data-grid-pro';
import { getColumnValues } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGridPro /> - Column type: multiSelect', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function TestCaseMultiSelect(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          apiRef={apiRef}
          rows={[
            { id: 1, tags: ['React', 'TypeScript'] },
            { id: 2, tags: ['Vue', 'JavaScript'] },
            { id: 3, tags: ['React', 'JavaScript'] },
            { id: 4, tags: [] },
            { id: 5, tags: null },
          ]}
          columns={[
            {
              field: 'tags',
              type: 'multiSelect',
              width: 200,
              valueOptions: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'],
            },
          ]}
          autoHeight={isJSDOM}
          {...props}
        />
      </div>
    );
  }

  it('should render multiSelect column without errors', () => {
    render(<TestCaseMultiSelect />);
    // Chips render without separator in text content
    expect(getColumnValues(0)).to.deep.equal([
      'ReactTypeScript',
      'VueJavaScript',
      'ReactJavaScript',
      '',
      '',
    ]);
  });

  it('should format values with object valueOptions', () => {
    render(
      <TestCaseMultiSelect
        rows={[
          { id: 1, tags: ['fe', 'be'] },
          { id: 2, tags: ['be'] },
        ]}
        columns={[
          {
            field: 'tags',
            type: 'multiSelect',
            width: 250,
            valueOptions: [
              { value: 'fe', label: 'Frontend' },
              { value: 'be', label: 'Backend' },
            ],
          },
        ]}
      />,
    );
    // Chips render without separator in text content
    expect(getColumnValues(0)).to.deep.equal(['FrontendBackend', 'Backend']);
  });

  it('should support function valueOptions', () => {
    const valueOptions = spy(() => ['A', 'B', 'C']);
    render(
      <TestCaseMultiSelect
        rows={[{ id: 1, tags: ['A', 'B'] }]}
        columns={[
          {
            field: 'tags',
            type: 'multiSelect',
            valueOptions,
          },
        ]}
      />,
    );
    // Chips render without separator in text content
    expect(getColumnValues(0)).to.deep.equal(['AB']);
  });

  it('should format values with custom separator in CSV export', () => {
    render(
      <TestCaseMultiSelect
        rows={[{ id: 1, tags: ['React', 'TypeScript'] }]}
        columns={[
          {
            field: 'tags',
            type: 'multiSelect',
            valueOptions: ['React', 'TypeScript'],
            separator: ' | ',
          },
        ]}
      />,
    );
    const csv = apiRef.current!.getDataAsCsv({ includeHeaders: false });
    expect(csv).to.equal('React | TypeScript');
  });

  it('should render all chips without overflow when row has auto height', () => {
    render(
      <TestCaseMultiSelect
        rows={[{ id: 1, tags: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'] }]}
        columns={[
          {
            field: 'tags',
            type: 'multiSelect',
            width: 100,
            valueOptions: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'],
          },
        ]}
        getRowHeight={() => 'auto'}
      />,
    );
    expect(document.querySelectorAll(`.${gridClasses.multiSelectCellChip}`)).to.have.length(5);
    expect(
      document.querySelectorAll(`.${gridClasses['multiSelectCellChip--hidden']}`),
    ).to.have.length(0);
    expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).to.equal(null);
  });

  it.skipIf(isJSDOM)('should reveal all chips while the column is being resized', async () => {
    render(
      <TestCaseMultiSelect
        rows={[{ id: 1, tags: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'] }]}
        columns={[
          {
            field: 'tags',
            type: 'multiSelect',
            width: 120,
            valueOptions: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'],
          },
        ]}
      />,
    );
    // Narrow column overflows: some chips hidden behind the `+N` indicator.
    await waitFor(() => {
      expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).not.to.equal(null);
    });
    // Start resizing this column.
    act(() => {
      apiRef.current!.setState((state) => ({
        ...state,
        columnResize: { ...state.columnResize, resizingColumnField: 'tags' },
      }));
    });
    // Every chip is revealed, no `+N`.
    await waitFor(() => {
      expect(
        document.querySelectorAll(`.${gridClasses['multiSelectCellChip--hidden']}`),
      ).to.have.length(0);
      expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).to.equal(null);
    });
    // Releasing the resize recomputes the overflow.
    act(() => {
      apiRef.current!.setState((state) => ({
        ...state,
        columnResize: { ...state.columnResize, resizingColumnField: '' },
      }));
    });
    await waitFor(() => {
      expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).not.to.equal(null);
    });
  });

  describe.skipIf(isJSDOM)('overflow popup', () => {
    function TestCaseOverflow(props: Partial<DataGridProProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 200, height: 200 }}>
          <DataGridPro
            apiRef={apiRef}
            rows={[{ id: 1, tags: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'] }]}
            columns={[
              {
                field: 'tags',
                type: 'multiSelect',
                width: 100,
                valueOptions: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'],
              },
            ]}
            {...props}
          />
        </div>
      );
    }

    it('should auto-focus the overflow chip when the cell receives focus', async () => {
      render(<TestCaseOverflow />);
      await waitFor(() => {
        const overflow = document.querySelector(`.${gridClasses.multiSelectCellOverflow}`);
        expect(overflow).not.to.equal(null);
      });
      await act(async () => {
        apiRef.current!.setCellFocus(1, 'tags');
      });
      await waitFor(() => {
        const overflow = document.querySelector(
          `.${gridClasses.multiSelectCellOverflow}`,
        ) as HTMLElement;
        expect(document.activeElement).to.equal(overflow);
      });
    });

    it('should toggle the popup with Space', async () => {
      const { user } = render(<TestCaseOverflow />);
      await waitFor(() => {
        expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).not.to.equal(
          null,
        );
      });
      await act(async () => {
        apiRef.current!.setCellFocus(1, 'tags');
      });
      await user.keyboard(' ');
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      await user.keyboard(' ');
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).to.equal(null);
      });
    });

    it('should close the popup on Escape and refocus the cell', async () => {
      const { user } = render(<TestCaseOverflow />);
      await waitFor(() => {
        expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).not.to.equal(
          null,
        );
      });
      await act(async () => {
        apiRef.current!.setCellFocus(1, 'tags');
      });
      await user.keyboard(' ');
      const dialog = await screen.findByRole('dialog');
      await act(async () => {
        (dialog as HTMLElement).focus();
      });
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).to.equal(null);
      });
      const cell = apiRef.current!.getCellElement(1, 'tags');
      expect(cell!.contains(document.activeElement)).to.equal(true);
    });

    it('should close the popup on click-away', async () => {
      const { user } = render(<TestCaseOverflow />);
      await waitFor(() => {
        expect(document.querySelector(`.${gridClasses.multiSelectCellOverflow}`)).not.to.equal(
          null,
        );
      });
      const overflow = document.querySelector(
        `.${gridClasses.multiSelectCellOverflow}`,
      ) as HTMLElement;
      await user.click(overflow);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
      await user.click(document.body);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).to.equal(null);
      });
    });
  });
});
