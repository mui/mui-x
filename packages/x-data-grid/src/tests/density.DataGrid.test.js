import { jsx as _jsx } from "react/jsx-runtime";
import { spy } from 'sinon';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { grid } from 'test/utils/helperFn';
import { DataGrid, gridClasses, GridToolbar } from '@mui/x-data-grid';
import { isJSDOM } from 'test/utils/skipIf';
import { COMFORTABLE_DENSITY_FACTOR, COMPACT_DENSITY_FACTOR, } from '../hooks/features/density/densitySelector';
// JSDOM seem to not support CSS variables properly and `height: var(--height)` ends up being `height: ''`
describe.skipIf(isJSDOM)('<DataGrid /> - Density', () => {
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
    function expectHeight(value) {
        expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
            maxHeight: `${Math.floor(value)}px`,
        });
        expect(getComputedStyle(screen.getAllByRole('gridcell')[1]).height).to.equal(`${Math.floor(value)}px`);
    }
    describe('prop: `initialState.density`', () => {
        it('should set the density to the value of initialState.density', () => {
            const rowHeight = 30;
            render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, initialState: { density: 'compact' }, showToolbar: true, rowHeight: rowHeight }) }));
            expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
        });
    });
    describe('prop: `density`', () => {
        it('should set the density value using density prop', () => {
            const rowHeight = 30;
            render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, density: "compact", rowHeight: rowHeight }) }));
            expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
        });
        it('should allow to control the density from the prop using state', () => {
            const rowHeight = 30;
            function Grid(props) {
                return (_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, showToolbar: true, slots: { toolbar: GridToolbar }, ...props }) }));
            }
            const { setProps } = render(_jsx(Grid, { rowHeight: rowHeight, density: "standard" }));
            expectHeight(rowHeight);
            fireEvent.click(screen.getByText('Density'));
            fireEvent.click(screen.getByText('Compact'));
            // Not updated because of the controlled prop
            expectHeight(rowHeight);
            // Explicitly update the prop
            setProps({ density: 'compact' });
            expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
        });
        // TODO: Remove when we remove the legacy GridToolbar
        it('should call `onDensityChange` prop when density gets updated', () => {
            const onDensityChange = spy();
            function Test() {
                return (_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, slots: {
                            toolbar: GridToolbar,
                        }, showToolbar: true, onDensityChange: onDensityChange }) }));
            }
            render(_jsx(Test, {}));
            fireEvent.click(screen.getByText('Density'));
            fireEvent.click(screen.getByText('Comfortable'));
            expect(onDensityChange.callCount).to.equal(1);
            expect(onDensityChange.firstCall.args[0]).to.equal('comfortable');
        });
    });
    // TODO: Remove when we remove the legacy GridToolbar
    describe('density selection menu', () => {
        it('should increase grid density when selecting compact density', () => {
            const rowHeight = 30;
            render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, showToolbar: true, slots: { toolbar: GridToolbar }, rowHeight: rowHeight }) }));
            fireEvent.click(screen.getByText('Density'));
            fireEvent.click(screen.getByText('Compact'));
            expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
        });
        it('should decrease grid density when selecting comfortable density', () => {
            const rowHeight = 30;
            render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, showToolbar: true, slots: { toolbar: GridToolbar }, rowHeight: rowHeight }) }));
            fireEvent.click(screen.getByText('Density'));
            fireEvent.click(screen.getByText('Comfortable'));
            expectHeight(rowHeight * COMFORTABLE_DENSITY_FACTOR);
        });
        it('should increase grid density even if toolbar is not enabled', () => {
            const rowHeight = 30;
            render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, rowHeight: rowHeight, density: "compact" }) }));
            expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
        });
        it('should decrease grid density even if toolbar is not enabled', () => {
            const rowHeight = 30;
            render(_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, rowHeight: rowHeight, density: "comfortable" }) }));
            expectHeight(rowHeight * COMFORTABLE_DENSITY_FACTOR);
        });
        it('should apply to the root element a class corresponding to the current density', () => {
            function Test(props) {
                return (_jsx("div", { style: { width: 300, height: 300 }, children: _jsx(DataGrid, { ...baselineProps, ...props }) }));
            }
            const { setProps } = render(_jsx(Test, {}));
            expect(grid('root')).to.have.class(gridClasses['root--densityStandard']);
            setProps({ density: 'compact' });
            expect(grid('root')).to.have.class(gridClasses['root--densityCompact']);
            setProps({ density: 'comfortable' });
            expect(grid('root')).to.have.class(gridClasses['root--densityComfortable']);
        });
    });
});
