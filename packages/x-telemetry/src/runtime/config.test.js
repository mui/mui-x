"use strict";
/* eslint-disable no-underscore-dangle */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var x_telemetry_1 = require("@mui/x-telemetry");
var config_1 = require("./config");
describe('Telemetry: getTelemetryConfig', function () {
    beforeEach(function () {
        vitest_1.vi.stubEnv('NODE_ENV', 'development');
    });
    afterEach(function () {
        vitest_1.vi.unstubAllEnvs();
        // Reset env config cache
        (0, config_1.getTelemetryEnvConfig)(true);
    });
    it('should be disabled by default', function () {
        expect((0, config_1.getTelemetryEnvConfig)(true).IS_COLLECTING).not.equal(true);
    });
    function testConfigWithDisabledEnv(envKey) {
        it("should be disabled, if ".concat(envKey, " is set to '1'"), function () {
            vitest_1.vi.stubEnv(envKey, '1');
            expect((0, config_1.getTelemetryEnvConfig)(true).IS_COLLECTING).equal(false);
        });
        it("should be enabled, if ".concat(envKey, " is set to '0'"), function () {
            vitest_1.vi.stubEnv(envKey, '0');
            expect((0, config_1.getTelemetryEnvConfig)(true).IS_COLLECTING).equal(true);
        });
    }
    testConfigWithDisabledEnv('MUI_X_TELEMETRY_DISABLED');
    testConfigWithDisabledEnv('REACT_APP_MUI_X_TELEMETRY_DISABLED');
    testConfigWithDisabledEnv('NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED');
    it('should be disabled if global.__MUI_X_TELEMETRY_DISABLED__ is set to `1`', function () {
        globalThis.__MUI_X_TELEMETRY_DISABLED__ = undefined;
        vitest_1.vi.stubGlobal('__MUI_X_TELEMETRY_DISABLED__', true);
        expect((0, config_1.getTelemetryEnvConfig)(true).IS_COLLECTING).equal(false);
    });
    it('should be enabled if global.__MUI_X_TELEMETRY_DISABLED__ is set to `0`', function () {
        globalThis.__MUI_X_TELEMETRY_DISABLED__ = undefined;
        vitest_1.vi.stubGlobal('__MUI_X_TELEMETRY_DISABLED__', false);
        expect((0, config_1.getTelemetryEnvConfig)(true).IS_COLLECTING).equal(true);
    });
    it('should be changed with `muiXTelemetrySettings`', function () {
        x_telemetry_1.muiXTelemetrySettings.enableTelemetry();
        expect((0, config_1.getTelemetryEnvConfig)().IS_COLLECTING).equal(true);
        x_telemetry_1.muiXTelemetrySettings.disableTelemetry();
        expect((0, config_1.getTelemetryEnvConfig)().IS_COLLECTING).equal(false);
        x_telemetry_1.muiXTelemetrySettings.enableTelemetry();
        expect((0, config_1.getTelemetryEnvConfig)().IS_COLLECTING).equal(true);
    });
    it('debug should be enabled with `muiXTelemetrySettings.enableDebug()`', function () {
        expect((0, config_1.getTelemetryEnvConfig)().DEBUG).equal(false);
        x_telemetry_1.muiXTelemetrySettings.enableDebug();
        expect((0, config_1.getTelemetryEnvConfig)().DEBUG).equal(true);
    });
    it('debug should be enabled if env MUI_X_TELEMETRY_DEBUG is set to `1`', function () {
        vitest_1.vi.stubEnv('MUI_X_TELEMETRY_DEBUG', '1');
        expect((0, config_1.getTelemetryEnvConfig)(true).DEBUG).equal(true);
        vitest_1.vi.stubEnv('MUI_X_TELEMETRY_DEBUG', '0');
        expect((0, config_1.getTelemetryEnvConfig)(true).DEBUG).equal(false);
    });
});
