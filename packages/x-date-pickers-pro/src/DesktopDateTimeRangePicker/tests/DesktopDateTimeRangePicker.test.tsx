import * as React from 'react';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getFieldSectionsContainer,
  expectFieldValueV7,
} from 'test/utils/pickers';
import { DesktopDateTimeRangePicker } from '../DesktopDateTimeRangePicker';

describe('<DesktopDateTimeRangePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10, 10, 16, 0),
  });

  describe('value selection', () => {
    it('should allow to select range within the same day', () => {
      render(<DesktopDateTimeRangePicker />);

      openPicker({ type: 'date-time-range', variant: 'desktop', initialFocus: 'start' });

      // select start date range
      fireEvent.click(screen.getByRole('gridcell', { name: '11' }));
      fireEvent.click(screen.getByRole('option', { name: '4 hours' }));
      fireEvent.click(screen.getByRole('option', { name: '5 minutes' }));
      fireEvent.click(screen.getByRole('option', { name: 'PM' }));

      // select end date range on the same day
      fireEvent.click(screen.getByRole('gridcell', { name: '11' }));
      fireEvent.click(screen.getByRole('option', { name: '5 hours' }));
      fireEvent.click(screen.getByRole('option', { name: '10 minutes' }));
      fireEvent.click(screen.getByRole('option', { name: 'PM' }));

      const startSectionsContainer = getFieldSectionsContainer(0);
      const endSectionsContainer = getFieldSectionsContainer(1);
      expect(expectFieldValueV7(startSectionsContainer, '01/11/2018 04:05 PM'));
      expect(expectFieldValueV7(endSectionsContainer, '01/11/2018 05:10 PM'));
    });

    it('should use time from `referenceDate` when selecting the day', () => {
      render(
        <DesktopDateTimeRangePicker referenceDate={adapterToUse.date('2022-04-14T14:15:00')} />,
      );

      openPicker({ type: 'date-time-range', variant: 'desktop', initialFocus: 'start' });

      fireEvent.click(screen.getByRole('gridcell', { name: '11' }));

      expect(screen.getByRole('option', { name: '2 hours', selected: true })).not.to.equal(null);
      expect(screen.getByRole('option', { name: '15 minutes', selected: true })).not.to.equal(null);
      expect(screen.getByRole('option', { name: 'PM', selected: true })).not.to.equal(null);
      const startSectionsContainer = getFieldSectionsContainer(0);
      expect(expectFieldValueV7(startSectionsContainer, '04/11/2022 02:15 PM'));
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
