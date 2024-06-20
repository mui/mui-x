import { setMuiXTelemetryEnv } from './config';

const muiXTelemetrySettings = {
  debug: () => {
    setMuiXTelemetryEnv('DEBUG', true);
  },
  enable: () => {
    setMuiXTelemetryEnv('IS_COLLECTING', true);
  },
  disable: () => {
    setMuiXTelemetryEnv('IS_COLLECTING', false);
  },
};

export default muiXTelemetrySettings;
