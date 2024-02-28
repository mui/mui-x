import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui-internal/test-utils';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { DesktopDateTimeRangePicker } from '../DesktopDateTimeRangePicker';

describe('<DesktopDateTimeRangePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10, 10, 16, 0),
  });

  describe('disabled dates', () => {
    it('should respect the "disablePast" prop', () => {
      render(<DesktopDateTimeRangePicker enableAccessibleFieldDOMStructure disablePast open />);

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
          enableAccessibleFieldDOMStructure
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
      render(<DesktopDateTimeRangePicker enableAccessibleFieldDOMStructure disableFuture open />);

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
          enableAccessibleFieldDOMStructure
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
          enableAccessibleFieldDOMStructure
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
          enableAccessibleFieldDOMStructure
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
