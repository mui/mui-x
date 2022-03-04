import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  DataGrid,
  DataGridProps,
  GridFilterInputValue,
  GridFilterInputValueProps,
  GridPreferencePanelsValue,
  GridFilterItem,
} from '@mui/x-data-grid';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, screen, waitFor } from '@mui/monorepo/test/utils';
import { getColumnValues } from '../../../../../test/utils/helperFn';

function setColumnValue(columnValue: string) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Columns' }), {
    target: { value: columnValue },
  });
}

function setOperatorValue(operatorValue: string) {
  fireEvent.change(screen.getByRole('combobox', { name: 'Operator' }), {
    target: { value: operatorValue },
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

  const baselineProps = {
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
            getApplyFilterFn: (filterItem: GridFilterItem) => {
              if (!filterItem.value) {
                return null;
              }
              const collator = new Intl.Collator(undefined, {
                sensitivity: 'base',
                usage: 'search',
              });
              return ({ value }: { value: any }): boolean => {
                return collator.compare(filterItem.value, (value && value.toString()) || '') === 0;
              };
            },
            InputComponent: GridFilterInputValue,
          },
        ],
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

  const TestCase = (props: Partial<DataGridProps>) => {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} {...props} />
      </div>
    );
  };

  it('should show an empty string as the default filter input value', () => {
    render(
      <TestCase
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
        filterModel={{ items: [{ columnField: 'brand', operatorValue: 'contains' }] }}
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('');
  });

  it('should keep filter operator and value if available', () => {
    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: 'brand',
                  value: 'Puma',
                  operatorValue: 'equals',
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
    expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
    expect(screen.getByRole('combobox', { name: 'Operator' }).value).to.equal('equals');
    expect(getColumnValues(0)).to.deep.equal(['Puma']);

    setColumnValue('slogan');

    expect(getColumnValues(0)).to.deep.equal([]);
    expect(screen.getByRole('combobox', { name: 'Operator' }).value).to.equal('equals');
    expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
  });

  it('should reset value if operator is not available for the new column', () => {
    render(
      <TestCase
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: 'brand',
                  operatorValue: 'contains',
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
    expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
    expect(screen.getByRole('combobox', { name: 'Operator' }).value).to.equal('contains');
    expect(getColumnValues(0)).to.deep.equal(['Puma']);

    setColumnValue('slogan');

    expect(getColumnValues(0)).to.deep.equal([]);
    expect(screen.getByRole('combobox', { name: 'Operator' }).value).to.equal('from');
    expect(screen.getByTestId('customInput').value).to.equal('');
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
                  columnField: 'brand',
                  operatorValue: 'contains',
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
    expect(screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
    expect(screen.getByRole('combobox', { name: 'Operator' }).value).to.equal('contains');
    expect(getColumnValues(0)).to.deep.equal(['Puma']);

    expect(onFilterModelChange.callCount).to.equal(0);

    setOperatorValue('isEmpty');

    expect(onFilterModelChange.callCount).to.equal(1);
    expect(onFilterModelChange.lastCall.args[0].items[0].value).to.equal(undefined);

    expect(screen.getByRole('combobox', { name: 'Operator' }).value).to.equal('isEmpty');
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
              items: [{ columnField: 'destination', operatorValue: 'is', value: 'UK' }],
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
              items: [{ columnField: 'destination', operatorValue: 'is', value: 'GE' }],
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
              items: [{ columnField: 'destination', operatorValue: 'isAnyOf', value: ['UK'] }],
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
              items: [{ columnField: 'destination', operatorValue: 'isAnyOf', value: ['GE'] }],
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
              items: [{ columnField: 'destination', operatorValue: 'isAnyOf', value: ['UK'] }],
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
              items: [{ columnField: 'val', operatorValue: 'contains', value: 'UK' }],
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

    // TODO v6: remove the next two lines
    deleteFilterForm();
    expect(onFilterModelChange.lastCall.args[0].items[0].value).to.equal(undefined);

    deleteFilterForm();
    await waitFor(() => {
      expect(screen.queryAllByRole('tooltip').length).to.deep.equal(0);
    });
  });
});
