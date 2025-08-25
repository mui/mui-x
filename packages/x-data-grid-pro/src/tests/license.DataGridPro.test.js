"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_license_1 = require("@mui/x-license");
describe('<DataGridPro /> - License', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    beforeEach(function () {
        x_license_1.LicenseInfo.setLicenseKey('');
    });
    it('should render watermark when the license is missing', function () {
        expect(function () { return render(<x_data_grid_pro_1.DataGridPro columns={[]} rows={[]} autoHeight/>); }).toErrorDev([
            'MUI X: Missing license key.',
        ]);
        expect(internal_test_utils_1.screen.getByText('MUI X Missing license key')).not.to.equal(null);
    });
});
