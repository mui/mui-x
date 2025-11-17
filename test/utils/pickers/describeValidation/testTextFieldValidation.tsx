import * as React from 'react';
import { vi } from 'vitest';
import { TimeView } from '@mui/x-date-pickers/models';
import { adapterToUse, getFieldInputRoot } from 'test/utils/pickers';
import { vi } from 'vitest';
import { DescribeValidationTestSuite } from './describeValidation.types';

export const testTextFieldValidation: DescribeValidationTestSuite = (ElementToTest, getOptions) => {
  const { componentFamily, render, withDate, withTime } = getOptions();

  describe.skipIf(!['picker', 'field'].includes(componentFamily))('text field:', () => {
    it.skipIf(['picker', 'field'].includes(componentFamily) && !withDate)(
      'should apply shouldDisableDate',
      () => {
        const onErrorMock = vi.fn();
        const { setProps } = render(
          <ElementToTest
            onError={onErrorMock}
            value={adapterToUse.date('2018-03-12')}
            shouldDisableDate={(date: any) =>
              adapterToUse.isAfter(date, adapterToUse.date('2018-03-10'))
            }
          />,
        );

        if (withDate) {
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
          expect(onErrorMock).toHaveBeenCalledTimes(1);
          expect(onErrorMock.mock.calls[637mock.calls.length - 1][0]).to.equal('shouldDisableDate');

          setProps({ value: adapterToUse.date('2018-03-09') });

          expect(onErrorMock).toHaveBeenCalledTimes(2);
          expect(onErrorMock.mock.calls[642mock.calls.length - 1][0]).to.equal(null);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
          expect(onErrorMock).toHaveBeenCalledTimes(0);
        }
      },
    );

    // TODO: Remove when DateTimePickers will support those props
    it.skipIf(!withDate)('should apply shouldDisableYear', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2018-03-12')}
          shouldDisableYear={(date: any) => adapterToUse.getYear(date) === 2018}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[663mock.calls.length - 1][0]).to.equal('shouldDisableYear');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-09') });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[669mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    // TODO: Remove when DateTimePickers will support those props
    it.skipIf(!withDate)('should apply shouldDisableMonth', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          shouldDisableMonth={(date: any) => adapterToUse.getMonth(date) === 2}
          value={adapterToUse.date('2018-03-12')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[685mock.calls.length - 1][0]).to.equal('shouldDisableMonth');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-09') });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2018-04-09') });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[696mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    it.skipIf(!withTime)('should apply shouldDisableTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          shouldDisableTime={(value: any, view: TimeView) => {
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

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[719mock.calls.length - 1][0]).to.equal('shouldDisableTime-hours');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2019-03-12T09:05:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[725mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

      setProps({ value: adapterToUse.date('2018-03-12T09:10:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[731mock.calls.length - 1][0]).to.equal('shouldDisableTime-minutes');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      setProps({ value: adapterToUse.date('2018-03-12T09:09:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(4);
      expect(onErrorMock.mock.calls[737mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

      setProps({ value: adapterToUse.date('2018-03-12T09:09:10') });

      expect(onErrorMock).toHaveBeenCalledTimes(5);
      expect(onErrorMock.mock.calls[743mock.calls.length - 1][0]).to.equal('shouldDisableTime-seconds');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
    });

    describe.skipIf(!withDate)('with fake timers', () => {
      beforeEach(() => {
        vi.setSystemTime(new Date(2018, 0, 1));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should apply disablePast', () => {
        const now = adapterToUse.date();
        function WithFakeTimer(props: any) {
          return <ElementToTest value={now} {...props} />;
        }

        const onErrorMock = vi.fn();
        const { setProps } = render(<WithFakeTimer disablePast onError={onErrorMock} />);

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(onErrorMock).toHaveBeenCalledTimes(0);
        expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

        setProps({ value: yesterday });

        expect(onErrorMock).toHaveBeenCalledTimes(1);
        expect(onErrorMock.mock.calls[774mock.calls.length - 1][0]).to.equal('disablePast');
        expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

        setProps({ value: tomorrow });

        expect(onErrorMock).toHaveBeenCalledTimes(2);
        expect(onErrorMock.mock.calls[780mock.calls.length - 1][0]).to.equal(null);
        expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
      });
    });

    it.skipIf(!withDate)('should apply disableFuture', () => {
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={now} {...props} />;
      }

      const onErrorMock = vi.fn();
      const { setProps } = render(<WithFakeTimer disableFuture onError={onErrorMock} />);

      const tomorrow = adapterToUse.addDays(now, 1);
      const yesterday = adapterToUse.addDays(now, -1);

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

      setProps({ value: tomorrow });
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[802mock.calls.length - 1][0]).to.equal('disableFuture');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      setProps({ value: yesterday });
      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[807mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    it.skipIf(['picker', 'field'].includes(componentFamily) && !withDate)(
      'should apply minDate',
      () => {
        const onErrorMock = vi.fn();
        const { setProps } = render(
          <ElementToTest
            onError={onErrorMock}
            value={adapterToUse.date('2019-06-01')}
            minDate={adapterToUse.date('2019-06-15')}
          />,
        );

        if (withDate) {
          expect(onErrorMock).toHaveBeenCalledTimes(1);
          expect(onErrorMock.mock.calls[825mock.calls.length - 1][0]).to.equal('minDate');
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date('2019-06-20') });

          expect(onErrorMock).toHaveBeenCalledTimes(2);
          expect(onErrorMock.mock.calls[831mock.calls.length - 1][0]).to.equal(null);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock).toHaveBeenCalledTimes(0);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        }
      },
    );

    it.skipIf(['picker', 'field'].includes(componentFamily) && !withDate)(
      'should apply maxDate',
      () => {
        const onErrorMock = vi.fn();
        const { setProps } = render(
          <ElementToTest
            onError={onErrorMock}
            value={adapterToUse.date('2019-06-25')}
            maxDate={adapterToUse.date('2019-06-15')}
          />,
        );

        if (withDate) {
          expect(onErrorMock).toHaveBeenCalledTimes(1);
          expect(onErrorMock.mock.calls[854mock.calls.length - 1][0]).to.equal('maxDate');
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date('2019-06-10') });

          expect(onErrorMock).toHaveBeenCalledTimes(2);
          expect(onErrorMock.mock.calls[860mock.calls.length - 1][0]).to.equal(null);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock).toHaveBeenCalledTimes(0);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        }
      },
    );

    it.skipIf(['picker', 'field'].includes(componentFamily) && !withTime)(
      'should apply minTime',
      () => {
        const onErrorMock = vi.fn();
        const { setProps } = render(
          <ElementToTest
            onError={onErrorMock}
            value={adapterToUse.date('2019-06-15T10:15:00')}
            minTime={adapterToUse.date('2010-01-01T12:00:00')}
          />,
        );
        if (withTime) {
          expect(onErrorMock).toHaveBeenCalledTimes(1);
          expect(onErrorMock.mock.calls[882mock.calls.length - 1][0]).to.equal('minTime');
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date('2019-06-15T13:10:00') });

          expect(onErrorMock).toHaveBeenCalledTimes(2);
          expect(onErrorMock.mock.calls[888mock.calls.length - 1][0]).to.equal(null);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock).toHaveBeenCalledTimes(0);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        }
      },
    );

    it.skipIf(['picker', 'field'].includes(componentFamily) && !withTime)(
      'should apply maxTime',
      () => {
        const onErrorMock = vi.fn();
        const { setProps } = render(
          <ElementToTest
            onError={onErrorMock}
            maxTime={adapterToUse.date('2010-01-01T12:00:00')}
            value={adapterToUse.date('2019-06-15T10:15:00')}
          />,
        );
        if (withTime) {
          expect(onErrorMock).toHaveBeenCalledTimes(0);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

          setProps({ value: adapterToUse.date('2019-06-15T13:10:00') });

          expect(onErrorMock).toHaveBeenCalledTimes(1);
          expect(onErrorMock.mock.calls[915mock.calls.length - 1][0]).to.equal('maxTime');
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
        } else {
          expect(onErrorMock).toHaveBeenCalledTimes(0);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        }
      },
    );

    it.skipIf(!withDate || !withTime)('should apply maxDateTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-15T13:15:00')}
          maxDateTime={adapterToUse.date('2019-06-15T12:00:00')}
        />,
      );
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[934mock.calls.length - 1][0]).to.equal('maxTime');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      // Test 5 minutes before
      setProps({ value: adapterToUse.date('2019-06-15T11:55:00') });
      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[940mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

      // Test 1 day before
      setProps({ value: adapterToUse.date('2019-06-14T20:10:00') });
      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

      // Test 1 day after
      setProps({ value: adapterToUse.date('2019-06-16T10:00:00') });
      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[951mock.calls.length - 1][0]).to.equal('maxDate');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');
    });

    it.skipIf(!withDate || !withTime)('should apply minDateTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={adapterToUse.date('2019-06-15T13:15:00')}
          minDateTime={adapterToUse.date('2019-06-15T12:00:00')}
        />,
      );
      expect(onErrorMock).toHaveBeenCalledTimes(0);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');

      // Test 5 minutes before (invalid)
      setProps({ value: adapterToUse.date('2019-06-15T11:55:00') });
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[970mock.calls.length - 1][0]).to.equal('minTime');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      // Test 1 day before (invalid)
      setProps({ value: adapterToUse.date('2019-06-14T20:10:00') });
      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[976mock.calls.length - 1][0]).to.equal('minDate');
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

      // Test 1 day after
      setProps({ value: adapterToUse.date('2019-06-16T10:00:00') });
      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[982mock.calls.length - 1][0]).to.equal(null);
      expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
    });

    it.skipIf(['picker', 'field'].includes(componentFamily) && !withTime)(
      'should apply minutesStep',
      () => {
        const onErrorMock = vi.fn();
        const { setProps } = render(
          <ElementToTest
            onError={onErrorMock}
            value={adapterToUse.date('2019-06-15T10:15:00')}
            minutesStep={30}
          />,
        );
        if (withTime) {
          expect(onErrorMock).toHaveBeenCalledTimes(1);
          expect(onErrorMock.mock.calls[999mock.calls.length - 1][0]).to.equal('minutesStep');
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date('2019-06-15T10:30:00') });

          expect(onErrorMock).toHaveBeenCalledTimes(2);
          expect(onErrorMock.mock.calls[1005mock.calls.length - 1][0]).to.equal(null);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock).toHaveBeenCalledTimes(0);
          expect(getFieldInputRoot()).to.have.attribute('aria-invalid', 'false');
        }
      },
    );
  });
};
