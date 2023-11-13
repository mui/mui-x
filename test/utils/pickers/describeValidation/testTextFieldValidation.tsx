import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui-internal/test-utils';
import { TimeView } from '@mui/x-date-pickers/models';
import { adapterToUse } from 'test/utils/pickers';
import { DescribeValidationTestSuite } from './describeValidation.types';

export const testTextFieldValidation: DescribeValidationTestSuite = (ElementToTest, getOptions) => {
  const { componentFamily, render, withDate, withTime } = getOptions();

  if (!['picker', 'field'].includes(componentFamily)) {
    return;
  }

  describe('text field:', () => {
    it('should apply shouldDisableDate', function test() {
      if (['picker', 'field'].includes(componentFamily) && !withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2018-03-12')}
          shouldDisableDate={(date) =>
            adapterToUse.isAfter(date, adapterToUse.date('2018-03-10'))
          }
        />,
      );

      if (withDate) {
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableDate');

        setProps({ value: adapterToUse.date('2018-03-09') });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      } else {
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        expect(onErrorMock.callCount).to.equal(0);
      }
    });

    it('should apply shouldDisableYear', function test() {
      if (!withDate) {
        // Early return to remove when DateTimePickers will support those props
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2018-03-12')}
          shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableYear');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-09') });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
    });

    it('should apply shouldDisableMonth', function test() {
      if (!withDate) {
        // Early return to remove when DateTimePickers will support those props
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          shouldDisableMonth={(date) => adapterToUse.getMonth(date) === 2}
          value={adapterToUse.date('2018-03-12')}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableMonth');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-09') });

      expect(onErrorMock.callCount).to.equal(1);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2018-04-09') });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
    });

    it('should apply shouldDisableClock', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          shouldDisableClock={(value: number) => value === 10}
          value={adapterToUse.date('2018-03-12T10:05:00')}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableClock-hours');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-12T09:05:00') });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      setProps({ value: adapterToUse.date('2018-03-12T09:10:00') });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableClock-minutes');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2018-03-12T09:09:00') });

      expect(onErrorMock.callCount).to.equal(4);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      setProps({ value: adapterToUse.date('2018-03-12T09:09:10') });

      expect(onErrorMock.callCount).to.equal(5);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableClock-seconds');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
    });

    it('should apply shouldDisableTime', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          shouldDisableTime={(value, view: TimeView) => {
            let comparingValue = adapterToUse.getHours(value);
            if (view === 'minutes') {
              comparingValue = adapterToUse.getMinutes(value);
            } else if (view === 'seconds') {
              comparingValue = adapterToUse.getSeconds(value);
            }
            return comparingValue === 10;
          }}
          value={adapterToUse.date('2018-03-12T10:05:00')}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableTime-hours');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-12T09:05:00') });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      setProps({ value: adapterToUse.date('2018-03-12T09:10:00') });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableTime-minutes');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2018-03-12T09:09:00') });

      expect(onErrorMock.callCount).to.equal(4);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      setProps({ value: adapterToUse.date('2018-03-12T09:09:10') });

      expect(onErrorMock.callCount).to.equal(5);
      expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableTime-seconds');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
    });

    it('should apply disablePast', function test() {
      if (!withDate) {
        return;
      }

      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date();
        return <ElementToTest value={now} {...props} />;
      }

      const onErrorMock = spy();
      const { setProps } = render(<WithFakeTimer disablePast onError={onErrorMock} />);

      const tomorrow = adapterToUse.addDays(now, 1);
      const yesterday = adapterToUse.addDays(now, -1);

      expect(onErrorMock.callCount).to.equal(0);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      setProps({ value: yesterday });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('disablePast');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: tomorrow });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
    });

    it('should apply disableFuture', function test() {
      if (!withDate) {
        return;
      }

      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date();
        return <ElementToTest value={now} {...props} />;
      }

      const onErrorMock = spy();
      const { setProps } = render(<WithFakeTimer disableFuture onError={onErrorMock} />);

      const tomorrow = adapterToUse.addDays(now, 1);
      const yesterday = adapterToUse.addDays(now, -1);

      expect(onErrorMock.callCount).to.equal(0);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      setProps({ value: tomorrow });
      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('disableFuture');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      setProps({ value: yesterday });
      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
    });

    it('should apply minDate', function test() {
      if (['picker', 'field'].includes(componentFamily) && !withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-01')}
          minDate={adapterToUse.date('2019-06-15')}
        />,
      );

      if (withDate) {
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('minDate');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date('2019-06-20') });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      } else {
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      }
    });

    it('should apply maxDate', function test() {
      if (['picker', 'field'].includes(componentFamily) && !withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-25')}
          maxDate={adapterToUse.date('2019-06-15')}
        />,
      );

      if (withDate) {
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('maxDate');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date('2019-06-10') });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      } else {
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      }
    });

    it('should apply minTime', function test() {
      if (['picker', 'field'].includes(componentFamily) && !withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-15T10:15:00')}
          minTime={adapterToUse.date('2010-01-01T12:00:00')}
        />,
      );
      if (withTime) {
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('minTime');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date('2019-06-15T13:10:00') });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      } else {
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      }
    });

    it('should apply maxTime', function test() {
      if (['picker', 'field'].includes(componentFamily) && !withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          maxTime={adapterToUse.date('2010-01-01T12:00:00')}
          value={adapterToUse.date('2019-06-15T10:15:00')}
        />,
      );
      if (withTime) {
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

        setProps({ value: adapterToUse.date('2019-06-15T13:10:00') });

        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('maxTime');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
      } else {
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      }
    });

    it('should apply maxDateTime', function test() {
      if (!withDate || !withTime) {
        // prop only available on DateTime pickers
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-15T13:15:00')}
          maxDateTime={adapterToUse.date('2019-06-15T12:00:00')}
        />,
      );
      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('maxTime');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      // Test 5 minutes before
      setProps({ value: adapterToUse.date('2019-06-15T11:55:00') });
      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      // Test 1 day before
      setProps({ value: adapterToUse.date('2019-06-14T20:10:00') });
      expect(onErrorMock.callCount).to.equal(2);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      // Test 1 day after
      setProps({ value: adapterToUse.date('2019-06-16T10:00:00') });
      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.equal('maxDate');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
    });

    it('should apply minDateTime', function test() {
      if (!withDate || !withTime) {
        // prop only available on DateTime pickers
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-15T13:15:00')}
          minDateTime={adapterToUse.date('2019-06-15T12:00:00')}
        />,
      );
      expect(onErrorMock.callCount).to.equal(0);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

      // Test 5 minutes before (invalid)
      setProps({ value: adapterToUse.date('2019-06-15T11:55:00') });
      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.equal('minTime');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      // Test 1 day before (invalid)
      setProps({ value: adapterToUse.date('2019-06-14T20:10:00') });
      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.equal('minDate');
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

      // Test 1 day after
      setProps({ value: adapterToUse.date('2019-06-16T10:00:00') });
      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.equal(null);
      expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
    });

    it('should apply minutesStep', function test() {
      if (['picker', 'field'].includes(componentFamily) && !withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-15T10:15:00')}
          minutesStep={30}
        />,
      );
      if (withTime) {
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('minutesStep');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date('2019-06-15T10:30:00') });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      } else {
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      }
    });
  });
};
