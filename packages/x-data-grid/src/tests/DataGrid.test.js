import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGrid, DATA_GRID_PROPS_DEFAULT_VALUES } from '@mui/x-data-grid';
const isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGrid />', () => {
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
    };
    it('should accept aria & data attributes props using `slotProps`', () => {
        const rootRef = React.createRef();
        render(_jsx("div", { style: { width: 300, height: 500 }, children: _jsx(DataGrid, { ...baselineProps, ref: rootRef, columns: [{ field: 'brand' }], slotProps: {
                    main: {
                        'data-custom-id': 'grid-1',
                        'aria-label': 'Grid one',
                    },
                    root: {
                        'data-custom-id': 'root-1',
                        'aria-label': 'Root one',
                    },
                } }) }));
        expect(document.querySelector('[data-custom-id="root-1"]')).to.equal(rootRef.current);
        expect(document.querySelector('[aria-label="Root one"]')).to.equal(rootRef.current);
        const mainElement = document.querySelector('[role="grid"]');
        expect(document.querySelector('[data-custom-id="grid-1"]')).to.equal(mainElement);
        expect(document.querySelector('[aria-label="Grid one"]')).to.equal(mainElement);
    });
    it('should not fail when row have IDs match Object prototype keys (constructor, hasOwnProperty, etc)', () => {
        const rows = [
            { id: 'a', col1: 'Hello', col2: 'World' },
            { id: 'constructor', col1: 'DataGridPro', col2: 'is Awesome' },
            { id: 'hasOwnProperty', col1: 'MUI', col2: 'is Amazing' },
        ];
        const columns = [
            { field: 'col1', headerName: 'Column 1', width: 150 },
            { field: 'col2', headerName: 'Column 2', width: 150 },
        ];
        render(_jsx("div", { style: { height: 300, width: '100%' }, children: _jsx(DataGrid, { rows: rows, columns: columns }) }));
    });
    it('should not cause unexpected behavior when props are explictly set to undefined', () => {
        const rows = [
            { id: 'a', col1: 'Hello', col2: 'World' },
            { id: 'constructor', col1: 'DataGridPro', col2: 'is Awesome' },
            { id: 'hasOwnProperty', col1: 'MUI', col2: 'is Amazing' },
        ];
        const columns = [
            { field: 'col1', headerName: 'Column 1', width: 150 },
            { field: 'col2', headerName: 'Column 2', width: 150 },
        ];
        expect(() => {
            render(_jsx("div", { style: { height: 300, width: 300 }, children: _jsx(DataGrid, { ...Object.keys(DATA_GRID_PROPS_DEFAULT_VALUES).reduce((acc, key) => {
                        // @ts-ignore
                        acc[key] = undefined;
                        return acc;
                    }, {}), rows: rows, columns: columns }) }));
        }).not.toErrorDev();
    });
});
