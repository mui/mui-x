import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGrid,
  DataGridProps,
  GridFilterInputValue,
  GridFilterInputValueProps,
  GridFilterOperator,
  GridPreferencePanelsValue,
} from '@mui/x-data-grid';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { getColumnHeaderCell, getColumnValues, getSelectByName } from 'test/utils/helperFn';

function setColumnValue(columnValue: string) {
  fireEvent.change(getSelectByName('Columns'), {
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
  const { render, clock } = createRenderer({ clock: 'fake' });

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
    clock.tick(100);
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
    const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
    fireEvent.click(menuIconButton);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Filter' }));

    // check that the filter is still in the model
    expect(getSelectByName('Columns').value).to.equal('brand');
    expect(getSelectByName('Operator').value).to.equal('isEmpty');
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
    const menuIconButton = columnCell.querySelector('button[aria-label="Menu"]')!;
    fireEvent.click(menuIconButton);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Filter' }));

    // check that the filter is changed to default one (`is`)
    expect(getSelectByName('Columns').value).to.equal('country');
    expect(getSelectByName('Operator').value).to.equal('is');
  });
});
