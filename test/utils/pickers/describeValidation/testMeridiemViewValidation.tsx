import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { adapterToUse } from 'test/utils/pickers';
import { DescribeValidationTestSuite } from './describeValidation.types';

export const testMeridiemViewValidation: DescribeValidationTestSuite = (
  ElementToTest,
  getOption,
) => {
  const ampmBtn = (testId: string, disabled: boolean) =>
    disabled
      ? expect(screen.getByTestId(testId)).to.have.attribute('disabled')
      : expect(screen.getByTestId(testId)).not.to.have.attribute('disabled');

  const { componentFamily, views, render, variant } = getOption();
  const getEndOfMorning = (date: any) =>
    adapterToUse.addSeconds(
      adapterToUse.addMinutes(adapterToUse.addHours(adapterToUse.startOfDay(date), 11), 59),
      59,
    );

  describe.skipIf(
    !views.includes('minutes') ||
      componentFamily !== 'picker' ||
      variant === 'desktop' ||
      views.includes('year'),
  )('mobile meridiem view:', () => {
    const defaultProps = {
      onChange: () => {},
      open: true,
      view: 'minutes',
      openTo: 'minutes',
    };
    const amTestId: string = 'toolbar-am-btn';
    const pmTestId: string = 'toolbar-pm-btn';

    it('should apply disablePast in toolbar', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disablePast />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmBtn(amTestId, false);
        ampmBtn(pmTestId, false);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmBtn(amTestId, true);
        ampmBtn(pmTestId, false);
      }
    });

    it('should apply disableFuture in toolbar', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disableFuture />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmBtn(amTestId, false);
        ampmBtn(pmTestId, true);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmBtn(amTestId, false);
        ampmBtn(pmTestId, false);
      }
    });

    it('should apply maxTime in toolbar', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let maxTime = adapterToUse.date('2025-06-15T13:10:00');
      const endOfMorning = getEndOfMorning(value);
      const { setProps } = render(
        <ElementToTest {...defaultProps} value={value} maxTime={maxTime} />,
      );
      if (adapterToUse.isAfter(maxTime, endOfMorning)) {
        ampmBtn(amTestId, false);
        ampmBtn(pmTestId, false);
      }
      maxTime = adapterToUse.setHours(maxTime, 5);
      setProps({ maxTime });
      if (adapterToUse.isBefore(maxTime, endOfMorning)) {
        ampmBtn(amTestId, false);
        ampmBtn(pmTestId, true);
      }
    });

    it('should apply minTime in toolbar', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let minTime = adapterToUse.date('2025-06-15T13:10:00');
      const { setProps } = render(
        <ElementToTest {...defaultProps} value={value} minTime={minTime} />,
      );
      const endOfMorning = getEndOfMorning(value);
      if (adapterToUse.isAfter(minTime, endOfMorning)) {
        ampmBtn(amTestId, true);
        ampmBtn(pmTestId, false);
      }
      minTime = adapterToUse.setHours(minTime, 5);
      setProps({ minTime });
      if (adapterToUse.isBefore(minTime, endOfMorning)) {
        ampmBtn(amTestId, false);
        ampmBtn(pmTestId, false);
      }
    });
    const inClockProps = { ...defaultProps, ampmInClock: true };
    const clockAmTestId: string = 'in-clock-am-btn';
    const clokcPmTestId: string = 'in-clock-pm-btn';
    it('should apply disablePast in clock', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...inClockProps} disablePast />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmBtn(clockAmTestId, false);
        ampmBtn(clokcPmTestId, false);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmBtn(clockAmTestId, true);
        ampmBtn(clokcPmTestId, false);
      }
    });

    it('should apply disableFuture in clock', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...inClockProps} disableFuture />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmBtn(clockAmTestId, false);
        ampmBtn(clokcPmTestId, true);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmBtn(clockAmTestId, false);
        ampmBtn(clokcPmTestId, false);
      }
    });

    it('should apply maxTime in clock', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let maxTime = adapterToUse.date('2025-06-15T13:10:00');
      const endOfMorning = getEndOfMorning(value);
      const { setProps } = render(
        <ElementToTest {...inClockProps} value={value} maxTime={maxTime} />,
      );
      if (adapterToUse.isAfter(maxTime, endOfMorning)) {
        ampmBtn(clockAmTestId, false);
        ampmBtn(clokcPmTestId, false);
      }
      maxTime = adapterToUse.setHours(maxTime, 5);
      setProps({ maxTime });
      if (adapterToUse.isBefore(maxTime, endOfMorning)) {
        ampmBtn(clockAmTestId, false);
        ampmBtn(clokcPmTestId, true);
      }
    });

    it('should apply minTime in clock', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let minTime = adapterToUse.date('2025-06-15T13:10:00');
      const { setProps } = render(
        <ElementToTest {...inClockProps} value={value} minTime={minTime} />,
      );
      const endOfMorning = getEndOfMorning(value);
      if (adapterToUse.isAfter(minTime, endOfMorning)) {
        ampmBtn(clockAmTestId, true);
        ampmBtn(clokcPmTestId, false);
      }
      minTime = adapterToUse.setHours(minTime, 5);
      setProps({ minTime });
      if (adapterToUse.isBefore(minTime, endOfMorning)) {
        ampmBtn(clockAmTestId, false);
        ampmBtn(clokcPmTestId, false);
      }
    });
  });

  describe.skipIf(
    !views.includes('meridiem') || componentFamily !== 'picker' || variant !== 'desktop',
  )('desktop meridiem view', () => {
    const defaultProps = {
      onChange: () => {},
      open: true,
      view: 'meridiem',
      openTo: 'meridiem',
    };

    const ampmOption = (am: boolean, disabled: boolean) =>
      disabled
        ? expect(screen.getByRole('option', { name: am ? 'AM' : 'PM' })).to.have.attribute(
            'aria-disabled',
          )
        : expect(screen.getByRole('option', { name: am ? 'AM' : 'PM' })).not.to.have.attribute(
            'aria-disabled',
          );

    it('should apply disablePast', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disablePast />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmOption(true, true);
        ampmOption(false, false);
      }
    });

    it('should apply disableFuture', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disableFuture />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, true);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      }
    });

    it('should apply maxTime', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let maxTime = adapterToUse.date('2025-06-15T13:10:00');
      const endOfMorning = getEndOfMorning(value);
      const { setProps } = render(
        <ElementToTest {...defaultProps} value={value} maxTime={maxTime} />,
      );
      if (adapterToUse.isAfter(maxTime, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      }
      maxTime = adapterToUse.setHours(maxTime, 5);
      setProps({ maxTime });
      if (adapterToUse.isBefore(maxTime, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, true);
      }
    });

    it('should apply minTime', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let minTime = adapterToUse.date('2025-06-15T13:10:00');
      const { setProps } = render(
        <ElementToTest {...defaultProps} value={value} minTime={minTime} />,
      );
      const endOfMorning = getEndOfMorning(value);
      if (adapterToUse.isAfter(minTime, endOfMorning)) {
        ampmOption(true, true);
        ampmOption(false, false);
      }
      minTime = adapterToUse.setHours(minTime, 5);
      setProps({ minTime });
      if (adapterToUse.isBefore(minTime, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      }
    });
  });

  describe.skipIf(
    !views.includes('minutes') ||
      !views.includes('year') ||
      componentFamily !== 'picker' ||
      variant === 'desktop',
  )('mobile date time meridiem view', () => {
    const defaultProps = {
      onChange: () => {},
      open: true,
      view: 'meridiem',
      openTo: 'meridiem',
    };

    const ampmOption = (am: boolean, disabled: boolean) =>
      disabled
        ? expect(screen.getByRole('option', { name: am ? 'AM' : 'PM' })).to.have.attribute(
            'aria-disabled',
          )
        : expect(screen.getByRole('option', { name: am ? 'AM' : 'PM' })).not.to.have.attribute(
            'aria-disabled',
          );

    it('should apply disablePast', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disablePast />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmOption(true, true);
        ampmOption(false, false);
      }
    });

    it('should apply disableFuture', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disableFuture />);
      const startOfDay = adapterToUse.startOfDay(now);
      const endOfMorning = getEndOfMorning(startOfDay);
      if (adapterToUse.isBefore(now, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, true);
      } else if (adapterToUse.isAfter(now, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      }
    });

    it('should apply maxTime', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let maxTime = adapterToUse.date('2025-06-15T13:10:00');
      const endOfMorning = getEndOfMorning(value);
      const { setProps } = render(
        <ElementToTest {...defaultProps} value={value} maxTime={maxTime} />,
      );
      if (adapterToUse.isAfter(maxTime, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      }
      maxTime = adapterToUse.setHours(maxTime, 5);
      setProps({ maxTime });
      if (adapterToUse.isBefore(maxTime, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, true);
      }
    });

    it('should apply minTime', () => {
      const value = adapterToUse.date('2025-06-15T14:00:00');
      let minTime = adapterToUse.date('2025-06-15T13:10:00');
      const { setProps } = render(
        <ElementToTest {...defaultProps} value={value} minTime={minTime} />,
      );
      const endOfMorning = getEndOfMorning(value);
      if (adapterToUse.isAfter(minTime, endOfMorning)) {
        ampmOption(true, true);
        ampmOption(false, false);
      }
      minTime = adapterToUse.setHours(minTime, 5);
      setProps({ minTime });
      if (adapterToUse.isBefore(minTime, endOfMorning)) {
        ampmOption(true, false);
        ampmOption(false, false);
      }
    });
  });
};
