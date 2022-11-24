import { expect } from 'chai';
import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { adapterToUse } from 'test/utils/pickers-utils';
import { DescribeValidationTestSuite } from './describeValidation.types';

export const testMonthViewValidation: DescribeValidationTestSuite = (ElementToTest, getOptions) => {
  const { views, componentFamily, render, clock } = getOptions();

  if (componentFamily === 'field' || !views.includes('month')) {
    return;
  }

  describe('month view:', () => {
    const defaultProps = {
      onChange: () => {},
      renderInput: (params) => <TextField {...params} />,
      open: true,
      views: ['month'],
      view: 'month',
      openTo: 'month',
      reduceAnimations: true,
      showToolbar: false,
    };

    it('should apply shouldDisableMonth', function test() {
      render(
        <ElementToTest
          {...defaultProps}
          value={null}
          shouldDisableMonth={(date) => adapterToUse.getMonth(date) === 3}
        />,
      );

      expect(screen.getByText('Apr').getAttribute('disabled')).not.to.equal(null);
      expect(screen.getByText('Jan').getAttribute('disabled')).to.equal(null);
      expect(screen.getByText('May').getAttribute('disabled')).to.equal(null);
    });

    it('should apply disablePast', function test() {
      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date(new Date());
        return <ElementToTest value={now} {...props} />;
      }
      const { setProps } = render(<WithFakeTimer {...defaultProps} disablePast />);

      const nextMonth = adapterToUse.addMonths(now, 1);
      const prevMonth = adapterToUse.addMonths(now, -1);

      expect(screen.getByText(adapterToUse.format(now, 'monthShort'))).not.to.have.attribute(
        'disabled',
      );

      if (!adapterToUse.isSameYear(now, nextMonth)) {
        setProps({ value: nextMonth });
        clock.runToLast();
      }
      expect(screen.getByText(adapterToUse.format(nextMonth, 'monthShort'))).not.to.have.attribute(
        'disabled',
      );

      if (!adapterToUse.isSameYear(prevMonth, nextMonth)) {
        setProps({ value: prevMonth });
        clock.runToLast();
      }
      expect(screen.getByText(adapterToUse.format(prevMonth, 'monthShort'))).to.have.attribute(
        'disabled',
      );

      // TODO: define what appends when value is `null`
    });

    it('should apply disableFuture', function test() {
      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date(new Date());
        return <ElementToTest value={now} {...props} />;
      }
      const { setProps } = render(<WithFakeTimer {...defaultProps} disableFuture />);

      const nextMonth = adapterToUse.addMonths(now, 1);
      const prevMonth = adapterToUse.addMonths(now, -1);

      expect(screen.getByText(adapterToUse.format(now, 'monthShort'))).not.to.have.attribute(
        'disabled',
      );

      if (!adapterToUse.isSameYear(now, nextMonth)) {
        setProps({ value: nextMonth });
        clock.runToLast();
      }
      expect(screen.getByText(adapterToUse.format(nextMonth, 'monthShort'))).to.have.attribute(
        'disabled',
      );

      if (!adapterToUse.isSameYear(prevMonth, nextMonth)) {
        setProps({ value: prevMonth });
        clock.runToLast();
      }
      expect(screen.getByText(adapterToUse.format(prevMonth, 'monthShort'))).not.to.have.attribute(
        'disabled',
      );

      // TODO: define what appends when value is `null`
    });

    it('should apply minDate', function test() {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date(new Date(2019, 5, 15))}
          minDate={adapterToUse.date(new Date(2019, 5, 4))}
        />,
      );

      expect(screen.getByText('Jan').getAttribute('disabled')).not.to.equal(null);
      expect(screen.getByText('May').getAttribute('disabled')).not.to.equal(null);
      expect(screen.getByText('Jun').getAttribute('disabled')).to.equal(null);
      expect(screen.getByText('Jul').getAttribute('disabled')).to.equal(null);
      expect(screen.getByText('Dec').getAttribute('disabled')).to.equal(null);

      // TODO: define what appends when value is `null`
    });

    it('should apply maxDate', function test() {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date(new Date(2019, 5, 15))}
          maxDate={adapterToUse.date(new Date(2019, 5, 4))}
        />,
      );

      expect(screen.getByText('Jan').getAttribute('disabled')).to.equal(null);
      expect(screen.getByText('Jun').getAttribute('disabled')).to.equal(null);
      expect(screen.getByText('Jul').getAttribute('disabled')).not.to.equal(null);
      expect(screen.getByText('Dec').getAttribute('disabled')).not.to.equal(null);

      // TODO: define what appends when value is `null`
    });
  });
};
