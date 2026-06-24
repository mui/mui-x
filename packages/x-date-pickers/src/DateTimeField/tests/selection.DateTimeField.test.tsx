import * as React from 'react';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, getCleanedSelectedContent } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DateTimeField /> - Selection', () => {
  const { render } = createPickerRenderer();

  // Coverage check: the Chromium focus-delegation gate lives at the shared
  // `PickersInputBase` level so all field variants share it. This duplicates
  // the DateField browser test against a DateTimeField, whose section layout
  // is twice as long (MM/DD/YYYY hh:mm aa) and includes the AM/PM section,
  // so a future style override in DateTimeField cannot silently re-introduce
  // the bug.
  it.skipIf(isJSDOM)(
    'should not focus any section when clicking on an ancestor outside the field root',
    async () => {
      render(
        <div data-testid="flex-wrapper" style={{ display: 'flex', width: '100%' }}>
          <DateTimeField />
        </div>,
      );

      const { userEvent } = await import('@vitest/browser/context');
      await userEvent.click(screen.getByTestId('flex-wrapper'));

      expect(getCleanedSelectedContent()).to.equal('');
      expect(document.activeElement?.getAttribute('role')).not.to.equal('spinbutton');
    },
  );
});
