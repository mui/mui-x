import { TelemetryEventContext } from '../types';

const noop = () => null;

const muiXTelemetryEvents = {
  licenseVerification:
    process.env.NODE_ENV === 'production'
      ? noop
      : (
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
