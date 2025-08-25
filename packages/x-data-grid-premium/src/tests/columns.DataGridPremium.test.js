"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPremium /> - Columns', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('resizing', function () {
        // https://github.com/mui/mui-x/issues/10078
        // Needs layout
        it.skipIf(skipIf_1.isJSDOM)('should properly resize aggregated column', function () {
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_premium_1.DataGridPremium rows={[
                    { id: 0, brand: 'Nike' },
                    { id: 1, brand: 'Adidas' },
                    { id: 2, brand: 'Puma' },
                    { id: 3, brand: 'Reebok' },
                    { id: 4, brand: 'Under Armour' },
                    { id: 5, brand: 'Asics' },
                    { id: 6, brand: 'Salomon' },
                ]} columns={[{ field: 'brand' }]} initialState={{ aggregation: { model: { brand: 'size' } } }} showCellVerticalBorder rowBufferPx={52}/>
        </div>);
            var separator = document.querySelector(".".concat(x_data_grid_premium_1.gridClasses['columnSeparator--resizable']));
            internal_test_utils_1.fireEvent.mouseDown(separator, { clientX: 100 });
            internal_test_utils_1.fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
            internal_test_utils_1.fireEvent.mouseUp(separator);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '150px' });
            expect((0, helperFn_1.getCell)(0, 0).getBoundingClientRect().width).to.equal(150);
            var virtualScroller = document.querySelector(".".concat(x_data_grid_premium_1.gridClasses.virtualScroller));
            virtualScroller.scrollTop = 500; // scroll to the bottom
            (0, internal_test_utils_1.act)(function () { return virtualScroller.dispatchEvent(new Event('scroll')); });
            expect((0, helperFn_1.getCell)(6, 0).getBoundingClientRect().width).to.equal(150);
        });
    });
});
