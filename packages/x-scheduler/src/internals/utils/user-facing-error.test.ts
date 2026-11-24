import { describe, it, expect } from 'vitest';
import { enUS } from '../../locales/enUS';
import type { SchedulerErrorLocaleText } from '../../models/translations';
import { getUserFacingErrorMessage } from './user-facing-error';

const localeText = enUS.components.MuiEventCalendar.defaultProps
  .localeText as SchedulerErrorLocaleText;

describe('getUserFacingErrorMessage', () => {
  it('should pass the title to the messages that take one', () => {
    expect(
      getUserFacingErrorMessage(localeText, {
        code: 'readOnlyEventMovedError',
        params: { title: 'Standup' },
      }),
    ).to.equal('This change would move the read-only event "Standup", so it was not applied.');
    expect(
      getUserFacingErrorMessage(localeText, {
        code: 'unwritableEventMovedError',
        params: { title: 'Standup' },
      }),
    ).to.equal(
      'This change would move the event "Standup", whose dates can\'t be changed, so it was not applied.',
    );
  });

  it('should return the message of a code without params as is', () => {
    expect(getUserFacingErrorMessage(localeText, { code: 'datesNotWritableError' })).to.equal(
      "This date can't be changed, so the change was not applied.",
    );
  });
});
