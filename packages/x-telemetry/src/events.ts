import { TelemetryEventContext } from './types';

const muiXTelemetryEvents = {
  licenseVerification: (
    context: TelemetryEventContext,
    payload: {
      licenseStatus?: string;
    } = {},
  ) => ({
    eventName: 'licenseVerification',
    payload,
    context,
  }),
};

export default muiXTelemetryEvents;
