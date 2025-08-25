"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var addYears_1 = require("date-fns/addYears");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var x_license_1 = require("@mui/x-license");
describe('<DataGridPremium /> - License', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should throw out of scope error when using DataGridPremium with a pro license', function () {
        x_license_1.LicenseInfo.setLicenseKey((0, x_license_1.generateLicense)({
            expiryDate: (0, addYears_1.addYears)(new Date(), 1),
            orderNumber: '123',
            licenseModel: 'subscription',
            planScope: 'pro',
            planVersion: 'initial',
        }));
        expect(function () { return render(<x_data_grid_premium_1.DataGridPremium columns={[]} rows={[]} autoHeight/>); }).toErrorDev([
            'MUI X: License key plan mismatch',
        ]);
    });
    it('should render watermark when the license is missing', function () {
        // Clear any previous license status cache to ensure a clean test environment
        // Needed, because we run test with "isolate: false"
        (0, x_license_1.clearLicenseStatusCache)();
        x_license_1.LicenseInfo.setLicenseKey('');
        expect(function () { return render(<x_data_grid_premium_1.DataGridPremium columns={[]} rows={[]} autoHeight/>); }).toErrorDev([
            'MUI X: Missing license key.',
        ]);
        expect(internal_test_utils_1.screen.getByText('MUI X Missing license key')).not.to.equal(null);
    });
});
