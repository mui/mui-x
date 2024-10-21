import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { adapterToUse } from 'test/utils/pickers';

const isDisabled = (el: HTMLElement) => el.getAttribute('disabled') !== null;

const testDisabledDate = (day: string, expectedAnswer: boolean[], isSingleCalendar: boolean) => {
  expect(screen.getAllByRole('gridcell', { name: day }).map(isDisabled)).to.deep.equal(
    isSingleCalendar ? expectedAnswer.slice(0, 1) : expectedAnswer,
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

export function testDayViewRangeValidation(ElementToTest, getOptions) {
  describe('validation in day view:', () => {
    const { componentFamily, views, variant = 'desktop' } = getOptions();

    if (!views.includes('day') || componentFamily === 'field') {
      return;
    }

    const isDesktop = variant === 'desktop';
    const includesTimeView = views.includes('hours');

    const defaultProps = {
      referenceDate: adapterToUse.date('2018-03-12'),
      open: true,
      ...(componentFamily === 'field' || componentFamily === 'picker'
        ? { enableAccessibleFieldDOMStructure: true }
        : {}),
    };

    it('should apply shouldDisableDate', function test() {
      const { render } = getOptions();
      render(
        <ElementToTest
          {...defaultProps}
          shouldDisableDate={(date) => adapterToUse.isAfter(date, adapterToUse.date('2018-03-10'))}
        />,
      );

      testDisabledDate('10', [false, true], !isDesktop || includesTimeView);
      testDisabledDate('11', [true, true], !isDesktop || includesTimeView);
    });

    it('should apply disablePast', function test() {
      const { render, clock } = getOptions();

      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date();
        const { referenceDate, ...otherProps } = props;
        return <ElementToTest value={[now, null]} {...otherProps} />;
      }
      const { setProps } = render(<WithFakeTimer {...defaultProps} disablePast />);

      const tomorrow = adapterToUse.addDays(now, 1);
      const yesterday = adapterToUse.addDays(now, -1);

      testDisabledDate(
        adapterToUse.format(now, 'dayOfMonth'),
        [false, false],
        !isDesktop || includesTimeView,
      );
      testDisabledDate(
        adapterToUse.format(tomorrow, 'dayOfMonth'),
        [false, false],
        !isDesktop || includesTimeView,
      );

      if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
        setProps({ value: [yesterday, null] });
        clock.runToLast();
      }
      testDisabledDate(
        adapterToUse.format(yesterday, 'dayOfMonth'),
        [true, false],
        !isDesktop || includesTimeView,
      );
    });

    it('should apply disableFuture', function test() {
      const { render, clock } = getOptions();

      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date();
        const { referenceDate, ...otherProps } = props;
        return <ElementToTest value={[now, null]} {...otherProps} />;
      }
      const { setProps } = render(<WithFakeTimer {...defaultProps} disableFuture />);

      const tomorrow = adapterToUse.addDays(now, 1);
      const yesterday = adapterToUse.addDays(now, -1);

      testDisabledDate(
        adapterToUse.format(now, 'dayOfMonth'),
        [false, true],
        !isDesktop || includesTimeView,
      );
      testDisabledDate(
        adapterToUse.format(tomorrow, 'dayOfMonth'),
        [true, true],
        !isDesktop || includesTimeView,
      );

      if (!adapterToUse.isSameMonth(yesterday, tomorrow)) {
        setProps({ value: [yesterday, null] });
        clock.runToLast();
      }
      testDisabledDate(
        adapterToUse.format(yesterday, 'dayOfMonth'),
        [false, true],
        !isDesktop || includesTimeView,
      );
    });

    it('should apply minDate', function test() {
      const { render } = getOptions();

      render(
        <ElementToTest
          {...defaultProps}
          referenceDate={adapterToUse.date('2019-06-15')}
          minDate={adapterToUse.date('2019-06-04')}
        />,
      );

      testDisabledDate('1', [true, false], !isDesktop || includesTimeView);
      testDisabledDate('3', [true, false], !isDesktop || includesTimeView);
      testDisabledDate('4', [false, false], !isDesktop || includesTimeView);
      testDisabledDate('15', [false, false], !isDesktop || includesTimeView);

      testMonthSwitcherAreDisable([true, false]);
    });

    it('should apply maxDate', function test() {
      const { render } = getOptions();

      render(
        <ElementToTest
          {...defaultProps}
          referenceDate={adapterToUse.date('2019-06-15')}
          maxDate={adapterToUse.date('2019-06-04')}
        />,
      );

      testDisabledDate('1', [false, true], !isDesktop || includesTimeView);
      testDisabledDate('4', [false, true], !isDesktop || includesTimeView);
      testDisabledDate('5', [true, true], !isDesktop || includesTimeView);
      testDisabledDate('15', [true, true], !isDesktop || includesTimeView);

      testMonthSwitcherAreDisable([false, true]);
    });
  });
}
