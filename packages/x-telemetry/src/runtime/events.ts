import { TelemetryEventContext } from '../types';

const muiXTelemetryEvents = {
  licenseVerification: (
    context: TelemetryEventContext,
    payload: {
      packageReleaseInfo: string;
      packageName: string;
      licenseStatus?: string;
    },
  ) => ({
    eventName: 'licenseVerification',
    payload,
    context,
  }),
};

export default muiXTelemetryEvents;
