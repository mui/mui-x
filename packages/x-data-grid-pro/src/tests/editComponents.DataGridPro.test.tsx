import { type RefObject } from '@mui/x-internals/types';
import {
  type GridApi,
  type DataGridProProps,
  useGridApiRef,
  DataGridPro,
  type GridEditCellValueParams,
  renderEditBooleanCell,
  renderEditDateCell,
  renderEditInputCell,
  renderEditSingleSelectCell,
  renderEditMultiSelectCell,
  GridMultiSelectCell,
  type GridMultiSelectCellProps,
  GridEditMultiSelectCell,
  type GridEditMultiSelectCellProps,
} from '@mui/x-data-grid-pro';
import { act, createRenderer, screen, waitFor, within } from '@mui/internal-test-utils';
import { getCell, spyApi, sleep } from 'test/utils/helperFn';
import { spy, type SinonSpy } from 'sinon';

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
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

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

    it('should call setEditCellValue with debounce', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('textbox');
      expect(input.value).to.equal('Nike');

      await user.type(input, '[Backspace>4]Puma');

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 'Puma',
        debounceMs: 200,
        unstable_skipValueParser: true,
      });
    });

    it('should pass the value prop to the input', async () => {
      defaultData.columns[0].valueParser = (value) => (value as string).toUpperCase();
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('textbox');
      expect(input.value).to.equal('Nike');

      await user.type(input, '[Backspace>4]Puma');
      expect(input.value).to.equal('PUMA');
    });

    describe('with fake timers', () => {
      it('should display a indicator while processing the props', async () => {
        defaultData.columns[0].preProcessEditCellProps = ({ props }) =>
          new Promise((resolve) => {
            setTimeout(() => resolve(props), 500);
          });
        const { user } = render(<TestCase />);

        const cell = getCell(0, 0);
        await user.dblClick(cell);

        const input = within(cell).getByRole<HTMLInputElement>('textbox');
        expect(input.value).to.equal('Nike');

        expect(screen.queryByTestId('LoadIcon')).to.equal(null);
        await user.type(input, '[Backspace>4]Puma');

        await act(async () => {
          await sleep(200);
        });
        expect(screen.queryByTestId('LoadIcon')).not.to.equal(null);

        await act(async () => {
          await sleep(500);
        });

        expect(screen.queryByTestId('LoadIcon')).to.equal(null);
      });
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditInputCell({ ...params, onValueChange });

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('textbox');
      await user.type(input, '[Backspace>4]Puma');

      expect(onValueChange.callCount).to.equal(8);
      expect(onValueChange.lastCall.args[1]).to.equal('Puma');
    });
  });

  describe('column type: number', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, quantity: 100 }];
      defaultData.columns = [{ field: 'quantity', type: 'number', editable: true }];
    });

    it('should call setEditCellValue with debounce', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('spinbutton');
      expect(input.value).to.equal('100');

      await user.type(input, '[Backspace>2]10');
      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'quantity',
        value: 110,
        debounceMs: 200,
        unstable_skipValueParser: true,
      });
    });

    it('should the value prop to the input', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('spinbutton');
      expect(input.value).to.equal('100');

      await user.type(input, '[Backspace>2]10');
      expect(input.value).to.equal('110');
    });

    it('should keep values as numbers', async () => {
      const preProcessEditCellPropsSpy = spy(({ props }) => props);
      defaultData.columns[0].preProcessEditCellProps = preProcessEditCellPropsSpy;
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('spinbutton');
      expect(input.value).to.equal('100');

      await user.type(input, '[Backspace>2]10');
      await waitFor(() =>
        expect(preProcessEditCellPropsSpy.lastCall.args[0].props.value).to.equal(110),
      );
    });

    describe('with fake timers', () => {
      it('should display a indicator while processing the props', async () => {
        defaultData.columns[0].preProcessEditCellProps = ({ props }) =>
          new Promise((resolve) => {
            setTimeout(() => resolve(props), 500);
          });
        const { user } = render(<TestCase />);

        const cell = getCell(0, 0);
        await user.dblClick(cell);

        const input = within(cell).getByRole<HTMLInputElement>('spinbutton');
        expect(input.value).to.equal('100');

        expect(screen.queryByTestId('LoadIcon')).to.equal(null);
        await user.type(input, '110');
        await act(async () => {
          await sleep(200);
        });
        expect(screen.queryByTestId('LoadIcon')).not.to.equal(null);

        await act(async () => {
          await sleep(500);
        });

        expect(screen.queryByTestId('LoadIcon')).to.equal(null);
      });
    });
  });

  describe('column type: date', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, createdAt: new Date(2022, 1, 18) }];
      defaultData.columns = [{ field: 'createdAt', type: 'date', editable: true }];
    });

    it('should call setEditCellValue with the value converted to Date', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18');

      await user.type(input, '2022-02-10', {
        initialSelectionStart: 0,
        initialSelectionEnd: Infinity,
      });

      expect(spiedSetEditCellValue.lastCall.args[0].id).to.equal(0);
      expect(spiedSetEditCellValue.lastCall.args[0].field).to.equal('createdAt');
      expect(spiedSetEditCellValue.lastCall.args[0].debounceMs).to.equal(undefined);
      expect(spiedSetEditCellValue.lastCall.args[0].value?.toISOString()).to.equal(
        new Date(2022, 1, 10).toISOString(),
      );
    });

    it('should call setEditCellValue with null when entered an empty value', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      await user.type(input, '[Backspace]', {
        initialSelectionStart: 0,
        initialSelectionEnd: Infinity,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value).to.equal(null);
    });

    it('should pass the value prop to the input', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18');
      await act(async () => {
        apiRef.current?.setEditCellValue({
          id: 0,
          field: 'createdAt',
          value: new Date(2022, 1, 10),
        });
      });
      expect(input.value).to.equal('2022-02-10');
    });

    it('should handle correctly dates with partial years', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue') as SinonSpy<
        [GridEditCellValueParams & { value: Date }]
      >;

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18');

      // 2021-01-05T14:30
      await user.type(input, '2021-01-05', {
        initialSelectionStart: 0,
        initialSelectionEnd: 10,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(2021, 0, 5),
      );

      // 2021-01-01T14:30
      await user.type(input, '01', {
        initialSelectionStart: 8,
        initialSelectionEnd: 10,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(2021, 0, 1),
      );

      // 0001-01-01T14:30
      await user.type(input, '0001', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1, 0, 1),
      );

      // 0019-01-01T14:30
      await user.type(input, '0019', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(19, 0, 1),
      );

      // 0199-01-01T14:30
      await user.type(input, '0199', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(199, 0, 1),
      );

      // 1999-01-01T14:30
      await user.type(input, '1999', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1),
      );
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditDateCell({ ...params, onValueChange });

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      await user.type(input, '2022-02-10', {
        initialSelectionStart: 0,
        initialSelectionEnd: 10,
      });

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

    it('should call setEditCellValue with the value converted to Date', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18T14:30');

      await user.type(input, '2022-02-10T15:30:00', {
        initialSelectionStart: 0,
        initialSelectionEnd: 16,
      });

      expect(spiedSetEditCellValue.lastCall.args[0].id).to.equal(0);
      expect(spiedSetEditCellValue.lastCall.args[0].field).to.equal('createdAt');
      expect(spiedSetEditCellValue.lastCall.args[0].debounceMs).to.equal(undefined);
      expect((spiedSetEditCellValue.lastCall.args[0].value! as Date).toISOString()).to.equal(
        new Date(2022, 1, 10, 15, 30, 0).toISOString(),
      );
    });

    it('should call setEditCellValue with null when entered an empty value', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      await user.type(input, '[Backspace]');
      expect(spiedSetEditCellValue.lastCall.args[0].value).to.equal(null);
    });

    it('should pass the value prop to the input', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18T14:30');
      await act(async () => {
        apiRef.current?.setEditCellValue({
          id: 0,
          field: 'createdAt',
          value: new Date(2022, 1, 10, 15, 10, 0),
        });
      });
      expect(input.value).to.equal('2022-02-10T15:10');
    });

    it('should handle correctly dates with partial years', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue') as SinonSpy<
        [GridEditCellValueParams & { value: Date }]
      >;

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = cell.querySelector('input')!;
      expect(input.value).to.equal('2022-02-18T14:30');

      // 2021-01-05T14:30
      await user.type(input, '2021-01-05', {
        initialSelectionStart: 0,
        initialSelectionEnd: 10,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(2021, 0, 5, 14, 30),
      );

      // 2021-01-01T14:30
      await user.type(input, '01', {
        initialSelectionStart: 8,
        initialSelectionEnd: 10,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(2021, 0, 1, 14, 30),
      );

      // 0001-01-01T14:30
      await user.type(input, '0001', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1, 0, 1, 14, 30),
      );

      // 0019-01-01T14:30
      await user.type(input, '0019', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(19, 0, 1, 14, 30),
      );

      // 0199-01-01T14:30
      await user.type(input, '0199', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(199, 0, 1, 14, 30),
      );

      // 1999-01-01T14:30
      await user.type(input, '1999', {
        initialSelectionStart: 0,
        initialSelectionEnd: 4,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 14, 30),
      );

      // 1999-01-01T20:30
      await user.type(input, '20:30', {
        initialSelectionStart: 11,
        initialSelectionEnd: 16,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 30),
      );

      // 1999-01-01T20:02
      await user.type(input, '02', {
        initialSelectionStart: 14,
        initialSelectionEnd: 16,
      });
      expect(spiedSetEditCellValue.lastCall.args[0].value.getTime()).to.equal(
        generateDate(1999, 0, 1, 20, 2),
      );

      // 1999-01-01T20:25
      await user.type(input, '25', {
        initialSelectionStart: 14,
        initialSelectionEnd: 16,
      });
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

    it('should call setEditCellValue with the correct value when valueOptions is an array of strings', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);
      await user.click(screen.queryAllByRole('option')[1]);

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 'Adidas',
      });
    });

    it('should call setEditCellValue with the correct value when valueOptions is an array of objects', async () => {
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
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);
      await user.click(screen.queryAllByRole('option')[1]);

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 1,
      });
    });

    it('should call setEditCellValue with the correct value when valueOptions is a function', async () => {
      defaultData.columns = [
        {
          field: 'brand',
          type: 'singleSelect',
          valueOptions: () => ['Nike', 'Adidas'],
          editable: true,
        },
      ];
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);
      await user.click(screen.queryAllByRole('option')[1]);

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'brand',
        value: 'Adidas',
      });
    });

    it('should pass the value prop to the select', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      expect(cell.textContent!.replace(/[\W]+/, '')).to.equal('Nike'); // We use .replace to remove &ZeroWidthSpace;
      await act(async () => {
        apiRef.current?.setEditCellValue({ id: 0, field: 'brand', value: 'Adidas' });
      });
      expect(cell.textContent!.replace(/[\W]+/, '')).to.equal('Adidas');
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditSingleSelectCell({ ...params, onValueChange });

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);
      await user.click(screen.queryAllByRole('option')[1]);

      expect(onValueChange.callCount).to.equal(1);
      expect(onValueChange.lastCall.args[1]).to.equal('Adidas');
    });

    it('should call onCellEditStop', async () => {
      const onCellEditStop = spy();

      const { user } = render(
        <div>
          <TestCase onCellEditStop={onCellEditStop} />
          <div id="outside-grid" />
        </div>,
      );

      const cell = getCell(0, 0);
      await user.dblClick(cell);
      await user.click(document.getElementById('outside-grid')!);

      expect(onCellEditStop.callCount).to.equal(1);
    });

    it('should not open the suggestions when Enter is pressed', async () => {
      defaultData.columns[0].renderEditCell = (params) => renderEditSingleSelectCell(params);

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);
      await user.click(screen.queryAllByRole('option')[1]);
      expect(screen.queryByRole('listbox')).to.equal(null);
      await act(async () => {
        screen.getByRole('combobox').focus();
      });
      await user.keyboard('{Enter}');
      expect(screen.queryByRole('listbox')).to.equal(null);
    });
  });

  describe('column type: boolean', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, isAdmin: false }];
      defaultData.columns = [{ field: 'isAdmin', type: 'boolean', editable: true }];
    });

    it('should call setEditCellValue', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('checkbox');
      expect(input.checked).to.equal(false);

      await user.click(input);
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

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const input = within(cell).getByRole<HTMLInputElement>('checkbox');
      await user.click(input);

      expect(onValueChange.callCount).to.equal(1);
      expect(onValueChange.lastCall.args[1]).to.equal(true);
    });
  });

  // multiSelect tests require browser environment for chip rendering and column defaults
  describe('column type: multiSelect', () => {
    const valueOptions = ['Option 1', 'Option 2', 'Option 3'];

    beforeEach(() => {
      defaultData.rows = [{ id: 0, tags: ['Option 1'] }];
      defaultData.columns = [
        {
          field: 'tags',
          type: 'multiSelect',
          editable: true,
          valueOptions,
        },
      ];
    });

    it('should render autocomplete on edit mode', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      expect(listbox).not.to.equal(null);
    });

    it('should display all options', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const options = within(listbox).getAllByRole('option');
      expect(options).to.have.length(3);
      expect(options[0]).to.have.text('Option 1');
      expect(options[1]).to.have.text('Option 2');
      expect(options[2]).to.have.text('Option 3');
    });

    it('should call setEditCellValue with array when selecting option', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const option2 = within(listbox).getByRole('option', { name: 'Option 2' });
      await user.click(option2);

      expect(spiedSetEditCellValue.lastCall.args[0].value).to.deep.equal(['Option 1', 'Option 2']);
    });

    it('should not close dropdown after selecting option (disableCloseOnSelect)', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const option2 = within(listbox).getByRole('option', { name: 'Option 2' });
      await user.click(option2);

      // Listbox should still be visible
      expect(screen.queryByRole('listbox')).not.to.equal(null);
    });

    it('should cancel editing on Escape', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      expect(cell).to.have.class('MuiDataGrid-cell--editing');

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
      });
    });

    it('should work with object value options', async () => {
      defaultData.columns = [
        {
          field: 'tags',
          type: 'multiSelect',
          editable: true,
          valueOptions: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ],
        },
      ];
      defaultData.rows = [{ id: 0, tags: [1] }];

      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const optionTwo = within(listbox).getByRole('option', { name: 'Two' });
      await user.click(optionTwo);

      expect(spiedSetEditCellValue.lastCall.args[0].value).to.deep.equal([1, 2]);
    });

    it('should work with dynamic valueOptions function', async () => {
      const getValueOptions = spy(() => ['Dynamic 1', 'Dynamic 2']);

      defaultData.columns = [
        {
          field: 'tags',
          type: 'multiSelect',
          editable: true,
          valueOptions: getValueOptions,
        },
      ];
      defaultData.rows = [{ id: 0, tags: ['Dynamic 1'] }];

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const options = within(listbox).getAllByRole('option');
      expect(options).to.have.length(2);
      expect(options[0]).to.have.text('Dynamic 1');
      expect(options[1]).to.have.text('Dynamic 2');
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditMultiSelectCell({ ...params, onValueChange });

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const option2 = within(listbox).getByRole('option', { name: 'Option 2' });
      await user.click(option2);

      expect(onValueChange.callCount).to.be.greaterThan(0);
      expect(onValueChange.lastCall.args[1]).to.deep.equal(['Option 1', 'Option 2']);
    });

    it('should deselect option when clicking selected option', async () => {
      defaultData.rows = [{ id: 0, tags: ['Option 1', 'Option 2'] }];

      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await user.dblClick(cell);

      const listbox = await screen.findByRole('listbox');
      const option1 = within(listbox).getByRole('option', { name: 'Option 1' });
      await user.click(option1);

      expect(spiedSetEditCellValue.lastCall.args[0].value).to.deep.equal(['Option 2']);
    });

    describe('slotProps.chip as function', () => {
      it('should pass string option to chip function for string valueOptions in view mode', () => {
        const chipFn = spy(() => ({ color: 'primary' as const }));

        defaultData.rows = [{ id: 0, tags: ['Option 1', 'Option 2'] }];
        defaultData.columns = [
          {
            field: 'tags',
            type: 'multiSelect',
            valueOptions,
            renderCell: (params) => (
              <GridMultiSelectCell
                {...(params as GridMultiSelectCellProps)}
                slotProps={{ chip: chipFn }}
              />
            ),
          },
        ];

        render(<TestCase />);

        // callCount may be >2 due to measurement renders
        expect(chipFn.callCount).to.be.greaterThanOrEqual(2);
        // For string options, the value option IS the string itself
        const calls = chipFn.getCalls();
        const args = calls.map((c: any) => c.args);
        expect(args).to.deep.include(['Option 1', 0]);
        expect(args).to.deep.include(['Option 2', 1]);
      });

      it('should pass resolved option object to chip function for object valueOptions in view mode', () => {
        const objectOptions = [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ];
        const chipFn = spy(() => ({}));

        defaultData.rows = [{ id: 0, tags: [1, 3] }];
        defaultData.columns = [
          {
            field: 'tags',
            type: 'multiSelect',
            valueOptions: objectOptions,
            renderCell: (params) => (
              <GridMultiSelectCell
                {...(params as GridMultiSelectCellProps)}
                slotProps={{ chip: chipFn }}
              />
            ),
          },
        ];

        render(<TestCase />);

        expect(chipFn.callCount).to.be.greaterThanOrEqual(2);
        const calls = chipFn.getCalls();
        const firstArgs = calls.map((c: any) => c.args[0]);
        expect(firstArgs).to.deep.include({ value: 1, label: 'One' });
        expect(firstArgs).to.deep.include({ value: 3, label: 'Three' });
      });

      it('should pass resolved option object to chip function for object valueOptions in edit mode', async () => {
        const objectOptions = [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ];
        const chipFn = spy(() => ({}));

        defaultData.rows = [{ id: 0, tags: [1, 2] }];
        defaultData.columns = [
          {
            field: 'tags',
            type: 'multiSelect',
            editable: true,
            valueOptions: objectOptions,
            renderEditCell: (params) => (
              <GridEditMultiSelectCell
                {...(params as GridEditMultiSelectCellProps)}
                slotProps={{ chip: chipFn }}
              />
            ),
          },
        ];

        const { user } = render(<TestCase />);

        const cell = getCell(0, 0);
        await user.dblClick(cell);

        expect(chipFn.callCount).to.be.greaterThanOrEqual(2);
        const calls = chipFn.getCalls();
        const firstArgs = calls.map((c: any) => c.args[0]);
        expect(firstArgs).to.deep.include({ value: 1, label: 'One' });
        expect(firstArgs).to.deep.include({ value: 2, label: 'Two' });
      });
    });
  });
});
