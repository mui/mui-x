"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
describe('<DataGrid /> - Accessibility', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        columns: [{ field: 'id' }],
        rows: [{ id: 0 }],
    };
    it('should use the `label` prop as the `aria-label` attribute of role="grid"', function () {
        render(<x_data_grid_1.DataGrid {...baselineProps} label="Grid label"/>);
        expect(document.querySelector('div[role="grid"]')).to.have.attribute('aria-label', 'Grid label');
    });
    it('should only use the `label` prop as the `aria-label` attribute of role="grid" if `aria-label` is not provided', function () {
        render(<x_data_grid_1.DataGrid {...baselineProps} label="Grid label" aria-label="Grid aria-label"/>);
        expect(document.querySelector('div[role="grid"]')).to.have.attribute('aria-label', 'Grid aria-label');
    });
    it('should only use the `label` prop as the `aria-label` attribute of role="grid" if `aria-labelledby` is not provided', function () {
        render(<x_data_grid_1.DataGrid {...baselineProps} label="Grid label" aria-labelledby="Grid aria-labelledby"/>);
        expect(document.querySelector('div[role="grid"]')).to.have.attribute('aria-labelledby', 'Grid aria-labelledby');
        expect(document.querySelector('div[role="grid"]')).not.to.have.attribute('aria-label');
    });
});
