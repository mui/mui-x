import * as React from 'react';
import { spy } from 'sinon';
import {
  DataGrid,
  type DataGridProps,
  GridFilterInputValue,
  type GridFilterInputValueProps,
  type GridFilterOperator,
  GridPreferencePanelsValue,
  getGridStringOperators,
  getGridSingleSelectOperators,
} from '@mui/x-data-grid';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { getColumnHeaderCell, getColumnValues, getSelectByName } from 'test/utils/helperFn';

function setColumnValue(columnValue: string) {
  fireEvent.change(getSelectByName('Column'), {
    target: { value: columnValue },
  });
}

function setOperatorValue(operator: string) {
  fireEvent.change(getSelectByName('Operator'), {
    target: { value: operator },
  });
}

function deleteFilterForm() {
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
}

function CustomInputValue(props: GridFilterInputValueProps) {
  const { item, applyValue } = props;

  const handleFilterChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    applyValue({ ...item, value: event.target.value });
  };

  return (
    <input
      name="custom-filter-operator"
      placeholder="Filter value"
      value={item.value}
      onChange={handleFilterChange}
      data-testid="customInput"
    />
  );
}

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Filter panel', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        slogan: 'just do it',
        isPublished: false,
        country: 'United States',
        status: 0,
      },
      {
        id: 1,
        brand: 'Adidas',
        slogan: 'is all in',
        isPublished: true,
        country: 'Germany',
        status: 0,
      },
      {
        id: 2,
        brand: 'Puma',
        slogan: 'Forever Faster',
        isPublished: true,
        country: 'Germany',
        status: 2,
      },
    ],
    columns: [
      { field: 'brand' },
      {
        field: 'slogan',
        filterOperators: [
          {
            label: 'From',
            value: 'from',
            getApplyFilterFn: () => {
              return () => false;
            },
            InputComponent: CustomInputValue,
          },
          {
            value: 'equals',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.value) {
                return null;
              }
              const collator = new Intl.Collator(undefined, {
                sensitivity: 'base',
                usage: 'search',
              });
              return (value) => {
                return collator.compare(filterItem.value, (value && value.toString()) || '') === 0;
              };
            },
            InputComponent: GridFilterInputValue,
          },
        ] as GridFilterOperator<any, string>[],
      },
      { field: 'isPublished', type: 'boolean' },
      {
        field: 'country',
        type: 'singleSelect',
        valueOptions: ['United States', 'Germany', 'France'],
      },
      {
        field: 'status',
        type: 'singleSelect',
        valueOptions: [
          { value: 0, label: 'Payment Pending' },
          { value: 1, label: 'Shipped' },
          { value: 2, label: 'Delivered' },
        ],
      },
    ],
  };

  function TestCase(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} {...props} />
      </div>
    );
  }

  it('should show an empty string as the default filter input value', () => {
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        filterModel={{ items: [{ field: 'brand', operator: 'contains' }] }}
      />,
    );
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Value' }).value).to.equal('');
  });

  it('should keep filter operator and value if available', () => {
    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'brand',
                  value: 'Puma',
                  operator: 'equals',
                },
              ],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Value' }).value).to.equal('Puma');
    expect(getSelectByName('Operator').value).to.equal('equals');
    expect(getColumnValues(0)).to.deep.equal(['Puma']);

    setColumnValue('slogan');

    expect(getColumnValues(0)).to.deep.equal([]);
    expect(getSelectByName('Operator').value).to.equal('equals');
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Value' }).value).to.equal('Puma');
  });

  it('should reset value if operator is not available for the new column', () => {
    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'brand',
                  operator: 'contains',
                  value: 'Pu',
                },
              ],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Value' }).value).to.equal('Pu');
    expect(getSelectByName('Operator').value).to.equal('contains');
    expect(getColumnValues(0)).to.deep.equal(['Puma']);

    setColumnValue('slogan');

    expect(getColumnValues(0)).to.deep.equal([]);
    expect(getSelectByName('Operator').value).to.equal('from');
    expect(screen.getByTestId<HTMLInputElement>('customInput').value).to.equal('');
  });

  it('should reset value if the new operator has no input component', () => {
    const onFilterModelChange = spy();

    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: 'brand',
                  operator: 'contains',
                  value: 'Pu',
                },
              ],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        onFilterModelChange={onFilterModelChange}
      />,
    );
    expect(screen.getByRole<HTMLInputElement>('textbox', { name: 'Value' }).value).to.equal('Pu');
    expect(getSelectByName('Operator').value).to.equal('contains');
    expect(getColumnValues(0)).to.deep.equal(['Puma']);

    expect(onFilterModelChange.callCount).to.equal(0);

    setOperatorValue('isEmpty');

    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.args[0].items[0].value).to.equal(undefined);

    expect(getSelectByName('Operator').value).to.equal('isEmpty');
  });

  it('should reset filter value if not available in the new valueOptions', () => {
    render(
      <TestCase
        rows={[
          { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
          { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
          { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
        ]}
        columns={[
          { field: 'reference' },
          { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
          {
            field: 'destination',
            type: 'singleSelect',
            valueOptions: ['Italy', 'Germany', 'UK'],
          },
        ]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'destination', operator: 'is', value: 'UK' }],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );
    expect(getColumnValues(0)).to.deep.equal(['REF_2']);

    setColumnValue('origin');

    expect(getColumnValues(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
  });

  it('should keep the value if available in the new valueOptions', () => {
    const IT = { value: 'IT', label: 'Italy' };
    const GE = { value: 'GE', label: 'Germany' };

    render(
      <TestCase
        rows={[
          { id: 1, reference: 'REF_1', origin: 'IT', destination: 'GE' },
          { id: 2, reference: 'REF_2', origin: 'GE', destination: 'UK' },
          { id: 3, reference: 'REF_3', origin: 'GE', destination: 'IT' },
        ]}
        columns={[
          { field: 'reference' },
          { field: 'origin', type: 'singleSelect', valueOptions: [IT, GE] },
          { field: 'destination', type: 'singleSelect', valueOptions: ['IT', 'GE', 'UK'] },
        ]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'destination', operator: 'is', value: 'GE' }],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    expect(getColumnValues(0)).to.deep.equal(['REF_1']);

    setColumnValue('origin');

    expect(getColumnValues(0)).to.deep.equal(['REF_2', 'REF_3']);
  });

  it('should reset filter value if not available in the new valueOptions with operator "isAnyOf"', () => {
    render(
      <TestCase
        rows={[
          { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
          { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
          { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
        ]}
        columns={[
          { field: 'reference' },
          { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
          {
            field: 'destination',
            type: 'singleSelect',
            valueOptions: ['Italy', 'Germany', 'UK'],
          },
        ]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'destination', operator: 'isAnyOf', value: ['UK'] }],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    expect(getColumnValues(0)).to.deep.equal(['REF_2']);
    setColumnValue('origin');
    expect(getColumnValues(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
  });

  it('should keep the value if available in the new valueOptions with operator "isAnyOf"', () => {
    const IT = { value: 'IT', label: 'Italy' };
    const GE = { value: 'GE', label: 'Germany' };

    render(
      <TestCase
        rows={[
          { id: 1, reference: 'REF_1', origin: 'IT', destination: 'GE' },
          { id: 2, reference: 'REF_2', origin: 'GE', destination: 'UK' },
          { id: 3, reference: 'REF_3', origin: 'GE', destination: 'IT' },
        ]}
        columns={[
          { field: 'reference' },
          { field: 'origin', type: 'singleSelect', valueOptions: [IT, GE] },
          { field: 'destination', type: 'singleSelect', valueOptions: ['IT', 'GE', 'UK'] },
        ]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'destination', operator: 'isAnyOf', value: ['GE'] }],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    expect(getColumnValues(0)).to.deep.equal(['REF_1']);
    setColumnValue('origin');
    expect(getColumnValues(0)).to.deep.equal(['REF_2', 'REF_3']);
  });

  it('should reset filter value if moving from multiple to single value operator', () => {
    render(
      <TestCase
        rows={[
          { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
          { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
          { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
        ]}
        columns={[
          { field: 'reference' },
          { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
          {
            field: 'destination',
            type: 'singleSelect',
            valueOptions: ['Italy', 'Germany', 'UK'],
          },
        ]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'destination', operator: 'isAnyOf', value: ['UK'] }],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );
    expect(getColumnValues(0)).to.deep.equal(['REF_2']);

    setOperatorValue('is');

    expect(getColumnValues(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
  });

  it('should close filter panel when removing the last filter', async () => {
    const onFilterModelChange = spy();

    render(
      <TestCase
        rows={[
          { id: 1, val: 'VAL_1' },
          { id: 2, val: 'VAL_2' },
          { id: 3, val: 'VAL_3' },
        ]}
        columns={[{ field: 'id' }, { field: 'val' }]}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'val', operator: 'contains', value: 'UK' }],
            },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        onFilterModelChange={onFilterModelChange}
      />,
    );
    expect(screen.queryAllByRole('tooltip').length).to.deep.equal(1);

    deleteFilterForm();

    expect(screen.queryAllByRole('tooltip').length).to.deep.equal(0);
  });

  // See https://github.com/mui/mui-x/issues/5402
  it('should not remove `isEmpty` filter from model when filter panel is opened through column menu', () => {
    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'brand', operator: 'isEmpty' }],
            },
          },
        }}
      />,
    );

    // open filter panel
    const columnCell = getColumnHeaderCell(0);
    const menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]')!;
    fireEvent.click(menuIconButton);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Filter' }));

    // check that the filter is still in the model
    expect(getSelectByName('Column').value).to.equal('brand');
    expect(getSelectByName('Operator').value).to.equal('isEmpty');
  });

  // See https://github.com/mui/mui-x/issues/21404
  (['string', 'singleSelect'] as const).forEach((type) => {
    it(`should forward InputComponentProps for ${type} isAnyOf operator`, () => {
      const operators =
        type === 'string' ? getGridStringOperators() : getGridSingleSelectOperators();
      render(
        <TestCase
          columns={[
            {
              field: 'brand',
              type,
              ...(type === 'singleSelect' && { valueOptions: ['Nike', 'Adidas', 'Puma'] }),
              filterOperators: operators.map((op) =>
                op.value === 'isAnyOf'
                  ? { ...op, InputComponentProps: { 'data-testid': 'custom-autocomplete' } }
                  : op,
              ),
            },
          ]}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'isAnyOf' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );
      expect(screen.getByTestId('custom-autocomplete')).to.not.equal(null);
    });
  });

  describe('loading icon', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function LoadIcon() {
      return <span data-testid="loadIcon" />;
    }

    // These tests use fireEvent.change instead of user.type because
    // user.type hangs with vi.useFakeTimers() (the user instance from
    // createRenderer is not configured with advanceTimers).

    it('should not show the loading icon with default filterDebounceMs', async () => {
      render(
        <TestCase
          slots={{ loadIcon: LoadIcon }}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'contains' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Value' });
      fireEvent.change(input, { target: { value: 'N' } });
      await act(async () => vi.advanceTimersByTimeAsync(150));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);
    });

    it('should show the loading icon when filterDebounceMs exceeds the threshold', async () => {
      render(
        <TestCase
          slots={{ loadIcon: LoadIcon }}
          filterDebounceMs={1000}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'contains' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Value' });
      fireEvent.change(input, { target: { value: 'N' } });

      // Icon should not be visible before the 500ms threshold
      await act(async () => vi.advanceTimersByTimeAsync(499));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);

      // Icon should appear after the 500ms threshold
      await act(async () => vi.advanceTimersByTimeAsync(1));
      expect(screen.queryByTestId('loadIcon')).not.to.equal(null);

      // Icon should disappear after the filter debounce completes
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);
    });

    it('should hide the loading icon when typing again after it became visible', async () => {
      render(
        <TestCase
          slots={{ loadIcon: LoadIcon }}
          filterDebounceMs={1000}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'contains' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Value' });
      fireEvent.change(input, { target: { value: 'N' } });

      // Wait for the icon to appear
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).not.to.equal(null);

      // Type again — icon should reset immediately
      fireEvent.change(input, { target: { value: 'Ni' } });
      expect(screen.queryByTestId('loadIcon')).to.equal(null);

      // Icon should reappear after the threshold from the new keystroke
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).not.to.equal(null);

      // And disappear when debounce completes
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);
    });

    it('should not show the loading icon during rapid typing with default debounce', async () => {
      render(
        <TestCase
          slots={{ loadIcon: LoadIcon }}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'contains' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Value' });

      // Simulate rapid typing — each keystroke resets timers
      fireEvent.change(input, { target: { value: 'N' } });
      await act(async () => vi.advanceTimersByTimeAsync(50));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);

      fireEvent.change(input, { target: { value: 'Ni' } });
      await act(async () => vi.advanceTimersByTimeAsync(50));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);

      fireEvent.change(input, { target: { value: 'Nik' } });
      await act(async () => vi.advanceTimersByTimeAsync(150));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);
    });

    it('should not show the loading icon when filterDebounceMs is 0', async () => {
      render(
        <TestCase
          slots={{ loadIcon: LoadIcon }}
          filterDebounceMs={0}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'brand', operator: 'contains' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Value' });
      fireEvent.change(input, { target: { value: 'N' } });
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);
    });

    it('should delay the loading icon for date filter inputs', async () => {
      render(
        <TestCase
          slots={{ loadIcon: LoadIcon }}
          rows={[
            { id: 0, brand: 'Nike', createdAt: new Date(2024, 0, 1) },
            { id: 1, brand: 'Adidas', createdAt: new Date(2024, 5, 15) },
          ]}
          columns={[{ field: 'brand' }, { field: 'createdAt', type: 'date' }]}
          filterDebounceMs={1000}
          initialState={{
            filter: {
              filterModel: {
                items: [{ field: 'createdAt', operator: 'is' }],
              },
            },
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
          }}
        />,
      );

      const input = screen.getByLabelText('Value');
      fireEvent.change(input, { target: { value: '2024-01-01' } });

      // Icon should not appear before threshold
      await act(async () => vi.advanceTimersByTimeAsync(499));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);

      // Icon should appear after threshold
      await act(async () => vi.advanceTimersByTimeAsync(1));
      expect(screen.queryByTestId('loadIcon')).not.to.equal(null);

      // Type again — icon should reset immediately
      fireEvent.change(input, { target: { value: '2024-06-15' } });
      expect(screen.queryByTestId('loadIcon')).to.equal(null);

      // Icon reappears after threshold from new keystroke
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).not.to.equal(null);

      // Disappears when debounce completes
      await act(async () => vi.advanceTimersByTimeAsync(500));
      expect(screen.queryByTestId('loadIcon')).to.equal(null);
    });
  });

  // See https://github.com/mui/mui-x/issues/7901#issuecomment-1427058922
  it('should remove `isAnyOf` filter from the model when filter panel is opened through column menu', () => {
    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: 'country', operator: 'isAnyOf', value: [] }],
            },
          },
        }}
      />,
    );

    // open filter panel
    const columnCell = getColumnHeaderCell(3);
    const menuIconButton = columnCell.querySelector('button[aria-label="country column menu"]')!;
    fireEvent.click(menuIconButton);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Filter' }));

    // check that the filter is changed to default one (`is`)
    expect(getSelectByName('Column').value).to.equal('country');
    expect(getSelectByName('Operator').value).to.equal('is');
  });
});
