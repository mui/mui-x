import muiXTelemetryEvents from './runtime/events';
import sendMuiXTelemetryEventOriginal from './runtime/sender';
import muiXTelemetrySettingsOriginal from './runtime/settings';

const noop = () => {};

// To cut unused imports in production as early as possible
const sendMuiXTelemetryEvent =
  process.env.NODE_ENV === 'production' ? noop : sendMuiXTelemetryEventOriginal;

// To cut unused imports in production as early as possible
const muiXTelemetrySettings =
  process.env.NODE_ENV === 'production'
    ? {
        enableDebug: noop,
        enableTelemetry: noop,
        disableTelemetry: noop,
      }
    : muiXTelemetrySettingsOriginal;

export { muiXTelemetryEvents, sendMuiXTelemetryEvent, muiXTelemetrySettings };
