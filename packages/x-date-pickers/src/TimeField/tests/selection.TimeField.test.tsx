import * as React from 'react';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, getCleanedSelectedContent } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';

describe('<TimeField /> - Selection', () => {
  const { render } = createPickerRenderer();

  // Coverage check: the Chromium focus-delegation gate lives at the shared
  // `PickersInputBase` level so DateField, TimeField, and DateTimeField all
  // share it. This duplicates the DateField browser test against a TimeField
  // (different section layout: HH/mm/aa instead of MM/DD/YYYY) so a future
  // style override in TimeField cannot silently re-introduce the bug.
  it.skipIf(isJSDOM)(
    'should not focus any section when clicking on an ancestor outside the field root',
    async () => {
      render(
        <div data-testid="flex-wrapper" style={{ display: 'flex', width: '100%' }}>
          <TimeField />
        </div>,
      );

      const { userEvent } = await import('@vitest/browser/context');
      await userEvent.click(screen.getByTestId('flex-wrapper'));

      expect(getCleanedSelectedContent()).to.equal('');
      expect(document.activeElement?.getAttribute('role')).not.to.equal('spinbutton');
    },
  );
});
