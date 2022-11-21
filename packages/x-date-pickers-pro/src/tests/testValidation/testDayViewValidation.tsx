import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { adapterToUse } from 'test/utils/pickers-utils';

const isDisable = (el: HTMLElement) => el.getAttribute('disabled') !== null;

const testDisbaledDate = (day: string, expectedAnswer: boolean[], isDesktop: boolean) => {
  expect(screen.getAllByText(day).map(isDisable)).to.deep.equal(
    isDesktop ? expectedAnswer : expectedAnswer.slice(0, 1),
  );
};

const testMonthSwitcherAreDisable = (areDisable: [boolean, boolean]) => {
  const prevMonthElement = screen.getAllByLabelText('Previous month')[0];

  const nbCalendars = screen.getAllByLabelText('Next month').length;
  const nextMonthElement = screen.getAllByLabelText('Next month')[nbCalendars - 1];
  // Test prev month
  if (areDisable[0]) {
    expect(prevMonthElement).to.have.attribute('disabled');
  } else {
    expect(prevMonthElement).not.to.have.attribute('disabled');
  }
  // Test next month
  if (areDisable[1]) {
    expect(nextMonthElement).to.have.attribute('disabled');
  } else {
    expect(nextMonthElement).not.to.have.attribute('disabled');
  }
};

const dateParser = (value: (null | number[])[]) => {
  return value.map((date) => (date === null ? date : adapterToUse.date(new Date(...(date as [])))));
};

function testDayViewValidation(ElementToTest, propsToTest, getOptions) {
  if (!getOptions().withDate) {
    return;
  }
  describe('validation in day view:', () => {
    const { isLegacyPicker, views, mode = 'desktop' } = getOptions();

    if (!views.includes('day')) {
      return;
    }

    const isDesktop = mode === 'desktop';

    const defaultProps = isLegacyPicker
      ? {
          open: true,
          defaultCalendarMonth: adapterToUse.date(new Date(2018, 2, 12)),
          value: [null, null],
          onChange: () => {},
          renderInput: (startProps, endProps) => (
            <div>
              <TextField {...startProps} />
              <TextField {...endProps} />
            </div>
          ),
        }
      : {
          defaultCalendarMonth: adapterToUse.date(new Date(2018, 2, 12)),
          open: true,
        };

    if (propsToTest.includes('shouldDisableDate')) {
      it('should apply shouldDisableDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            shouldDisableDate={(date) =>
              adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
            }
          />,
        );

        testDisbaledDate('10', [false, true], isDesktop);
        testDisbaledDate('11', [true, true], isDesktop);
      });
    }

    if (propsToTest.includes('shouldDisableYear')) {
      it('should apply shouldDisableYear', function test() {
        if (!isLegacyPicker) {
          return;
        }
        const { render, clock } = getOptions();

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
          />,
        );

        testDisbaledDate('10', [true, true], isDesktop);

        setProps({
          value: dateParser([
            [2018, 11, 15],
            [2019, 0, 13],
          ]),
        });
        clock.runToLast();
        testDisbaledDate('10', [true, false], isDesktop);

        setProps({
          value: dateParser([
            [2019, 5, 15],
            [2019, 5, 19],
          ]),
        });
        clock.runToLast();
        testDisbaledDate('10', [false, false], isDesktop);
      });
    }

    if (propsToTest.includes('shouldDisableMonth')) {
      it('should apply shouldDisableMonth', function test() {
        if (!isLegacyPicker) {
          return;
        }
        const { render, clock } = getOptions();

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            shouldDisableMonth={(date) => adapterToUse.getMonth(date) === 2}
          />,
        );

        testDisbaledDate('1', [true, false], isDesktop);
        testDisbaledDate('15', [true, false], isDesktop);
        testDisbaledDate('30', [true, false], isDesktop);

        setProps({
          value: dateParser([
            [2018, 4, 10],
            [2018, 5, 13],
          ]),
        });
        clock.runToLast();

        testDisbaledDate('1', [false, false], isDesktop);
        testDisbaledDate('15', [false, false], isDesktop);
        testDisbaledDate('30', [false, false], isDesktop);
      });
    }

    if (propsToTest.includes('disablePast')) {
      it('should apply disablePast', function test() {
        const { render, clock } = getOptions();

        let now;
        function WithFakeTimer(props) {
          now = adapterToUse.date(new Date());
          const { defaultCalendarMonth, ...otherProps } = props;
          return <ElementToTest value={[now, null]} {...otherProps} />;
        }
        const { setProps } = render(<WithFakeTimer {...defaultProps} disablePast />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        testDisbaledDate(adapterToUse.format(now, 'dayOfMonth'), [false, false], isDesktop);
        testDisbaledDate(adapterToUse.format(tomorrow, 'dayOfMonth'), [false, false], isDesktop);

        if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
          setProps({ value: [yesterday, null] });
          clock.runToLast();
        }
        testDisbaledDate(adapterToUse.format(yesterday, 'dayOfMonth'), [true, false], isDesktop);
      });
    }

    if (propsToTest.includes('disableFuture')) {
      it('should apply disableFuture', function test() {
        const { render, clock } = getOptions();

        let now;
        function WithFakeTimer(props) {
          now = adapterToUse.date(new Date());
          const { defaultCalendarMonth, ...otherProps } = props;
          return <ElementToTest value={[now, null]} {...otherProps} />;
        }
        const { setProps } = render(<WithFakeTimer {...defaultProps} disableFuture />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        testDisbaledDate(adapterToUse.format(now, 'dayOfMonth'), [false, true], isDesktop);
        testDisbaledDate(adapterToUse.format(tomorrow, 'dayOfMonth'), [true, true], isDesktop);

        if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
          setProps({ value: [yesterday, null] });
          clock.runToLast();
        }
        testDisbaledDate(adapterToUse.format(yesterday, 'dayOfMonth'), [false, true], isDesktop);
      });
    }

    if (propsToTest.includes('minDate')) {
      it('should apply minDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            defaultCalendarMonth={adapterToUse.date(new Date(2019, 5, 15))}
            minDate={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );

        testDisbaledDate('1', [true, false], isDesktop);
        testDisbaledDate('3', [true, false], isDesktop);
        testDisbaledDate('4', [false, false], isDesktop);
        testDisbaledDate('15', [false, false], isDesktop);

        testMonthSwitcherAreDisable([true, false]);
      });
    }

    if (propsToTest.includes('maxDate')) {
      it('should apply maxDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            defaultCalendarMonth={adapterToUse.date(new Date(2019, 5, 15))}
            maxDate={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );

        testDisbaledDate('1', [false, true], isDesktop);
        testDisbaledDate('4', [false, true], isDesktop);
        testDisbaledDate('5', [true, true], isDesktop);
        testDisbaledDate('15', [true, true], isDesktop);

        testMonthSwitcherAreDisable([false, true]);
      });
    }
  });
}

export default testDayViewValidation;
