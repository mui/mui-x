import { expect } from 'chai';
import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { adapterToUse } from 'test/utils/pickers-utils';

function testDayViewValidation(ElementToTest, propsToTest, getOptions) {
  if (!getOptions().views.includes('day')) {
    return;
  }
  describe('validation in day view:', () => {
    const defaultProps = {
      onChange: () => {},
      renderInput: (params) => <TextField {...params} />,
      open: true,
      view: 'day',
      reduceAnimations: true,
      showToolbar: false,
    };

    if (propsToTest.includes('shouldDisableDate')) {
      it('should apply shouldDisableDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2018, 2, 12))}
            shouldDisableDate={(date) =>
              adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
            }
          />,
        );

        expect(screen.getByText('9')).not.to.have.attribute('disabled');
        expect(screen.getByText('10')).not.to.have.attribute('disabled');
        expect(screen.getByText('11')).to.have.attribute('disabled');
        expect(screen.getByText('12')).to.have.attribute('disabled');
      });
    }

    if (propsToTest.includes('shouldDisableYear')) {
      it('should apply shouldDisableYear', function test() {
        const { render, clock } = getOptions();

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2018, 2, 12))}
            shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
          />,
        );

        expect(screen.getByText('1')).to.have.attribute('disabled');
        expect(screen.getByText('15')).to.have.attribute('disabled');
        expect(screen.getByText('30')).to.have.attribute('disabled');

        setProps({ value: adapterToUse.date(new Date(2019, 0, 1)) });
        clock.runToLast();

        expect(screen.getByText('1')).not.to.have.attribute('disabled');
        expect(screen.getByText('15')).not.to.have.attribute('disabled');
        expect(screen.getByText('30')).not.to.have.attribute('disabled');
      });
    }

    if (propsToTest.includes('shouldDisableMonth')) {
      it('should apply shouldDisableMonth', function test() {
        const { render, clock } = getOptions();

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2018, 2, 12))}
            shouldDisableMonth={(date) => adapterToUse.getMonth(date) === 2}
          />,
        );

        expect(screen.getByText('1')).to.have.attribute('disabled');
        expect(screen.getByText('15')).to.have.attribute('disabled');
        expect(screen.getByText('30')).to.have.attribute('disabled');

        setProps({ value: adapterToUse.date(new Date(2018, 1, 1)) });
        clock.runToLast();

        expect(screen.getByText('1')).not.to.have.attribute('disabled');
        expect(screen.getByText('15')).not.to.have.attribute('disabled');
        expect(screen.getByText('28')).not.to.have.attribute('disabled');
      });
    }

    if (propsToTest.includes('disablePast')) {
      it('should apply disablePast', function test() {
        const { render, clock } = getOptions();

        let now;
        const WithFakeTimer = (props) => {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={now} {...props} />;
        };
        const { setProps } = render(<WithFakeTimer {...defaultProps} disablePast />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(screen.getByText(adapterToUse.format(now, 'dayOfMonth'))).not.to.have.attribute(
          'disabled',
        );

        if (!adapterToUse.isSameMonth(now, tomorrow)) {
          setProps({ value: tomorrow });
          clock.runToLast();
        }
        expect(screen.getByText(adapterToUse.format(tomorrow, 'dayOfMonth'))).not.to.have.attribute(
          'disabled',
        );

        if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
          setProps({ value: yesterday });
          clock.runToLast();
        }
        expect(screen.getByText(adapterToUse.format(yesterday, 'dayOfMonth'))).to.have.attribute(
          'disabled',
        );
      });
    }

    if (propsToTest.includes('disableFuture')) {
      it('should apply disableFuture', function test() {
        const { render, clock } = getOptions();

        let now;
        const WithFakeTimer = (props) => {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={now} {...props} />;
        };
        const { setProps } = render(<WithFakeTimer {...defaultProps} disableFuture />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(screen.getByText(adapterToUse.format(now, 'dayOfMonth'))).not.to.have.attribute(
          'disabled',
        );

        if (!adapterToUse.isSameMonth(now, tomorrow)) {
          setProps({ value: tomorrow });
          clock.runToLast();
        }
        expect(screen.getByText(adapterToUse.format(tomorrow, 'dayOfMonth'))).to.have.attribute(
          'disabled',
        );

        if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
          setProps({ value: yesterday });
          clock.runToLast();
        }
        expect(
          screen.getByText(adapterToUse.format(yesterday, 'dayOfMonth')),
        ).not.to.have.attribute('disabled');
      });
    }

    if (propsToTest.includes('minDate')) {
      it('should apply minDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            minDate={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );
        expect(screen.getByText('1')).to.have.attribute('disabled');
        expect(screen.getByText('3')).to.have.attribute('disabled');
        expect(screen.getByText('4')).not.to.have.attribute('disabled');
        expect(screen.getByText('5')).not.to.have.attribute('disabled');
        expect(screen.getByText('30')).not.to.have.attribute('disabled');
        expect(screen.getByLabelText('Previous month')).to.have.attribute('disabled');
        expect(screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
      });
    }

    if (propsToTest.includes('maxDate')) {
      it('should apply maxDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            maxDate={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );
        expect(screen.getByText('1')).not.to.have.attribute('disabled');
        expect(screen.getByText('3')).not.to.have.attribute('disabled');
        expect(screen.getByText('4')).not.to.have.attribute('disabled');
        expect(screen.getByText('5')).to.have.attribute('disabled');
        expect(screen.getByText('30')).to.have.attribute('disabled');
        expect(screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
        expect(screen.getByLabelText('Next month')).to.have.attribute('disabled');
      });
    }
    if (propsToTest.includes('minTime') && (getOptions().isLegacyPicker || getOptions().withTime)) {
      it('should apply minTime', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            minTime={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );
        expect(screen.getByText('1')).not.to.have.attribute('disabled');
        expect(screen.getByText('3')).not.to.have.attribute('disabled');
        expect(screen.getByText('4')).not.to.have.attribute('disabled');
        expect(screen.getByText('5')).not.to.have.attribute('disabled');
        expect(screen.getByText('30')).not.to.have.attribute('disabled');
      });
    }
    if (propsToTest.includes('maxTime') && (getOptions().isLegacyPicker || getOptions().withTime)) {
      it('should apply maxTime', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            maxTime={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );
        expect(screen.getByText('1')).not.to.have.attribute('disabled');
        expect(screen.getByText('3')).not.to.have.attribute('disabled');
        expect(screen.getByText('4')).not.to.have.attribute('disabled');
        expect(screen.getByText('5')).not.to.have.attribute('disabled');
        expect(screen.getByText('30')).not.to.have.attribute('disabled');
      });
    }

    if (propsToTest.includes('maxDateTime')) {
      it('should apply maxDateTime', function test() {
        const { render, withTime, withDate } = getOptions();
        if (!withDate || !withTime) {
          // prop only available on DateTime pickers
          return;
        }

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            maxDateTime={adapterToUse.date(new Date(2019, 5, 4, 12, 0, 0))}
          />,
        );
        expect(screen.getByText('1')).not.to.have.attribute('disabled');
        expect(screen.getByText('3')).not.to.have.attribute('disabled');
        expect(screen.getByText('4')).not.to.have.attribute('disabled');
        expect(screen.getByText('5')).to.have.attribute('disabled');
        expect(screen.getByText('30')).to.have.attribute('disabled');
      });
    }
    if (propsToTest.includes('minDateTime')) {
      it('should apply minDateTime', function test() {
        const { render, withTime, withDate } = getOptions();
        if (!withDate || !withTime) {
          // prop only available on DateTime pickers
          return;
        }

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            minDateTime={adapterToUse.date(new Date(2019, 5, 4, 12, 0, 0))}
          />,
        );
        expect(screen.getByText('1')).to.have.attribute('disabled');
        expect(screen.getByText('3')).to.have.attribute('disabled');
        expect(screen.getByText('4')).not.to.have.attribute('disabled');
        expect(screen.getByText('5')).not.to.have.attribute('disabled');
        expect(screen.getByText('30')).not.to.have.attribute('disabled');
      });
    }
  });
}

export default testDayViewValidation;
