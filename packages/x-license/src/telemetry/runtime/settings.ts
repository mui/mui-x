import { setTelemetryEnvConfigValue } from './config';

const muiXTelemetrySettings = {
  enableDebug: () => {
    setTelemetryEnvConfigValue('DEBUG', true);
  },
  enableTelemetry: () => {
    setTelemetryEnvConfigValue('IS_COLLECTING', true);
  },
  disableTelemetry: () => {
    setTelemetryEnvConfigValue('IS_COLLECTING', false);
  },
};

export default muiXTelemetrySettings;
