import { setMuiXTelemetryEnv } from './config';

const muiXTelemetrySettings = {
  enableDebug: () => {
    setMuiXTelemetryEnv('DEBUG', true);
  },
  enableTelemetry: () => {
    setMuiXTelemetryEnv('IS_COLLECTING', true);
  },
  disableTelemetry: () => {
    setMuiXTelemetryEnv('IS_COLLECTING', false);
  },
};

export default muiXTelemetrySettings;
