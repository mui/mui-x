import * as React from 'react';
import { userEvent } from '@vitest/browser/context';
import { DateField } from '@mui/x-date-pickers/DateField';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, getCleanedSelectedContent } from 'test/utils/pickers';

// `@vitest/browser/context` throws at import time outside the browser pool, so
// this file is excluded from the jsdom config and only runs in `pnpm test:browser`.

describe('<DateField /> - Selection (browser-only)', () => {
  const { render } = createPickerRenderer();

  describe('Click on an ancestor outside the field root', () => {
    // Chromium delegates focus from a non-contenteditable ancestor click onto
    // the nearest contenteditable descendant — but only for trusted pointer
    // events. We use vitest's CDP-backed `userEvent` here; synthetic events
    // skip default actions and would let the test pass regardless.
    it('should not focus any section when clicking on an ancestor outside the field root', async () => {
      // `display: flex; width: 100%` lets the field keep its natural width and
      // leaves blank space to its right inside the wrapper. The center of the
      // wrapper (where `userEvent.click` clicks) lands in that blank space.
      render(
        <div data-testid="flex-wrapper" style={{ display: 'flex', width: '100%' }}>
          <DateField />
        </div>,
      );

      await userEvent.click(screen.getByTestId('flex-wrapper'));

      expect(getCleanedSelectedContent()).to.equal('');
      expect(document.activeElement?.getAttribute('role')).not.to.equal('spinbutton');
    });
  });
});
