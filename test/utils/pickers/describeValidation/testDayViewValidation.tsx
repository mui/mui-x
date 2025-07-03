import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { adapterToUse } from 'test/utils/pickers';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
import { DescribeValidationTestSuite } from './describeValidation.types';

export const testDayViewValidation: DescribeValidationTestSuite = (ElementToTest, getOptions) => {
  const { componentFamily, views, render, withDate, withTime } = getOptions();

  describe.skipIf(componentFamily === 'field' || !views.includes('day'))('day view:', () => {
    const defaultProps = {
      onChange: () => {},
      open: true,
      view: 'day',
      reduceAnimations: true,
      slotProps: { toolbar: { hidden: true } },
    };

    it('should apply shouldDisableDate', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2018-03-12')}
          shouldDisableDate={(date: any) =>
            adapterToUse.isAfter(date, adapterToUse.date('2018-03-10'))
          }
        />,
      );

      expect(screen.getByRole('gridcell', { name: '9' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '10' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '11' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '12' })).to.have.attribute('disabled');
    });

    it('should apply shouldDisableYear', () => {
      const { setProps } = render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2018-03-12')}
          shouldDisableYear={(date: any) => adapterToUse.getYear(date) === 2018}
        />,
      );

      expect(screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '15' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');

      setProps({ value: adapterToUse.date('2019-01-01') });

      expect(screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '15' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).not.to.have.attribute('disabled');
    });

    it('should apply shouldDisableMonth', () => {
      const { setProps } = render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2018-03-12')}
          shouldDisableMonth={(date: any) => adapterToUse.getMonth(date) === 2}
        />,
      );

      expect(screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '15' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');

      setProps({ value: adapterToUse.date('2018-02-01') });

      expect(screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '15' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '28' })).not.to.have.attribute('disabled');
    });

    describe('with fake timers', () => {
      // TODO: temporary for vitest. Can move to `vi.useFakeTimers`
      let timer: SinonFakeTimers | null = null;
      beforeEach(() => {
        timer = useFakeTimers({ now: new Date(2018, 0, 1), toFake: ['Date'] });
      });
      afterEach(() => {
        timer?.restore();
      });
      it('should apply disablePast', () => {
        const now = adapterToUse.date();
        function WithFakeTimer(props: any) {
          return <ElementToTest value={now} {...props} />;
        }
        const { setProps } = render(<WithFakeTimer {...defaultProps} disablePast />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(
          screen.getByRole('gridcell', { name: adapterToUse.format(now, 'dayOfMonth') }),
        ).not.to.have.attribute('disabled');

        if (!adapterToUse.isSameMonth(now, tomorrow)) {
          setProps({ value: tomorrow });
        }
        expect(
          screen.getByRole('gridcell', { name: adapterToUse.format(tomorrow, 'dayOfMonth') }),
        ).not.to.have.attribute('disabled');

        if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
          setProps({ value: yesterday });
        }
        expect(
          screen.getByRole('gridcell', { name: adapterToUse.format(yesterday, 'dayOfMonth') }),
        ).to.have.attribute('disabled');
      });

      it('should apply disableFuture', () => {
        const now = adapterToUse.date();
        function WithFakeTimer(props: any) {
          return <ElementToTest value={now} {...props} />;
        }
        const { setProps } = render(<WithFakeTimer {...defaultProps} disableFuture />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(
          screen.getByRole('gridcell', { name: adapterToUse.format(now, 'dayOfMonth') }),
        ).not.to.have.attribute('disabled');

        if (!adapterToUse.isSameMonth(now, tomorrow)) {
          setProps({ value: tomorrow });
        }
        expect(
          screen.getByRole('gridcell', { name: adapterToUse.format(tomorrow, 'dayOfMonth') }),
        ).to.have.attribute('disabled');

        if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
          setProps({ value: yesterday });
        }
        expect(
          screen.getByRole('gridcell', { name: adapterToUse.format(yesterday, 'dayOfMonth') }),
        ).not.to.have.attribute('disabled');
      });
    });

    it('should apply minDate', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2019-06-15')}
          minDate={adapterToUse.date('2019-06-04')}
        />,
      );
      expect(screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '3' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '5' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Previous month')).to.have.attribute('disabled');
      expect(screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
    });

    it('should apply maxDate', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2019-06-15')}
          maxDate={adapterToUse.date('2019-06-04')}
        />,
      );
      expect(screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '3' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');
      expect(screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Next month')).to.have.attribute('disabled');
    });

    // prop only available on DateTime pickers
    it.skipIf(!withDate || !withTime)('should apply maxDateTime', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2019-06-15')}
          maxDateTime={adapterToUse.date('2019-06-04T12:00:00')}
        />,
      );
      expect(screen.getByRole('gridcell', { name: '1' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '3' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).to.have.attribute('disabled');
    });

    // prop only available on DateTime pickers
    it.skipIf(!withDate || !withTime)('should apply minDateTime', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2019-06-15')}
          minDateTime={adapterToUse.date('2019-06-04T12:00:00')}
        />,
      );
      expect(screen.getByRole('gridcell', { name: '1' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '3' })).to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '4' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '5' })).not.to.have.attribute('disabled');
      expect(screen.getByRole('gridcell', { name: '30' })).not.to.have.attribute('disabled');
    });
  });
};
