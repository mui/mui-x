"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var skipIf_1 = require("test/utils/skipIf");
var generateLicense_1 = require("../generateLicense/generateLicense");
var verifyLicense_1 = require("./verifyLicense");
var licenseStatus_1 = require("../utils/licenseStatus");
var oneDayInMS = 1000 * 60 * 60 * 24;
var releaseDate = new Date(2018, 0, 0, 0, 0, 0, 0);
var RELEASE_INFO = (0, verifyLicense_1.generateReleaseInfo)(releaseDate);
// Can't change the process.env.NODE_ENV in Browser
describe.skipIf(!skipIf_1.isJSDOM)('License: verifyLicense', function () {
    var env;
    beforeEach(function () {
        env = process.env.NODE_ENV;
        process.env.NODE_ENV = 'test';
    });
    afterEach(function () {
        process.env.NODE_ENV = env;
    });
    describe('key version: 1', function () {
        var licenseKey = '65897de688b8bed993b1d6ddd0e1d548T1JERVI6MTIzLEVYUElSWT0xNzg1ODc0MDEwNzA4LEtFWVZFUlNJT049MQ==';
        it('should log an error when ReleaseInfo is not valid', function () {
            process.env.NODE_ENV = 'production';
            expect(function () {
                return (0, verifyLicense_1.verifyLicense)({
                    releaseInfo: '__RELEASE_INFO__',
                    licenseKey: licenseKey,
                    packageName: 'x-data-grid-pro',
                }).status;
            }).to.throw('MUI X: The release information is invalid. Not able to validate license.');
        });
        it('should verify License properly', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: licenseKey,
                packageName: 'x-data-grid-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
        });
        it('should check expired license properly', function () {
            process.env.NODE_ENV = 'production';
            var expiredLicenseKey = (0, generateLicense_1.generateLicense)({
                expiryDate: new Date(releaseDate.getTime() - oneDayInMS),
                planScope: 'pro',
                licenseModel: 'perpetual',
                orderNumber: '123',
                planVersion: 'initial',
            });
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: expiredLicenseKey,
                packageName: 'x-data-grid-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.ExpiredVersion);
        });
        it('should return Invalid for invalid license', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: 'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
                packageName: 'x-data-grid-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Invalid);
        });
    });
    describe('key version: 2', function () {
        var licenseKeyPro = (0, generateLicense_1.generateLicense)({
            expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
            orderNumber: '123',
            planScope: 'pro',
            licenseModel: 'subscription',
            planVersion: 'initial',
        });
        var licenseKeyPremium = (0, generateLicense_1.generateLicense)({
            expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
            orderNumber: '123',
            planScope: 'premium',
            licenseModel: 'subscription',
            planVersion: 'initial',
        });
        it('should log an error when ReleaseInfo is not valid', function () {
            process.env.NODE_ENV = 'production';
            expect(function () {
                return (0, verifyLicense_1.verifyLicense)({
                    releaseInfo: '__RELEASE_INFO__',
                    licenseKey: licenseKeyPro,
                    packageName: 'x-data-grid-pro',
                }).status;
            }).to.throw('MUI X: The release information is invalid. Not able to validate license.');
        });
        describe('scope', function () {
            it('should accept pro license for pro features', function () {
                process.env.NODE_ENV = 'production';
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: licenseKeyPro,
                    packageName: 'x-data-grid-pro',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
            });
            it('should accept premium license for premium features', function () {
                process.env.NODE_ENV = 'production';
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: licenseKeyPremium,
                    packageName: 'x-data-grid-premium',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
            });
            it('should not accept pro license for premium feature', function () {
                process.env.NODE_ENV = 'production';
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: licenseKeyPro,
                    packageName: 'x-data-grid-premium',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.OutOfScope);
            });
        });
        describe('expiry date', function () {
            it('should validate subscription license in prod if current date is after expiry date but release date is before expiry date', function () {
                process.env.NODE_ENV = 'production';
                var expiredLicenseKey = (0, generateLicense_1.generateLicense)({
                    expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
                    orderNumber: '123',
                    planScope: 'pro',
                    licenseModel: 'subscription',
                    planVersion: 'initial',
                });
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: expiredLicenseKey,
                    packageName: 'x-data-grid-pro',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
            });
            it('should not validate subscription license in dev if current date is after expiry date but release date is before expiry date', function () {
                var expiredLicenseKey = (0, generateLicense_1.generateLicense)({
                    expiryDate: new Date(new Date().getTime() - oneDayInMS),
                    orderNumber: '123',
                    planScope: 'pro',
                    licenseModel: 'subscription',
                    planVersion: 'initial',
                });
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: expiredLicenseKey,
                    packageName: 'x-data-grid-pro',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.ExpiredAnnualGrace);
            });
            it('should throw if the license is expired by more than a 30 days', function () {
                process.env.NODE_ENV = 'development';
                var expiredLicenseKey = (0, generateLicense_1.generateLicense)({
                    expiryDate: new Date(new Date().getTime() - oneDayInMS * 30),
                    orderNumber: '123',
                    planScope: 'pro',
                    licenseModel: 'subscription',
                    planVersion: 'initial',
                });
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: expiredLicenseKey,
                    packageName: 'x-data-grid-pro',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.ExpiredAnnual);
            });
            it('should validate perpetual license in dev if current date is after expiry date but release date is before expiry date', function () {
                var expiredLicenseKey = (0, generateLicense_1.generateLicense)({
                    expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
                    orderNumber: '123',
                    planScope: 'pro',
                    licenseModel: 'perpetual',
                    planVersion: 'initial',
                });
                expect((0, verifyLicense_1.verifyLicense)({
                    releaseInfo: RELEASE_INFO,
                    licenseKey: expiredLicenseKey,
                    packageName: 'x-data-grid-pro',
                }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
            });
        });
        it('should return Invalid for invalid license', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: 'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
                packageName: 'x-data-grid-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Invalid);
        });
    });
    describe('key version: 2.1', function () {
        var licenseKeyPro = (0, generateLicense_1.generateLicense)({
            expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
            orderNumber: '123',
            planScope: 'pro',
            licenseModel: 'annual',
            planVersion: 'initial',
        });
        it('should accept licenseModel="annual"', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: licenseKeyPro,
                packageName: 'x-data-grid-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
        });
    });
    describe('key version: 2.2', function () {
        var proLicenseKeyInitial = (0, generateLicense_1.generateLicense)({
            expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
            orderNumber: '123',
            planScope: 'pro',
            licenseModel: 'annual',
            planVersion: 'initial',
        });
        var premiumLicenseKeyInitial = (0, generateLicense_1.generateLicense)({
            expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
            orderNumber: '123',
            planScope: 'premium',
            licenseModel: 'annual',
            planVersion: 'initial',
        });
        var proLicenseKeyQ32024 = (0, generateLicense_1.generateLicense)({
            expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
            orderNumber: '123',
            planScope: 'pro',
            licenseModel: 'annual',
            planVersion: 'Q3-2024',
        });
        it('PlanVersion "initial" should not accept x-charts-pro', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: proLicenseKeyInitial,
                packageName: 'x-charts-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.NotAvailableInInitialProPlan);
        });
        it('PlanVersion "initial" should not accept x-tree-view-pro', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: proLicenseKeyInitial,
                packageName: 'x-tree-view-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.NotAvailableInInitialProPlan);
        });
        it('PlanVersion "Q3-2024" should accept x-charts-pro', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: proLicenseKeyQ32024,
                packageName: 'x-charts-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
        });
        it('PlanVersion "Q3-2024" should accept x-tree-view-pro', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: proLicenseKeyQ32024,
                packageName: 'x-tree-view-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
        });
        it('Premium with planVersion "initial" should accept x-tree-view-pro', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: premiumLicenseKeyInitial,
                packageName: 'x-tree-view-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
        });
        it('Premium with planVersion "initial" should accept x-charts-pro', function () {
            process.env.NODE_ENV = 'production';
            expect((0, verifyLicense_1.verifyLicense)({
                releaseInfo: RELEASE_INFO,
                licenseKey: premiumLicenseKeyInitial,
                packageName: 'x-charts-pro',
            }).status).to.equal(licenseStatus_1.LICENSE_STATUS.Valid);
        });
    });
});
