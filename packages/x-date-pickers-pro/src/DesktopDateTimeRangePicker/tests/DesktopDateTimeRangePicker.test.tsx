import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  openPickerAsync,
  getFieldSectionsContainer,
  expectFieldValueV7,
} from 'test/utils/pickers';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { DesktopDateTimeRangePicker } from '../DesktopDateTimeRangePicker';

describe('<DesktopDateTimeRangePicker />', () => {
  const { render } = createPickerRenderer();

  // TODO: temporary for vitest. Can move to `vi.useFakeTimers`
  let timer: SinonFakeTimers | null = null;

  beforeEach(() => {
    timer = useFakeTimers({ now: new Date(2018, 0, 10, 10, 16, 0), toFake: ['Date'] });
  });

  afterEach(() => {
    timer?.restore();
  });

  describe('value selection', () => {
    it('should allow to select range within the same day', async () => {
      const { user } = render(<DesktopDateTimeRangePicker />);

      await openPickerAsync(user, {
        type: 'date-time-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      // select start date range
      await user.click(screen.getByRole('gridcell', { name: '11' }));
      await user.click(screen.getByRole('option', { name: '4 hours' }));
      await user.click(screen.getByRole('option', { name: '5 minutes' }));
      await user.click(screen.getByRole('option', { name: 'PM' }));
      await user.click(screen.getByRole('button', { name: 'Next' }));

      // select end date range on the same day
      await user.click(screen.getByRole('gridcell', { name: '11' }));
      await user.click(screen.getByRole('option', { name: '5 hours' }));
      await user.click(screen.getByRole('option', { name: '10 minutes' }));
      await user.click(screen.getByRole('option', { name: 'PM' }));

      const sectionsContainer = getFieldSectionsContainer();
      expectFieldValueV7(sectionsContainer, '01/11/2018 04:05 PM – 01/11/2018 05:10 PM');
    });

    it('should use time from `referenceDate` when selecting the day', async () => {
      const { user } = render(
        <DesktopDateTimeRangePicker referenceDate={adapterToUse.date('2022-04-14T14:15:00')} />,
      );

      await openPickerAsync(user, {
        type: 'date-time-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      await user.click(screen.getByRole('gridcell', { name: '11' }));

      expect(screen.getByRole('option', { name: '2 hours', selected: true })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '15 minutes', selected: true })).not.to.equal(null);
      expect(screen.getByRole('option', { name: 'PM', selected: true })).not.to.equal(null);
      const sectionsContainer = getFieldSectionsContainer();
      expectFieldValueV7(sectionsContainer, '04/11/2022 02:15 PM – MM/DD/YYYY hh:mm aa');
    });

    it('should cycle focused views among the visible step after selection', () => {
      render(<DesktopDateTimeRangePicker />);

      openPicker({ type: 'date-time-range', initialFocus: 'start', fieldType: 'single-input' });

      const day = screen.getByRole('gridcell', { name: '10' });
      expect(day).toHaveFocus();
      fireEvent.click(day);

      const hours = screen.getByRole('option', { name: '12 hours' });
      expect(hours).toHaveFocus();
      fireEvent.click(hours);

      const minutes = screen.getByRole('option', { name: '0 minutes' });
      expect(minutes).toHaveFocus();
      fireEvent.click(minutes);

      const meridiem = screen.getByRole('option', { name: 'AM' });
      expect(meridiem).toHaveFocus();
      const sectionsContainer = getFieldSectionsContainer();
      expectFieldValueV7(sectionsContainer, '01/10/2018 12:00 AM – MM/DD/YYYY hh:mm aa');
    });
  });

  describe('disabled dates', () => {
    it('should respect the "disablePast" prop', () => {
      render(<DesktopDateTimeRangePicker disablePast open />);

      expect(screen.getByRole('gridcell', { name: '8' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).not.to.have.attribute('disabled');

      expect(screen.getByRole('option', { name: '9 hours' })).to.have.attribute(
        'aria-disabled',
        'true',
      );
      expect(screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute(
        'aria-disabled',
      );

      expect(screen.getByRole('option', { name: '15 minutes' })).to.have.attribute(
        'aria-disabled',
        'true',
      );
    });

    // Asserts correct behavior: https://github.com/mui/mui-x/issues/12048
    it('should respect the "disablePast" prop combined with "referenceDate"', () => {
      render(
        <DesktopDateTimeRangePicker
          disablePast
          open
          referenceDate={adapterToUse.date('2018-01-11')}
        />,
      );

      expect(screen.getByRole('gridcell', { name: '8' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).not.to.have.attribute('disabled');

      expect(screen.getByRole('option', { name: '9 hours' })).not.to.have.attribute(
        'aria-disabled',
      );
      expect(screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute(
        'aria-disabled',
      );

      expect(screen.getByRole('option', { name: '15 minutes' })).not.to.have.attribute(
        'aria-disabled',
      );
    });

    it('should respect the "disableFuture" prop', () => {
      render(<DesktopDateTimeRangePicker disableFuture open />);

      expect(screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '12' })).to.have.attribute('disabled');

      expect(screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute(
        'aria-disabled',
      );
      expect(screen.getByRole('option', { name: '11 hours' })).to.have.attribute(
        'aria-disabled',
        'true',
      );
    });

    // Asserts correct behavior: https://github.com/mui/mui-x/issues/12048
    it('should respect the "disableFuture" prop combined with "referenceDate"', () => {
      render(
        <DesktopDateTimeRangePicker
          disableFuture
          open
          referenceDate={adapterToUse.date('2018-01-09')}
        />,
      );

      expect(screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '12' })).to.have.attribute('disabled');

      expect(screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute(
        'aria-disabled',
      );
      expect(screen.getByRole('option', { name: '11 hours' })).not.to.have.attribute(
        'aria-disabled',
      );
    });

    it('should respect the "minDateTime" prop', () => {
      render(
        <DesktopDateTimeRangePicker
          minDateTime={adapterToUse.date('2018-01-10T10:16:00')}
          referenceDate={adapterToUse.date('2018-01-10T10:00:00')}
          open
        />,
      );

      expect(screen.getByRole('gridcell', { name: '8' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).not.to.have.attribute('disabled');

      expect(screen.getByRole('option', { name: '9 hours' })).to.have.attribute(
        'aria-disabled',
        'true',
      );
      expect(screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute(
        'aria-disabled',
      );

      expect(screen.getByRole('option', { name: '15 minutes' })).to.have.attribute(
        'aria-disabled',
        'true',
      );
      expect(screen.getByRole('option', { name: '20 minutes' })).not.to.have.attribute(
        'aria-disabled',
      );
    });

    it('should respect the "maxDateTime" prop', () => {
      render(
        <DesktopDateTimeRangePicker
          maxDateTime={adapterToUse.date('2018-01-10T10:16:00')}
          referenceDate={adapterToUse.date('2018-01-10T10:00:00')}
          open
        />,
      );

      expect(screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');

      expect(screen.getByRole('option', { name: '10 hours' })).not.to.have.attribute(
        'aria-disabled',
      );
      expect(screen.getByRole('option', { name: '11 hours' })).to.have.attribute(
        'aria-disabled',
        'true',
      );

      expect(screen.getByRole('option', { name: '15 minutes' })).not.to.have.attribute(
        'aria-disabled',
      );
      expect(screen.getByRole('option', { name: '20 minutes' })).to.have.attribute(
        'aria-disabled',
        'true',
      );
    });
  });
});
