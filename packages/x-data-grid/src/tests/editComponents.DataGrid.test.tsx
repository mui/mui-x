import { RefObject } from '@mui/x-internals/types';
import {
  GridApi,
  DataGridProps,
  useGridApiRef,
  DataGrid,
  renderEditLongTextCell,
} from '@mui/x-data-grid';
import { createRenderer, screen } from '@mui/internal-test-utils';
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
});
