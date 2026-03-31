import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createRenderer, ErrorBoundary, fireEvent, reactMajor, screen, } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { getCell, getRow, openLongTextViewPopup } from 'test/utils/helperFn';
describe('<DataGrid /> - Slots', () => {
    const { render } = createRenderer();
    const baselineProps = {
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
        columns: [{ field: 'brand' }],
    };
    describe('footer', () => {
        it('should hide footer if prop hideFooter is set', () => {
            render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true }) }));
            expect(document.querySelectorAll('.MuiDataGrid-footerContainer').length).to.equal(0);
        });
        it('should hide custom footer if prop hideFooter is set', () => {
            function CustomFooter() {
                return _jsx("div", { className: "customFooter", children: "Custom Footer" });
            }
            render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true, slots: { footer: CustomFooter } }) }));
            expect(document.querySelectorAll('.customFooter').length).to.equal(0);
        });
    });
    describe('slotProps', () => {
        it('should pass the props from slotProps.cell to the cell', () => {
            render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true, disableVirtualization: true, slotProps: { cell: { 'data-name': 'foobar' } } }) }));
            expect(getCell(0, 0)).to.have.attr('data-name', 'foobar');
        });
        it('should not override cell dimensions when passing `slotProps.cell.style` to the cell', () => {
            function Test(props) {
                return (_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, ...props }) }));
            }
            const { setProps } = render(_jsx(Test, { slotProps: { cell: {} } }));
            const initialCellWidth = getCell(0, 0).getBoundingClientRect().width;
            setProps({ slotProps: { cell: { style: { backgroundColor: 'red' } } } });
            const cell = getCell(0, 0);
            expect(cell).toHaveInlineStyle({ backgroundColor: 'red' });
            expect(cell.getBoundingClientRect().width).to.equal(initialCellWidth);
        });
        it('should pass the props from slotProps.row to the row', () => {
            render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true, disableVirtualization: true, slotProps: { row: { 'data-name': 'foobar' } } }) }));
            expect(getRow(0)).to.have.attr('data-name', 'foobar');
        });
        it('should pass the props from slotProps.columnHeaderFilterIconButton to the column header filter icon', async () => {
            const onClick = spy();
            const { user } = render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true, filterModel: {
                        items: [{ field: 'brand', operator: 'contains', value: 'a' }],
                    }, disableVirtualization: true, slotProps: { columnHeaderFilterIconButton: { onClick } } }) }));
            expect(onClick.callCount).to.equal(0);
            const button = screen.getByLabelText('Show filters');
            await user.click(button);
            expect(onClick.lastCall.args[0]).to.have.property('field', 'brand');
            expect(onClick.lastCall.args[1]).to.have.property('target', button);
        });
    });
    describe('slots', () => {
        it('should render the cell with the component given in slots.Cell', () => {
            render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true, disableVirtualization: true, slots: {
                        cell: ({ colIndex }) => _jsx("span", { role: "gridcell", "data-colindex": colIndex }),
                    } }) }));
            expect(getCell(0, 0).tagName).to.equal('SPAN');
        });
        it('should render the row with the component given in slots.Row', () => {
            render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true, disableVirtualization: true, slots: { row: ({ index }) => _jsx("span", { role: "row", "data-rowindex": index }) } }) }));
            expect(getRow(0).tagName).to.equal('SPAN');
        });
    });
    it('should throw if a component is used without providing the context', () => {
        expect(() => {
            render(_jsx(ErrorBoundary, { children: _jsx(GridOverlay, {}) }));
        }).toErrorDev([
            reactMajor >= 19 &&
                'MUI X Data Grid: useGridRootProps should only be used inside a Data Grid component. The component must be a child of DataGrid, DataGridPro, or DataGridPremium. Ensure your component is properly nested within a Data Grid.',
            reactMajor < 19 && 'The above error occurred in the <ForwardRef(GridOverlay2)> component',
        ]);
    });
    // If an infinite loop occurs, this test won't trigger the timeout.
    // Instead, it will be hanging and block other tests.
    // See https://github.com/mochajs/mocha/issues/1609
    it('should not cause an infinite loop with two instances in the same page', () => {
        expect(() => {
            render(_jsxs("div", { children: [_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true }) }), _jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, hideFooter: true }) })] }));
        }).not.toErrorDev();
    });
    describe('column type: longText', () => {
        const longTextProps = {
            rows: [{ id: 0, bio: 'Long text content' }],
            columns: [{ field: 'bio', type: 'longText' }],
        };
        it('should render custom longTextCellExpandIcon slot', async () => {
            function CustomExpandIcon() {
                return _jsx("span", { "data-testid": "custom-expand-icon", children: "+" });
            }
            const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...longTextProps, slots: { longTextCellExpandIcon: CustomExpandIcon } }) }));
            const cell = getCell(0, 0);
            await user.click(cell);
            expect(screen.getByTestId('custom-expand-icon')).not.to.equal(null);
        });
        describe('popup', () => {
            it('should render custom longTextCellCollapseIcon slot', async () => {
                function CustomCollapseIcon() {
                    return _jsx("span", { "data-testid": "custom-collapse-icon", children: "-" });
                }
                const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...longTextProps, slots: { longTextCellCollapseIcon: CustomCollapseIcon } }) }));
                const cell = getCell(0, 0);
                await openLongTextViewPopup(cell, user, 'spacebar');
                expect(screen.getByTestId('custom-collapse-icon')).not.to.equal(null);
            });
            it('should use locale text for button labels', async () => {
                const { user } = render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...longTextProps, localeText: {
                            longTextCellExpandLabel: 'Custom Expand',
                            longTextCellCollapseLabel: 'Custom Collapse',
                        } }) }));
                const cell = getCell(0, 0);
                await user.click(cell);
                const expandButton = cell.querySelector('button[aria-haspopup="dialog"]');
                expect(expandButton.getAttribute('aria-label')).to.include('Custom Expand');
                fireEvent.keyDown(expandButton, { key: ' ' });
                const popup = document.querySelector('.MuiDataGrid-longTextCellPopup');
                const collapseButton = popup.querySelector('button');
                expect(collapseButton).to.have.attribute('aria-label', 'Custom Collapse');
            });
        });
    });
});
