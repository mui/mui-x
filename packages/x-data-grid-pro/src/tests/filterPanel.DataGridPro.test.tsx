import { type RefObject } from '@mui/x-internals/types';
import {
  DataGridPro,
  type DataGridProProps,
  gridFilterModelSelector,
  type GridApi,
  useGridApiRef,
  GridPreferencePanelsValue,
} from '@mui/x-data-grid-pro';
import { createRenderer, act, screen, within } from '@mui/internal-test-utils';
import { getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Filter panel', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridProProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: [],
    columns: [{ field: 'brand' }],
  };

  let apiRef: RefObject<GridApi | null>;

  function TestCase(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  }

  it('should add an id and `operator` to the filter item created when opening the filter panel', () => {
    render(<TestCase />);
    act(() => apiRef.current?.showFilterPanel('brand'));
    const model = gridFilterModelSelector(apiRef);
    expect(model.items).to.have.length(1);
    expect(model.items[0].id).not.to.equal(null);
    expect(model.items[0].operator).not.to.equal(null);
  });

  describe('multiSelect columns', () => {
    const multiSelectBaselineProps: Partial<DataGridProProps> = {
      rows: [
        { id: 1, tags: ['React', 'TypeScript'] },
        { id: 2, tags: ['Vue', 'JavaScript'] },
        { id: 3, tags: ['React', 'JavaScript'] },
        { id: 4, tags: [] },
      ],
      columns: [
        {
          field: 'tags',
          type: 'multiSelect',
          valueOptions: ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript'],
        },
      ],
    };

    it('should show dropdown for "contains" operator', async () => {
      const { user } = render(
        <TestCase
          {...multiSelectBaselineProps}
          initialState={{
            preferencePanel: {
              open: true,
              openedPanelValue: GridPreferencePanelsValue.filters,
            },
            filter: {
              filterModel: {
                items: [{ field: 'tags', operator: 'contains' }],
              },
            },
          }}
        />,
      );

      const filterValueCombobox = screen.getByRole('combobox', { name: 'Value' });
      await user.click(filterValueCombobox);

      const listbox = screen.getByRole('listbox');
      const options = within(listbox).getAllByRole('option');
      // 5 options + 1 empty option
      expect(options).to.have.length(6);
    });

    it('should filter correctly with "isEmpty" operator', () => {
      render(
        <TestCase
          {...multiSelectBaselineProps}
          filterModel={{
            items: [{ field: 'tags', operator: 'isEmpty' }],
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['']);
    });
  });
});
