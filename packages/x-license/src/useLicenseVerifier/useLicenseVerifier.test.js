"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_license_1 = require("@mui/x-license");
var skipIf_1 = require("test/utils/skipIf");
var useLicenseVerifier_1 = require("./useLicenseVerifier");
var verifyLicense_1 = require("../verifyLicense");
var oneDayInMS = 1000 * 60 * 60 * 24;
var releaseDate = new Date(3000, 0, 0, 0, 0, 0, 0);
var RELEASE_INFO = (0, verifyLicense_1.generateReleaseInfo)(releaseDate);
function TestComponent(props) {
    var licenseStatus = (0, x_license_1.useLicenseVerifier)(props.packageName || 'x-date-pickers-pro', RELEASE_INFO);
    return <div data-testid="status">Status: {licenseStatus.status}</div>;
}
// Can't change the process.env.NODE_ENV in Browser
describe.skipIf(!skipIf_1.isJSDOM)('useLicenseVerifier', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var env;
    beforeEach(function () {
        env = process.env.NODE_ENV;
        // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
        // eslint-disable-next-line no-useless-concat
        process.env['NODE_' + 'ENV'] = 'test';
    });
    afterEach(function () {
        // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
        // eslint-disable-next-line no-useless-concat
        process.env['NODE_' + 'ENV'] = env;
    });
    describe('error', function () {
        beforeEach(function () {
            (0, useLicenseVerifier_1.clearLicenseStatusCache)();
        });
        it('should log the missing license key error only once', function () {
            x_license_1.LicenseInfo.setLicenseKey('');
            expect(function () {
                render(<TestComponent />);
            }).toErrorDev(['MUI X: Missing license key']);
        });
        it('should detect an override of a valid license key in the context', function () {
            var key = (0, x_license_1.generateLicense)({
                expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
                licenseModel: 'perpetual',
                orderNumber: '123',
                planScope: 'pro',
                planVersion: 'initial',
            });
            x_license_1.LicenseInfo.setLicenseKey('');
            expect(function () {
                render(<x_license_1.Unstable_LicenseInfoProvider info={{ key: key }}>
            <TestComponent />
          </x_license_1.Unstable_LicenseInfoProvider>);
            }).not.toErrorDev();
            expect(internal_test_utils_1.screen.getByTestId('status')).to.have.text('Status: Valid');
        });
        it('should throw if the license is expired by more than a 30 days', function () {
            // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
            // eslint-disable-next-line no-useless-concat
            process.env['NODE_' + 'ENV'] = 'development';
            var expiredLicenseKey = (0, x_license_1.generateLicense)({
                expiryDate: new Date(new Date().getTime() - oneDayInMS * 30),
                orderNumber: '123',
                planScope: 'pro',
                licenseModel: 'subscription',
                planVersion: 'initial',
            });
            x_license_1.LicenseInfo.setLicenseKey(expiredLicenseKey);
            var errorRef = React.createRef();
            expect(function () {
                render(<internal_test_utils_1.ErrorBoundary ref={errorRef}>
            <TestComponent />
          </internal_test_utils_1.ErrorBoundary>);
            }).to.toErrorDev([
                'MUI X: Expired license key',
                internal_test_utils_1.reactMajor < 19 && 'MUI X: Expired license key',
                internal_test_utils_1.reactMajor < 19 && 'The above error occurred in the <TestComponent> component',
            ]);
            expect(errorRef.current.errors[0].toString()).to.match(/MUI X: Expired license key/);
        });
        it('should throw if the license is not covering charts and tree-view', function () {
            // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
            // eslint-disable-next-line no-useless-concat
            process.env['NODE_' + 'ENV'] = 'development';
            var licenseKey = (0, x_license_1.generateLicense)({
                expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
                orderNumber: '123',
                planScope: 'pro',
                licenseModel: 'subscription',
                planVersion: 'initial',
            });
            x_license_1.LicenseInfo.setLicenseKey(licenseKey);
            expect(function () {
                render(<TestComponent packageName={'x-charts-pro'}/>);
            }).to.toErrorDev(['MUI X: Component not included in your license.']);
            // TODO: CHARTS-PREMIUM: Define how license will work for x-charts-premium
            expect(function () {
                render(<TestComponent packageName={'x-tree-view-pro'}/>);
            }).to.toErrorDev(['MUI X: Component not included in your license.']);
        });
        it('should not throw if the license is covering charts and tree-view', function () {
            // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
            // eslint-disable-next-line no-useless-concat
            process.env['NODE_' + 'ENV'] = 'development';
            var licenseKey = (0, x_license_1.generateLicense)({
                expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
                orderNumber: '123',
                planScope: 'pro',
                licenseModel: 'subscription',
                planVersion: 'Q3-2024',
            });
            x_license_1.LicenseInfo.setLicenseKey(licenseKey);
            expect(function () {
                render(<TestComponent packageName={'x-charts-pro'}/>);
            }).not.toErrorDev();
            expect(function () {
                render(<TestComponent packageName={'x-tree-view-pro'}/>);
            }).not.toErrorDev();
        });
        it('should not throw for existing pro and premium packages', function () {
            // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
            // eslint-disable-next-line no-useless-concat
            process.env['NODE_' + 'ENV'] = 'development';
            var licenseKey = (0, x_license_1.generateLicense)({
                expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
                orderNumber: '123',
                planScope: 'premium',
                licenseModel: 'subscription',
                planVersion: 'Q3-2024',
            });
            x_license_1.LicenseInfo.setLicenseKey(licenseKey);
            expect(function () {
                render(<TestComponent packageName={'x-data-grid-pro'}/>);
            }).not.toErrorDev();
            expect(function () {
                render(<TestComponent packageName={'x-data-grid-premium'}/>);
            }).not.toErrorDev();
            expect(function () {
                render(<TestComponent packageName={'x-date-pickers-pro'}/>);
            }).not.toErrorDev();
        });
    });
});
