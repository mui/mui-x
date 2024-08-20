import * as React from 'react';
import {
  GridApi,
  DataGridProProps,
  useGridApiRef,
  DataGridPro,
  GridEditCellValueParams,
  renderEditBooleanCell,
  renderEditDateCell,
  renderEditInputCell,
  renderEditSingleSelectCell,
} from '@mui/x-data-grid-pro';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { getCell, spyApi } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { spy, SinonSpy } from 'sinon';

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

describe('<DataGridPro /> - Edit components', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const defaultData: Pick<DataGridProProps, 'rows' | 'columns'> = { columns: [], rows: [] };

  function TestCase(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...defaultData} {...props} />
      </div>
    );
  }

  describe('column type: string', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, brand: 'Nike' }];
      defaultData.columns = [{ field: 'brand', type: 'string', editable: true }];
    });

    it('should call setEditCellValue with debounce', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('Nike');

      fireEvent.change(input, { target: { value: 'Puma' } });
      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 'Puma',
        debounceMs: 200,
        unstable_skipValueParser: true,
      });
    });

    it('should pass the value prop to the input', () => {
      defaultData.columns[0].valueParser = (value) => (value as string).toUpperCase();
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('Nike');

      fireEvent.change(input, { target: { value: 'Puma' } });
      expect(input.value).to.equal('PUMA');

      clock.tick(200);
      expect(input.value).to.equal('PUMA');
    });

    it('should display a indicator while processing the props', async () => {
      defaultData.columns[0].preProcessEditCellProps = () =>
        new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('Nike');

      expect(screen.queryByTestId('LoadIcon')).to.equal(null);
      fireEvent.change(input, { target: { value: 'Puma' } });
      act(() => clock.tick(200));
      expect(screen.queryByTestId('LoadIcon')).not.to.equal(null);

      clock.tick(500);
      await act(() => Promise.resolve());
      expect(screen.queryByTestId('LoadIcon')).to.equal(null);
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditInputCell({ ...params, onValueChange });

      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: 'Puma' } });
      await act(() => Promise.resolve());

      expect(onValueChange.callCount).to.equal(1);
      expect(onValueChange.lastCall.args[1]).to.equal('Puma');
    });
  });

  describe('column type: number', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, quantity: 100 }];
      defaultData.columns = [{ field: 'quantity', type: 'number', editable: true }];
    });

    it('should call setEditCellValue with debounce', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('100');

      fireEvent.change(input, { target: { value: '110' } });
      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'quantity',
        value: 110,
        debounceMs: 200,
        unstable_skipValueParser: true,
      });
    });

    it('should the value prop to the input', () => {
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('100');

      fireEvent.change(input, { target: { value: '110' } });
      expect(input.value).to.equal('110');

      clock.tick(200);
      expect(input.value).to.equal('110');
    });

    it('should keep values as numbers', async () => {
      const preProcessEditCellPropsSpy = spy(({ props }) => props);
      defaultData.columns[0].preProcessEditCellProps = preProcessEditCellPropsSpy;
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('100');

      fireEvent.change(input, { target: { value: '110' } });
      act(() => clock.tick(200));
      expect(preProcessEditCellPropsSpy.lastCall.args[0].props.value).to.equal(110);
      await act(() => Promise.resolve()); // To avoid mutating the state after unmount
    });

    it('should display a indicator while processing the props', async () => {
      defaultData.columns[0].preProcessEditCellProps = ({ props }) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(props), 500);
        });
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('100');

      expect(screen.queryByTestId('LoadIcon')).to.equal(null);
      fireEvent.change(input, { target: { value: 110 } });
      clock.tick(200);
      expect(screen.queryByTestId('LoadIcon')).not.to.equal(null);

      clock.tick(500);
      await act(() => Promise.resolve());
      expect(screen.queryByTestId('LoadIcon')).to.equal(null);
    });
  });

  describe('column type: date', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, createdAt: new Date(2022, 1, 18) }];
      defaultData.columns = [{ field: 'createdAt', type: 'date', editable: true }];
    });

    it('should call setEditCellValue with the value converted to Date', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18');

      fireEvent.change(input, { target: { value: '2022-02-10' } });

      expect(spiedSetEditCellValue.lastCall.args[0].id).to.equal(0);
      expect(spiedSetEditCellValue.lastCall.args[0].field).to.equal('createdAt');
      expect(spiedSetEditCellValue.lastCall.args[0].debounceMs).to.equal(undefined);
      expect((spiedSetEditCellValue.lastCall.args[0].value! as Date).toISOString()).to.equal(
        new Date(2022, 1, 10).toISOString(),
      );
    });

    it('should call setEditCellValue with null when entered an empty value', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value).to.equal(null);
    });

    it('should pass the value prop to the input', async () => {
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18');
      await act(async () => {
        await apiRef.current.setEditCellValue({
          id: 0,
          field: 'createdAt',
          value: new Date(2022, 1, 10),
        });
      });
      expect(input.value).to.equal('2022-02-10');
    });

    it('should handle correctly dates with partial years', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue') as SinonSpy<
        [GridEditCellValueParams & { value: Date }]
      >;

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18');

      fireEvent.change(input, { target: { value: '2021-01-05' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value!.getTime()).to.equal(
        generateDate(2021, 0, 5),
      );

      fireEvent.change(input, { target: { value: '2021-01-01' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value!.getTime()).to.equal(
        generateDate(2021, 0, 1),
      );

      fireEvent.change(input, { target: { value: '0001-01-01' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value!.getTime()).to.equal(
        generateDate(1, 0, 1),
      );

      fireEvent.change(input, { target: { value: '0019-01-01' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value!.getTime()).to.equal(
        generateDate(19, 0, 1),
      );

      fireEvent.change(input, { target: { value: '0199-01-01' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value!.getTime()).to.equal(
        generateDate(199, 0, 1),
      );

      fireEvent.change(input, { target: { value: '1999-01-01' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value!.getTime()).to.equal(
        generateDate(1999, 0, 1),
      );
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditDateCell({ ...params, onValueChange });

      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '2022-02-10' } });
      await act(() => Promise.resolve());

      expect(onValueChange.callCount).to.equal(1);
      expect((onValueChange.lastCall.args[1]! as Date).toISOString()).to.equal(
        new Date(2022, 1, 10).toISOString(),
      );
    });
  });

  describe('column type: dateTime', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, createdAt: new Date(2022, 1, 18, 14, 30) }];
      defaultData.columns = [{ field: 'createdAt', type: 'dateTime', editable: true }];
    });

    it('should call setEditCellValue with the value converted to Date', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18T14:30');

      fireEvent.change(input, { target: { value: '2022-02-10T15:30:00' } });

      expect(spiedSetEditCellValue.lastCall.args[0].id).to.equal(0);
      expect(spiedSetEditCellValue.lastCall.args[0].field).to.equal('createdAt');
      expect(spiedSetEditCellValue.lastCall.args[0].debounceMs).to.equal(undefined);
      expect((spiedSetEditCellValue.lastCall.args[0].value! as Date).toISOString()).to.equal(
        new Date(2022, 1, 10, 15, 30, 0).toISOString(),
      );
    });

    it('should call setEditCellValue with null when entered an empty value', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      fireEvent.change(input, { target: { value: '' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value).to.equal(null);
    });

    it('should pass the value prop to the input', async () => {
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18T14:30');
      await act(async () => {
        await apiRef.current.setEditCellValue({
          id: 0,
          field: 'createdAt',
          value: new Date(2022, 1, 10, 15, 10, 0),
        });
      });
      expect(input.value).to.equal('2022-02-10T15:10');
    });

    it('should handle correctly dates with partial years', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue') as SinonSpy<
        [GridEditCellValueParams & { value: Date }]
      >;

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18T14:30');

      fireEvent.change(input, { target: { value: '2021-01-05T14:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(2021, 0, 5, 14, 30),
      );

      fireEvent.change(input, { target: { value: '2021-01-01T14:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(2021, 0, 1, 14, 30),
      );

      fireEvent.change(input, { target: { value: '0001-01-01T14:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1, 0, 1, 14, 30),
      );

      fireEvent.change(input, { target: { value: '0019-01-01T14:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(19, 0, 1, 14, 30),
      );

      fireEvent.change(input, { target: { value: '0199-01-01T14:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(199, 0, 1, 14, 30),
      );

      fireEvent.change(input, { target: { value: '1999-01-01T14:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 14, 30),
      );

      fireEvent.change(input, { target: { value: '1999-01-01T20:30' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 30),
      );

      fireEvent.change(input, { target: { value: '1999-01-01T20:02' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 2),
      );

      fireEvent.change(input, { target: { value: '1999-01-01T20:25' } });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 25),
      );
    });
  });

  describe('column type: singleSelect', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, brand: 'Nike' }];
      defaultData.columns = [
        { field: 'brand', type: 'singleSelect', valueOptions: ['Nike', 'Adidas'], editable: true },
      ];
    });

    it('should call setEditCellValue with the correct value when valueOptions is an array of strings', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 'Adidas',
      });
    });

    it('should call setEditCellValue with the correct value when valueOptions is an array of objects', () => {
      defaultData.rows = [{ id: 0, brand: 0 }];
      defaultData.columns = [
        {
          field: 'brand',
          type: 'singleSelect',
          valueOptions: [
            { value: 0, label: 'Nike' },
            { value: 1, label: 'Adidas' },
          ],
          editable: true,
        },
      ];
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 1,
      });
    });

    it('should call setEditCellValue with the correct value when valueOptions is a function', () => {
      defaultData.columns = [
        {
          field: 'brand',
          type: 'singleSelect',
          valueOptions: () => ['Nike', 'Adidas'],
          editable: true,
        },
      ];
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 'Adidas',
      });
    });

    it('should pass the value prop to the select', async () => {
      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      expect(cell.textContent!.replace(/[\W]+/, '')).to.equal('Nike'); // We use .replace to remove &ZeroWidthSpace;
      await act(() => apiRef.current.setEditCellValue({ id: 0, field: 'brand', value: 'Adidas' }));
      expect(cell.textContent!.replace(/[\W]+/, '')).to.equal('Adidas');
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditSingleSelectCell({ ...params, onValueChange });

      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireEvent.click(screen.queryAllByRole('option')[1]);
      await act(() => Promise.resolve());

      expect(onValueChange.callCount).to.equal(1);
      expect(onValueChange.lastCall.args[1]).to.equal('Adidas');
    });

    it('should call onCellEditStop', async () => {
      const onCellEditStop = spy();

      render(
        <div>
          <TestCase onCellEditStop={onCellEditStop} />
          <div id="outside-grid" />
        </div>,
      );

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireUserEvent.mousePress(document.getElementById('outside-grid')!);
      await act(() => Promise.resolve());

      expect(onCellEditStop.callCount).to.equal(1);
    });

    it('should not open the suggestions when Enter is pressed', async () => {
      let resolveCallback: () => void;
      const processRowUpdate = (newRow: any) =>
        new Promise((resolve) => {
          resolveCallback = () => resolve(newRow);
        });

      defaultData.columns[0].renderEditCell = (params) => renderEditSingleSelectCell(params);

      render(<TestCase processRowUpdate={processRowUpdate} />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);
      fireUserEvent.mousePress(screen.queryAllByRole('option')[1]);
      clock.runToLast();
      expect(screen.queryByRole('listbox')).to.equal(null);
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
      expect(screen.queryByRole('listbox')).to.equal(null);

      resolveCallback!();
      await act(() => Promise.resolve());
    });
  });

  describe('column type: boolean', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, isAdmin: false }];
      defaultData.columns = [{ field: 'isAdmin', type: 'boolean', editable: true }];
    });

    it('should call setEditCellValue', () => {
      render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current, 'setEditCellValue');

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.checked).to.equal(false);

      fireEvent.click(input);
      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'isAdmin',
        value: true,
      });
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditBooleanCell({ ...params, onValueChange });

      render(<TestCase />);

      const cell = getCell(0, 0);
      fireEvent.doubleClick(cell);

      const input = cell.querySelector('input')!;
      fireEvent.click(input);
      await act(() => Promise.resolve());

      expect(onValueChange.callCount).to.equal(1);
      expect(onValueChange.lastCall.args[1]).to.equal(true);
    });
  });
});
