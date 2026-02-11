import { type RefObject } from '@mui/x-internals/types';
import {
  type GridApi,
  type DataGridProps,
  useGridApiRef,
  DataGrid,
  renderEditLongTextCell,
  renderEditMultiSelectCell,
} from '@mui/x-data-grid';
import { createRenderer, screen, within, waitFor } from '@mui/internal-test-utils';
import { getCell, openLongTextEditPopup, spyApi } from 'test/utils/helperFn';
import { spy } from 'sinon';

describe('<DataGrid /> - Edit components', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const defaultData: Pick<DataGridProps, 'rows' | 'columns'> = { columns: [], rows: [] };

  function TestCase(props: Partial<DataGridProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid apiRef={apiRef} {...defaultData} {...props} />
      </div>
    );
  }

  describe('column type: longText', () => {
    beforeEach(() => {
      defaultData.rows = [{ id: 0, bio: 'This is a long text\nwith multiple lines' }];
      defaultData.columns = [{ field: 'bio', type: 'longText', editable: true }];
    });

    it('should render textarea in popup on edit mode', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      expect(textarea.tagName).to.equal('TEXTAREA');
      expect(textarea.value).to.equal('This is a long text\nwith multiple lines');
    });

    it('should call setEditCellValue with debounce', async () => {
      const { user } = render(<TestCase />);
      const spiedSetEditCellValue = spyApi(apiRef.current!, 'setEditCellValue');

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New text');

      expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
        id: 0,
        field: 'bio',
        value: 'New text',
        debounceMs: 200,
        unstable_skipValueParser: true,
      });
    });

    it('should pass the value prop to the textarea', async () => {
      defaultData.columns[0].valueParser = (value) => (value as string).toUpperCase();
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'hello');
      expect(textarea.value).to.equal('HELLO');
    });

    it('should insert newline on Shift+Enter', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

      expect(textarea.value).to.equal('Line 1\nLine 2');
      // Should still be in edit mode
      expect(cell).to.have.class('MuiDataGrid-cell--editing');
    });

    it('should cancel editing on Escape', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      expect(cell).to.have.class('MuiDataGrid-cell--editing');

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      await user.type(textarea, '{Escape}');

      expect(cell).not.to.have.class('MuiDataGrid-cell--editing');
    });

    it('should call onValueChange if defined', async () => {
      const onValueChange = spy();

      defaultData.columns[0].renderEditCell = (params) =>
        renderEditLongTextCell({ ...params, onValueChange });

      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      await user.clear(textarea);
      await user.type(textarea, 'New');

      expect(onValueChange.callCount).to.be.greaterThan(0);
      expect(onValueChange.lastCall.args[1]).to.equal('New');
    });

    it('should focus textarea when edit mode starts', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
      expect(document.activeElement).to.equal(textarea);
    });

    it('should render popup with role="dialog"', async () => {
      const { user } = render(<TestCase />);

      const cell = getCell(0, 0);
      await openLongTextEditPopup(cell, user);

      const popup = screen.getByRole('dialog');
      expect(popup).not.to.equal(null);
      expect(popup).to.have.attribute('aria-label', 'bio');
    });
  });

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
  });
});
