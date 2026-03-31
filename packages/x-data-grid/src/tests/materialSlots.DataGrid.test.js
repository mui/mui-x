import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGrid, } from '@mui/x-data-grid';
describe('<DataGrid /> - Material Slots', () => {
    const { render } = createRenderer();
    const baselineProps = {
        rows: [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
        ],
        columns: [{ field: 'brand' }],
    };
    function TestDataGrid(props) {
        return (_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, ...props }) }));
    }
    const filterModelEmpty = {
        items: [{ field: 'brand', operator: 'contains' }],
    };
    describe('BaseTextField', () => {
        it('should forward slotProps.htmlInput to the native input', () => {
            render(_jsx(TestDataGrid, { filterModel: filterModelEmpty, slotProps: {
                    panel: { open: true },
                    baseTextField: {
                        slotProps: {
                            htmlInput: { 'data-testid': 'html-input-from-slotProps' },
                        },
                    },
                } }));
            expect(screen.getByTestId('html-input-from-slotProps')).not.to.equal(null);
        });
        it('should forward slotProps.input to the Input component', () => {
            render(_jsx(TestDataGrid, { filterModel: filterModelEmpty, slotProps: {
                    panel: { open: true },
                    baseTextField: {
                        slotProps: {
                            input: { className: 'custom-input-class' },
                        },
                    },
                } }));
            const input = document.querySelector('.custom-input-class');
            expect(input).not.to.equal(null);
        });
        it('should forward material prop to MUITextField', () => {
            render(_jsx(TestDataGrid, { filterModel: filterModelEmpty, slotProps: {
                    panel: { open: true },
                    baseTextField: {
                        material: { 'data-testid': 'material-textfield' },
                    },
                } }));
            expect(screen.getByTestId('material-textfield')).not.to.equal(null);
        });
        it('material should not override slotProps', () => {
            render(_jsx(TestDataGrid, { filterModel: filterModelEmpty, slotProps: {
                    panel: { open: true },
                    baseTextField: {
                        slotProps: { htmlInput: { 'data-testid': 'from-slotProps' } },
                        material: {
                            inputProps: { 'data-testid': 'from-material' },
                        },
                    },
                } }));
            expect(screen.getByTestId('from-slotProps')).not.to.equal(null);
        });
    });
    describe('BaseAutocomplete', () => {
        const multiSelectColumns = [
            {
                field: 'brand',
                type: 'singleSelect',
                valueOptions: ['Nike', 'Adidas', 'Puma'],
            },
        ];
        const multiSelectFilterModel = {
            items: [{ field: 'brand', operator: 'isAnyOf' }],
        };
        it('rootProps.slotProps.baseTextField should apply to Autocomplete inner TextField', () => {
            render(_jsx(TestDataGrid, { columns: multiSelectColumns, filterModel: multiSelectFilterModel, slotProps: {
                    panel: { open: true },
                    baseTextField: { 'data-testid': 'base-textfield-override' },
                } }));
            expect(screen.getByTestId('base-textfield-override')).not.to.equal(null);
        });
        it('rootProps.slotProps.baseTextField.slotProps should apply to Autocomplete inner TextField', () => {
            render(_jsx(TestDataGrid, { columns: multiSelectColumns, filterModel: multiSelectFilterModel, slotProps: {
                    panel: { open: true },
                    baseTextField: {
                        slotProps: {
                            htmlInput: { 'data-testid': 'ac-html-input' },
                            input: { className: 'ac-custom-input' },
                            inputLabel: { className: 'ac-custom-input-label' },
                        },
                    },
                } }));
            expect(screen.getByTestId('ac-html-input')).not.to.equal(null);
            expect(document.querySelector('.ac-custom-input')).not.to.equal(null);
            expect(document.querySelector('.ac-custom-input-label')).not.to.equal(null);
        });
    });
});
