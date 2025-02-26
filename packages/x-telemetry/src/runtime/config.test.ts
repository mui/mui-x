/* eslint-disable no-underscore-dangle */

import sinon from 'sinon';
import { expect } from 'chai';
import { ponyfillGlobal } from '@mui/utils';
import { getTelemetryEnvConfig } from './config';
import { muiXTelemetrySettings } from '../index';

describe('Telemetry: getTelemetryConfig', () => {
  beforeEach(() => {
    sinon.stub(process, 'env').value({
      NODE_ENV: 'development',
    });
  });

  afterEach(() => {
    sinon.restore();
    // Reset env config cache
    getTelemetryEnvConfig(true);
  });

  it('should be disabled by default', () => {
    expect(getTelemetryEnvConfig(true).IS_COLLECTING).not.equal(true);
  });

  function testConfigWithDisabledEnv(envKey: string) {
    it(`should be disabled, if ${envKey} is set to '1'`, () => {
      sinon.stub(process, 'env').value({ [envKey]: '1' });
      expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(false);
    });

    it(`should be enabled, if ${envKey} is set to '0'`, () => {
      sinon.stub(process, 'env').value({ [envKey]: '0' });
      expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(true);
    });
  }

  testConfigWithDisabledEnv('MUI_X_TELEMETRY_DISABLED');
  testConfigWithDisabledEnv('REACT_APP_MUI_X_TELEMETRY_DISABLED');
  testConfigWithDisabledEnv('NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED');

  it('should be disabled if global.__MUI_X_TELEMETRY_DISABLED__ is set to `1`', () => {
    ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = undefined;
    sinon.stub(ponyfillGlobal, '__MUI_X_TELEMETRY_DISABLED__').value(true);

    expect(getTelemetryEnvConfig(true).IS_COLLECTING).equal(false);
  });

  it('should be enabled if global.__MUI_X_TELEMETRY_DISABLED__ is set to `0`', () => {
    ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ = undefined;
    sinon.stub(ponyfillGlobal, '__MUI_X_TELEMETRY_DISABLED__').value(false);

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
    sinon.stub(process, 'env').value({ MUI_X_TELEMETRY_DEBUG: '1' });
    expect(getTelemetryEnvConfig(true).DEBUG).equal(true);

    sinon.stub(process, 'env').value({ MUI_X_TELEMETRY_DEBUG: '0' });
    expect(getTelemetryEnvConfig(true).DEBUG).equal(false);
  });
});
