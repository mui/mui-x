import { createLogOnce } from '@base-ui/utils/createLogOnce';

/** Logs a message to the console once per unique message. No-op in production. */
export const warn = createLogOnce('warn');

/** Logs an error to the console once per unique message. No-op in production. */
export const error = createLogOnce('error');

export { reset as clearWarningsCache } from '@base-ui/utils/createLogOnce';
