const noop = () => null;
const muiXTelemetryEvents = {
    licenseVerification: process.env.NODE_ENV === 'production'
        ? noop
        : (context, payload) => ({
            eventName: 'licenseVerification',
            payload,
            context,
        }),
};
export default muiXTelemetryEvents;
