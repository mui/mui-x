import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';
describe('<DataGrid /> - Cell editable state', () => {
    const { render } = createRenderer();
    function expectCellEditable(rowIndex, colIndex) {
        expect(getCell(rowIndex, colIndex)).to.have.class(gridClasses['cell--editable']);
    }
    function expectCellNotEditable(rowIndex, colIndex) {
        expect(getCell(rowIndex, colIndex)).not.to.have.class(gridClasses['cell--editable']);
    }
    // based on https://github.com/mui/mui-x/issues/19732
    it('should update cell editable state when `isCellEditable` prop changes', async () => {
        const rows = [
            { id: 1, name: 'A', age: 20 },
            { id: 2, name: 'B', age: 21 },
        ];
        const columns = [
            { field: 'name', editable: true, width: 150 },
            { field: 'age', type: 'number', editable: true, width: 150 },
        ];
        function GridWithState() {
            const [editable, setEditable] = React.useState(true);
            const [editMode, setEditMode] = React.useState('cell');
            return (_jsxs("div", { style: { width: 400, height: 400 }, children: [_jsx("button", { onClick: () => setEditable((s) => !s), children: "toggle-editable" }), _jsx("button", { onClick: () => setEditMode((s) => (s === 'row' ? 'cell' : 'row')), children: "toggle-mode" }), _jsx(DataGrid, { rows: rows, columns: columns, editMode: editMode, isCellEditable: (params) => params.row.age % 2 === 0 && editable && editMode === 'cell' })] }));
        }
        const { user } = render(_jsx(GridWithState, {}));
        // Initially: editMode = 'cell', editable = true → row 0 cells editable
        expectCellEditable(0, 0);
        expectCellEditable(0, 1);
        expectCellNotEditable(1, 0);
        // Toggle editable → should remove editable class immediately
        await user.click(screen.getByRole('button', { name: 'toggle-editable' }));
        expectCellNotEditable(0, 0);
        expectCellNotEditable(0, 1);
        // Toggle mode to 'cell' again (it was set to false only) by switching mode away and back
        await user.click(screen.getByRole('button', { name: 'toggle-mode' }));
        // Now editMode = 'row' → should not be editable regardless of row parity
        expectCellNotEditable(0, 0);
        await user.click(screen.getByRole('button', { name: 'toggle-mode' }));
        // Back to 'cell' but editable state is false → still not editable
        expectCellNotEditable(0, 0);
    });
    // based on https://github.com/mui/mui-x/issues/20143
    it('should update cell editable state when `colDef.editable` changes', async () => {
        const rows = [{ id: 1, firstName: 'Jon', lastName: 'Snow', age: 14 }];
        function Component() {
            const [isEditable, setIsEditable] = React.useState(true);
            const cols = [
                { field: 'id', width: 100 },
                { field: 'firstName', width: 150, editable: isEditable },
                { field: 'lastName', width: 150, editable: true },
            ];
            return (_jsxs("div", { style: { width: 500, height: 400 }, children: [_jsx("button", { onClick: () => setIsEditable((p) => !p), children: "toggle-coldef" }), _jsx(DataGrid, { rows: rows, columns: cols, isCellEditable: () => true })] }));
        }
        const { user } = render(_jsx(Component, {}));
        // firstName column is editable initially
        expectCellEditable(0, 1);
        // Toggle colDef.editable to false → class should be removed immediately
        await user.click(screen.getByRole('button', { name: 'toggle-coldef' }));
        expectCellNotEditable(0, 1);
    });
});
