import type { SchedulerUserFacingErrorDescriptor } from '@mui/x-scheduler-internals/internals';
import type { SchedulerErrorLocaleText } from '../../models/translations';

/**
 * Translates an error pushed by the store into the message shown to the user.
 */
export function getUserFacingErrorMessage(
  localeText: SchedulerErrorLocaleText,
  error: SchedulerUserFacingErrorDescriptor,
): string {
  if (error.code === 'readOnlyEventMovedError') {
    return localeText.readOnlyEventMovedError(error.params.title);
  }
  return localeText[error.code];
}
