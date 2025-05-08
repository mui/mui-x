import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  openPickerAsync,
  getFieldSectionsContainer,
  expectFieldValueV7,
} from 'test/utils/pickers';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import { SinonFakeTimers, useFakeTimers } from 'sinon';

describe('<MobileDateTimeRangePicker />', () => {
  const { render } = createPickerRenderer();

  describe('value selection', () => {
    // TODO: temporary for vitest. Can move to `vi.useFakeTimers`
    let timer: SinonFakeTimers | null = null;

    beforeEach(() => {
      timer = useFakeTimers({ now: new Date(2018, 0, 10, 10, 16, 0), toFake: ['Date'] });
    });

    afterEach(() => {
      timer?.restore();
    });

    it('should cycle focused views among the visible step after selection', async () => {
      const { user } = render(<MobileDateTimeRangePicker />);

      await openPickerAsync(user, {
        type: 'date-time-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      const day = screen.getByRole('gridcell', { name: '10' });
      expect(day).toHaveFocus();
      await user.click(day);

      await user.click(screen.getByRole('button', { name: 'Next' }));

      await user.click(screen.getByRole('option', { name: '12 hours' }));

      const minutes = screen.getByRole('option', { name: '0 minutes' });
      expect(minutes).toHaveFocus();
      await user.click(minutes);

      const meridiem = screen.getByRole('option', { name: 'AM' });
      expect(meridiem).toHaveFocus();
      const sectionsContainer = getFieldSectionsContainer();
      expectFieldValueV7(sectionsContainer, '01/10/2018 12:00 AM – MM/DD/YYYY hh:mm aa');
    });
  });
});
