import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
describe('<DataGrid /> - rowCheckbox slot', () => {
    const { render } = createRenderer();
    const columns = [{ field: 'name', width: 150 }];
    const rows = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
    ];
    it('should allow to override the rowCheckbox slot', () => {
        function CustomRowCheckbox(props) {
            return _jsx("div", { "data-testid": "custom-row-checkbox", children: props.rowId });
        }
        render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { rows: rows, columns: columns, checkboxSelection: true, slots: {
                    rowCheckbox: CustomRowCheckbox,
                } }) }));
        const customCheckboxes = screen.getAllByTestId('custom-row-checkbox');
        expect(customCheckboxes).to.have.length(2);
        expect(customCheckboxes[0].textContent).to.equal('1');
        expect(customCheckboxes[1].textContent).to.equal('2');
    });
    it('should pass other props correctly to the rowCheckbox slot', () => {
        let passedProps;
        function CustomRowCheckbox(props) {
            passedProps = props;
            return _jsx("div", { "data-testid": "custom-row-checkbox" });
        }
        render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { rows: [{ id: 1, name: 'John' }], columns: columns, checkboxSelection: true, slots: {
                    rowCheckbox: CustomRowCheckbox,
                }, slotProps: {
                    rowCheckbox: {
                        'data-foo': 'bar',
                    },
                } }) }));
        expect(passedProps).to.have.property('data-foo', 'bar');
        expect(passedProps).to.have.property('checked');
        expect(passedProps).to.have.property('onChange');
    });
    it('should pass material props correctly to the rowCheckbox slot', () => {
        let passedProps;
        function CustomRowCheckbox(props) {
            passedProps = props;
            return _jsx("div", { "data-testid": "custom-row-checkbox" });
        }
        render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { rows: [{ id: 1, name: 'John' }], columns: [{ field: 'name' }], checkboxSelection: true, slots: {
                    rowCheckbox: CustomRowCheckbox,
                }, slotProps: {
                    rowCheckbox: {
                        material: { color: 'primary' },
                    },
                } }) }));
        expect(passedProps.material).to.have.property('color', 'primary');
    });
    it('should pass material props down to the baseCheckbox through the default rowCheckbox', () => {
        let passedProps;
        function CustomBaseCheckbox(props) {
            passedProps = props;
            return _jsx("div", { "data-testid": "custom-base-checkbox" });
        }
        render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { rows: [{ id: 1, name: 'John' }], columns: [{ field: 'name' }], checkboxSelection: true, slots: {
                    baseCheckbox: CustomBaseCheckbox,
                }, slotProps: {
                    rowCheckbox: {
                        material: { color: 'primary' },
                    },
                } }) }));
        expect(passedProps.material).to.have.property('color', 'primary');
        expect(passedProps.material).to.have.property('disableRipple');
    });
});
