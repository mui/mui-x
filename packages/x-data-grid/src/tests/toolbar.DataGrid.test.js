import { jsx as _jsx } from "react/jsx-runtime";
import { createRenderer, screen, act } from '@mui/internal-test-utils';
import { getColumnHeadersTextContent } from 'test/utils/helperFn';
import { DataGrid, Toolbar, ToolbarButton, } from '@mui/x-data-grid';
import { isJSDOM } from 'test/utils/skipIf';
function CustomToolbar({ items = ['Item 1', 'Item 2', 'Item 3'] }) {
    return (_jsx(Toolbar, { children: items.map((item) => (_jsx(ToolbarButton, { children: item }, item))) }));
}
describe('<DataGrid /> - Toolbar', () => {
    const { render } = createRenderer();
    const baselineProps = {
        autoHeight: isJSDOM,
        rows: [
            {
                id: 0,
                brand: 'Nike',
            },
            {
                id: 1,
                brand: 'Adidas',
            },
            {
                id: 2,
                brand: 'Puma',
            },
        ],
        columns: [
            {
                field: 'id',
            },
            {
                field: 'brand',
            },
        ],
    };
    describe('component', () => {
        it('should move focus to the next item when pressing ArrowRight', async () => {
            const { user } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
            expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
            await user.keyboard('{ArrowRight}');
            expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
            await user.keyboard('{ArrowRight}');
            expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
        });
        it('should move focus to the previous item when pressing ArrowLeft', async () => {
            const { user } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
            expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
            await user.keyboard('{ArrowLeft}');
            expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
            await user.keyboard('{ArrowLeft}');
            expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
        });
        it('should focus on the first item when pressing Home key', async () => {
            const { user } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
            await user.keyboard('{Home}');
            expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
        });
        it('should focus on the last item when pressing End key', async () => {
            const { user } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
            await user.keyboard('{End}');
            expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
        });
        it('should wrap to first item when pressing ArrowRight on last item', async () => {
            const { user } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
            await user.keyboard('{ArrowRight}');
            expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
        });
        it('should wrap to last item when pressing ArrowLeft on first item', async () => {
            const { user } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
            await user.keyboard('{ArrowLeft}');
            expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
        });
        it('should maintain focus position when an item is removed', async () => {
            const { setProps } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 2' }).focus());
            await act(async () => {
                setProps({
                    slotProps: {
                        toolbar: { items: ['Item 1', 'Item 3'] },
                    },
                });
            });
            expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
        });
        it('should maintain focus on the last item when the last item is removed', async () => {
            const { setProps } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 3' }).focus());
            await act(async () => {
                setProps({
                    slotProps: {
                        toolbar: { items: ['Item 1', 'Item 2'] },
                    },
                });
            });
            expect(screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
        });
        it('should preserve arrow key navigation after item removal', async () => {
            const { user, setProps } = render(_jsx(DataGrid, { ...baselineProps, slots: { toolbar: CustomToolbar }, showToolbar: true }));
            await act(async () => screen.getByRole('button', { name: 'Item 1' }).focus());
            await act(async () => {
                setProps({
                    slotProps: {
                        toolbar: { items: ['Item 1', 'Item 3'] },
                    },
                });
            });
            await user.keyboard('{ArrowRight}');
            expect(screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
            await user.keyboard('{ArrowLeft}');
            expect(screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
        });
    });
    describe('column selector', () => {
        it('should hide "id" column when hiding it from the column selector', async () => {
            const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, showToolbar: true }) }));
            expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
            await user.click(screen.getByLabelText('Columns'));
            await user.click(document.querySelector('[role="tooltip"] [name="id"]'));
            expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
        });
        it('should show and hide all columns when clicking "Show/Hide All" checkbox from the column selector', async () => {
            const customColumns = [
                {
                    field: 'id',
                },
                {
                    field: 'brand',
                },
            ];
            const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, columns: customColumns, showToolbar: true, initialState: {
                        columns: {
                            columnVisibilityModel: { id: false, brand: false },
                        },
                    } }) }));
            await user.click(screen.getByLabelText('Columns'));
            const showHideAllCheckbox = screen.getByRole('checkbox', { name: 'Show/Hide All' });
            await user.click(showHideAllCheckbox);
            expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
            await user.click(showHideAllCheckbox);
            expect(getColumnHeadersTextContent()).to.deep.equal([]);
        });
        it('should keep the focus on the switch after toggling a column', async () => {
            const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, showToolbar: true }) }));
            const button = screen.getByRole('button', { name: 'Columns' });
            await user.click(button);
            const column = document.querySelector('[role="tooltip"] [name="id"]');
            await user.click(column);
            expect(column).toHaveFocus();
        });
        it('should allow to override search predicate function', async () => {
            const customColumns = [
                {
                    field: 'id',
                    description: 'test',
                },
                {
                    field: 'brand',
                },
            ];
            const columnSearchPredicate = (column, searchValue) => {
                return ((column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1 ||
                    (column.description || '').toLowerCase().indexOf(searchValue) > -1);
            };
            const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, columns: customColumns, showToolbar: true, slotProps: {
                        columnsManagement: {
                            searchPredicate: columnSearchPredicate,
                        },
                    } }) }));
            await user.click(screen.getByLabelText('Columns'));
            const searchInput = document.querySelector('input[type="search"]');
            await user.type(searchInput, 'test');
            expect(document.querySelector('[role="tooltip"] [name="id"]')).not.to.equal(null);
        });
    });
});
