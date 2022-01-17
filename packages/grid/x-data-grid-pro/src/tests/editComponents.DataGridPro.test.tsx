import * as React from 'react';
import {
  GridApiRef,
  DataGridProProps,
  useGridApiRef,
  DataGridPro,
  GridEditSingleSelectCell,
} from '@mui/x-data-grid-pro';
import { createRenderer, fireEvent, screen, waitFor, act } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getCell } from 'test/utils/helperFn';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

/**
 * Creates a date that is compatible with years before 1901
 * `new Date(0001)` creates a date for 1901, not 0001
 */
const generateDate = (
  year: number,
  month: number,
  date?: number,
  hours?: number,
  minutes?: number,
) => {
  const rawDate = new Date();
  rawDate.setFullYear(year);
  rawDate.setMonth(month);
  rawDate.setDate(date ?? 0);
  rawDate.setHours(hours ?? 0);
  rawDate.setMinutes(minutes ?? 0);
  rawDate.setSeconds(0);
  rawDate.setMilliseconds(0);

  return rawDate.getTime();
};

describe('<DataGridPro /> - Edit Components', () => {
  let baselineProps: Pick<DataGridProProps, 'autoHeight' | 'rows' | 'columns' | 'throttleRowsMs'>;

  beforeEach(() => {
    baselineProps = {
      autoHeight: isJSDOM,
      rows: [
        {
          id: 0,
          brand: 'Nike',
          year: 1941,
        },
        {
          id: 1,
          brand: 'Adidas',
          year: 1961,
        },
        {
          id: 2,
          brand: 'Puma',
          year: 1921,
        },
      ],
      columns: [
        { field: 'brand', editable: true },
        { field: 'year', editable: true },
      ],
      throttleRowsMs: 0,
    };
  });

  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: GridApiRef;

  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  describe('column type: singleSelect', () => {
    it('should change cell value correctly when the valueOptions is array of strings', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: ['Nike', 'Adidas'],
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      await waitFor(() => {
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
        expect(cell).to.have.text('Adidas');
      });
    });

    it('should change cell value correctly when the valueOptions is array of objects', async () => {
      const countries = [
        {
          value: 'fr',
          label: 'France',
        },
        {
          value: 'it',
          label: 'Italy',
        },
      ];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'country',
                type: 'singleSelect',
                valueOptions: countries,
                valueFormatter: (params) => {
                  const result = countries.find((country) => country.value === params.value);
                  return result!.label;
                },
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                country: 'fr',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      await waitFor(() => {
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
        expect(cell).to.have.text('Italy');
      });
    });

    it('should change cell value correctly when the valueOptions is a function returning an array of strings', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: () => ['Nike', 'Adidas'],
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      await waitFor(() => {
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
        expect(cell).to.have.text('Adidas');
      });
    });

    it('should change cell value correctly when the valueOptions is a function returning an array of objects', async () => {
      const countries = [
        {
          value: 'fr',
          label: 'France',
        },
        {
          value: 'it',
          label: 'Italy',
        },
      ];

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'country',
                type: 'singleSelect',
                valueOptions: () => countries,
                valueFormatter: (params) => {
                  const result = countries.find((country) => country.value === params.value);
                  return result!.label;
                },
                editable: true,
              },
            ]}
            rows={[
              {
                id: 0,
                country: 'fr',
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      await waitFor(() => {
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
        expect(cell).to.have.text('Italy');
      });
    });

    it('should apply valueFormatter to select options when valueOptions is of primitive types', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'role',
                type: 'singleSelect',
                valueOptions: [0, 1],
                valueFormatter: ({ value }) => ['User', 'Admin'][value as number],
                editable: true,
                width: 200,
              },
            ]}
            rows={[
              {
                id: 0,
                role: 0,
              },
            ]}
          />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      const firstOption = screen.queryAllByRole('option')[0];
      const secondOption = screen.queryAllByRole('option')[1];

      expect(firstOption).to.have.text('User');
      expect(secondOption).to.have.text('Admin');
    });

    it('should set the focus correctly when entering the edit mode with a double click', () => {
      render(
        <TestCase
          columns={[
            {
              field: 'brand',
              type: 'singleSelect',
              valueOptions: ['Nike', 'Adidas'],
              editable: true,
              renderEditCell: (params: any) => (
                <GridEditSingleSelectCell {...params} open={false} /> // Force to appear closed
              ),
            },
          ]}
          rows={[
            {
              id: 0,
              brand: 'Nike',
            },
          ]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('button', { name: 'Nike' })).toHaveFocus();
    });

    it('should move the focus to the cell below when selecting a value with Enter', async () => {
      render(
        <TestCase
          columns={[
            {
              field: 'brand',
              type: 'singleSelect',
              valueOptions: ['Nike', 'Adidas'],
              editable: true,
            },
          ]}
          rows={[
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
          ]}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.keyDown(cell, { key: 'Enter' });
      fireEvent.keyDown(screen.queryByRole('option', { name: 'Nike' }), { key: 'ArrowDown' });
      fireEvent.keyDown(screen.queryByRole('option', { name: 'Adidas' }), { key: 'Enter' });
      await waitFor(() => {
        // @ts-expect-error need to migrate helpers to TypeScript
        expect(getCell(1, 0)).toHaveFocus();
      });
    });

    it('should not exit the edit mode when preProcessEditCellProps returns an object with error', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: ['Nike', 'Adidas'],
                editable: true,
                preProcessEditCellProps: ({ props }) => ({ ...props, error: true }),
              },
            ]}
            rows={[{ id: 0, brand: 'Nike' }]}
          />
        </div>,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      const option = screen.queryAllByRole('option')[1];
      fireEvent.mouseUp(option);
      fireEvent.click(option);
      await waitFor(() => {
        expect(cell.firstChild).to.have.class('Mui-error');
      });
    });

    it('should not exit the edit mode when preProcessEditCellProps returns a promise with error', async () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPro
            columns={[
              {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: ['Nike', 'Adidas'],
                editable: true,
                preProcessEditCellProps: ({ props }) => Promise.resolve({ ...props, error: true }),
              },
            ]}
            rows={[{ id: 0, brand: 'Nike' }]}
          />
        </div>,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
      const option = screen.queryAllByRole('option')[1];
      fireEvent.mouseUp(option);
      fireEvent.click(option);
      await waitFor(() => {
        expect(cell.firstChild).to.have.class('Mui-error');
      });
    });
  });

  describe('column type: number', () => {
    it('should keep the right type', async () => {
      const Test = (props: Partial<DataGridProProps>) => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'year', type: 'number', editable: true }]}
              {...props}
            />
          </div>
        );
      };
      render(<Test />);
      expect(screen.queryAllByRole('row')).to.have.length(4);
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('1941');
      fireEvent.change(input, { target: { value: '1942' } });
      clock.tick(500);

      fireEvent.keyDown(input, { key: 'Enter' });
      await waitFor(() => {
        expect(cell).to.have.text('1,942');
        expect(apiRef.current.getRow(baselineProps.rows[0].id)!.year).to.equal(1942);
      });
    });

    it('should allow to enter 0', async () => {
      const Test = (props: Partial<DataGridProProps>) => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'year', type: 'number', editable: true }]}
              {...props}
            />
          </div>
        );
      };
      render(<Test />);
      const cell = getCell(0, 0);
      fireEvent.mouseUp(cell);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '0' } });
      expect(input.value).to.equal('0');
    });
  });

  describe('column type: date', () => {
    it('should call onEditCellPropsChange with the value entered as a Date', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-05-07' } });
      expect(onEditCellPropsChange.args[0][0].props.value.toISOString()).to.equal(
        new Date(2022, 4, 7).toISOString(),
      );
    });

    it('should call onEditCellPropsChange with null when entered an empty value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.args[0][0].props.value).to.equal(null);
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('cell').querySelector('input')).toHaveFocus();
    });

    it('should allow external value updates as date', async () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const newValue = new Date(2021, 6, 4);
      act(() => {
        apiRef.current.setEditCellValue({ id: 0, field: 'date', value: newValue });
      });
      const input = cell.querySelector('input')!;
      await waitFor(() => {
        expect(input.value).to.equal('2021-07-04');
      });
    });

    it('should handle all the intermediate dates while editing the value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5) }]}
          columns={[{ field: 'date', type: 'date', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );

      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value).to.equal(null);
      fireEvent.change(input, { target: { value: '2021-01-05' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(2021, 0, 5),
      );
      fireEvent.change(input, { target: { value: '2021-01-01' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(2021, 0, 1),
      );
      fireEvent.change(input, { target: { value: '0001-01-01' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1, 0, 1),
      );
      fireEvent.change(input, { target: { value: '0019-01-01' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(19, 0, 1),
      );
      fireEvent.change(input, { target: { value: '0199-01-01' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(199, 0, 1),
      );
      fireEvent.change(input, { target: { value: '1999-01-01' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1999, 0, 1),
      );
    });
  });

  describe('column type: dateTime', () => {
    it('should call onEditCellPropsChange with the value entered as a Date', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-05-07T15:30:00' } });
      expect(onEditCellPropsChange.args[0][0].props.value.toISOString()).to.equal(
        new Date(2022, 4, 7, 15, 30).toISOString(),
      );
    });

    it('should call onEditCellPropsChange with null when entered an empty value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.args[0][0].props.value).to.equal(null);
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('cell').querySelector('input')).toHaveFocus();
    });

    it('should allow external value updates as date', async () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const newValue = new Date(2021, 6, 4, 17, 30);
      act(() => {
        apiRef.current.setEditCellValue({ id: 0, field: 'date', value: newValue });
      });
      const input = cell.querySelector('input')!;
      await waitFor(() => {
        expect(input.value).to.equal('2021-07-04T17:30');
      });
    });

    it('should handle all the intermediate dates while editing the value', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, date: new Date(2021, 6, 5, 14, 30) }]}
          columns={[{ field: 'date', type: 'dateTime', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );

      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value).to.equal(null);
      fireEvent.change(input, { target: { value: '2021-01-05T14:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(2021, 0, 5, 14, 30),
      );
      fireEvent.change(input, { target: { value: '2021-01-01T14:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(2021, 0, 1, 14, 30),
      );
      fireEvent.change(input, { target: { value: '0001-01-01T14:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1, 0, 1, 14, 30),
      );
      fireEvent.change(input, { target: { value: '0019-01-01T14:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(19, 0, 1, 14, 30),
      );
      fireEvent.change(input, { target: { value: '0199-01-01T14:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(199, 0, 1, 14, 30),
      );
      fireEvent.change(input, { target: { value: '1999-01-01T14:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1999, 0, 1, 14, 30),
      );
      fireEvent.change(input, { target: { value: '1999-01-01T20:30' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 30),
      );
      fireEvent.change(input, { target: { value: '1999-01-01T20:02' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 2),
      );
      fireEvent.change(input, { target: { value: '1999-01-01T20:25' } });
      expect(onEditCellPropsChange.lastCall.args[0].props.value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 25),
      );
    });
  });

  describe('column type: string', () => {
    it('should debounce calls to preProcessEditCellProps', () => {
      const preProcessEditCellProps = spy(({ props }) => props);
      const Test = () => {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              columns={[
                { field: 'brand', type: 'string', editable: true, preProcessEditCellProps },
              ]}
            />
          </div>
        );
      };
      render(<Test />);
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('Nike');
      fireEvent.change(input, { target: { value: 'n' } });
      fireEvent.change(input, { target: { value: 'ni' } });
      fireEvent.change(input, { target: { value: 'nik' } });
      fireEvent.change(input, { target: { value: 'nike' } });
      expect(preProcessEditCellProps.callCount).to.equal(0);
      clock.tick(500);
      expect(preProcessEditCellProps.callCount).to.equal(1);
    });
  });

  describe('column type: boolean', () => {
    it('should call onEditCellPropsChange with the correct params', () => {
      const onEditCellPropsChange = spy();
      render(
        <TestCase
          rows={[{ id: 0, isAdmin: false }]}
          columns={[{ field: 'isAdmin', type: 'boolean', editable: true }]}
          onEditCellPropsChange={onEditCellPropsChange}
        />,
      );
      const cell = getCell(0, 0);
      cell.focus();
      fireEvent.doubleClick(cell);
      const input = cell.querySelector('input')!;
      fireEvent.click(input);
      expect(onEditCellPropsChange.args[0][0]).to.deep.equal({
        id: 0,
        field: 'isAdmin',
        props: { value: true },
      });
    });

    it('should set the focus correctly', () => {
      render(
        <TestCase
          rows={[{ id: 0, isAdmin: false }]}
          columns={[{ field: 'isAdmin', type: 'boolean', editable: true }]}
        />,
      );
      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      // @ts-expect-error need to migrate helpers to TypeScript
      expect(screen.getByRole('checkbox')).toHaveFocus();
    });
  });
});
