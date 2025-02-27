/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import { ponyfillGlobal } from '@mui/utils';
import { vi } from 'vitest';
import { getTelemetryEnvConfig } from './config';
import { muiXTelemetrySettings } from '../index';

describe('Telemetry: getTelemetryConfig', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    // Reset env config cache
    getTelemetryEnvConfig(true);
  });

  it('should be disabled by default', () => {
    expect(getTelemetryEnvConfig(true).IS_COLLECTING).not.equal(true);
  });

  function testConfigWithDisabledEnv(envKey: string) {
    it(`should be disabled, if ${envKey} is set to '1'`, () => {
      vi.stubEnv(envKey, '1');
      expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(false);
    });

    it(`should be enabled, if ${envKey} is set to '0'`, () => {
      vi.stubEnv(envKey, '0');
      expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(true);
    });
  }

  testConfigWithDisabledEnv('MUI_X_TELEMETRY_DISABLED');
  testConfigWithDisabledEnv('REACT_APP_MUI_X_TELEMETRY_DISABLED');
  testConfigWithDisabledEnv('NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED');

  it('should be disabled if global.__MUI_X_TELEMETRY_DISABLED__ is set to `1`', () => {
    ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = undefined;
    vi.stubGlobal('__MUI_X_TELEMETRY_DISABLED__', true);

    expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(false);
  });

  it('should be enabled if global.__MUI_X_TELEMETRY_DISABLED__ is set to `0`', () => {
    ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = undefined;
    vi.stubGlobal('__MUI_X_TELEMETRY_DISABLED__', false);

    expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(true);
  });

  it('should be changed with `muiXTelemetrySettings`', () => {
    muiXTelemetrySettings.enableTelemetry();
    expect(getTelemetryEnvConfig().IS_COLLECTING).equal(true);

    muiXTelemetrySettings.disableTelemetry();
    expect(getTelemetryEnvConfig().IS_COLLECTING).equal(false);

    muiXTelemetrySettings.enableTelemetry();
    expect(getTelemetryEnvConfig().IS_COLLECTING).equal(true);
  });

  it('debug should be enabled with `muiXTelemetrySettings.enableDebug()`', () => {
    expect(getTelemetryEnvConfig().DEBUG).equal(false);

    muiXTelemetrySettings.enableDebug();
    expect(getTelemetryEnvConfig().DEBUG).equal(true);
  });

  it('debug should be enabled if env MUI_X_TELEMETRY_DEBUG is set to `1`', () => {
    vi.stubEnv('MUI_X_TELEMETRY_DEBUG', '1');
    expect(getTelemetryEnvConfig(true).DEBUG).equal(true);

    vi.stubEnv('MUI_X_TELEMETRY_DEBUG', '0');
    expect(getTelemetryEnvConfig(true).DEBUG).equal(false);
  });
});
