import * as React from 'react';
import { vi } from 'vitest';
import { adapterToUse, getAllFieldInputRoot } from 'test/utils/pickers';
import { vi } from 'vitest';
import { DescribeRangeValidationTestSuite } from './describeRangeValidation.types';

const testInvalidStatus = (
  expectedAnswer: boolean[],
  fieldType: 'single-input' | 'multi-input' | 'no-input',
  incompleteRange?: boolean,
) => {
  const answers =
    fieldType === 'multi-input' ? expectedAnswer : [expectedAnswer[0] || expectedAnswer[1]];

  const fields = getAllFieldInputRoot();
  answers.forEach((answer, index) => {
    const fieldRoot = fields[index];

    if (incompleteRange && fieldType === 'single-input') {
      expect(fieldRoot).to.have.attribute('aria-invalid', 'true');
      return;
    }
    expect(fieldRoot).to.have.attribute('aria-invalid', answer ? 'true' : 'false');
  });
};

export const testTextFieldRangeValidation: DescribeRangeValidationTestSuite = (
  ElementToTest,
  getOptions,
) => {
  const { componentFamily, render, fieldType, withDate, withTime } = getOptions();

  describe.skipIf(!['picker', 'field'].includes(componentFamily))('text field:', () => {
    it('should accept single day range', () => {
      const onErrorMock = vi.fn();
      render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-01-01T10:15:00'),
            adapterToUse.date('2018-01-01T10:15:00'),
          ]}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);
    });

    it('should not accept end date prior to start state', () => {
      const onErrorMock = vi.fn();
      render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-01-02'), adapterToUse.date('2018-01-01')]}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[60mock.calls.length - 1][0]).to.deep.equal(['invalidRange', 'invalidRange']);
      testInvalidStatus([true, true], fieldType);
    });

    it.skipIf(!withDate)('should apply shouldDisableDate', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')]}
          shouldDisableDate={(date: any) =>
            adapterToUse.isAfter(date, adapterToUse.date('2018-03-10'))
          }
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-13')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[84mock.calls.length - 1][0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-12'), adapterToUse.date('2018-03-13')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[92mock.calls.length - 1][0]).to.deep.equal([
        'shouldDisableDate',
        'shouldDisableDate',
      ]);
      testInvalidStatus([true, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-12'), adapterToUse.date('2018-03-13')],
        shouldDisableDate: (date: any) =>
          adapterToUse.isBefore(date, adapterToUse.date('2018-03-13')),
      });

      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[105mock.calls.length - 1][0]).to.deep.equal(['shouldDisableDate', null]);
      testInvalidStatus([true, false], fieldType);
    });

    it.skipIf(!withDate)('should apply shouldDisableDate specifically on end date', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')]}
          shouldDisableDate={(date: any, position: string) =>
            position === 'end' ? adapterToUse.isAfter(date, adapterToUse.date('2018-03-10')) : false
          }
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-13')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[129mock.calls.length - 1][0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-12'), adapterToUse.date('2018-03-13')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[137mock.calls.length - 1][0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-12'), adapterToUse.date('2018-03-13')],
        shouldDisableDate: (date: any, position: string) =>
          position === 'end' ? adapterToUse.isBefore(date, adapterToUse.date('2018-03-13')) : false,
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[147mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType);
    });

    it.skipIf(!withDate)('should apply shouldDisableDate specifically on start date', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')]}
          shouldDisableDate={(date: any, position: string) =>
            position === 'start'
              ? adapterToUse.isAfter(date, adapterToUse.date('2018-03-10'))
              : false
          }
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-13')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(0);

      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-12'), adapterToUse.date('2018-03-13')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[181mock.calls.length - 1][0]).to.deep.equal(['shouldDisableDate', null]);
      testInvalidStatus([true, false], fieldType);

      setProps({
        shouldDisableDate: (date: any, position: string) =>
          position === 'start'
            ? adapterToUse.isBefore(date, adapterToUse.date('2018-03-13'))
            : false,
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      testInvalidStatus([true, false], fieldType);
    });

    describe('with fake timer', () => {
      beforeEach(() => {
        vi.setSystemTime(new Date(2018, 0, 1));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should apply disablePast', () => {
        const onErrorMock = vi.fn();
        const now = adapterToUse.date();
        function WithFakeTimer(props: any) {
          return <ElementToTest value={[now, now]} {...props} />;
        }

        const { setProps } = render(<WithFakeTimer disablePast onError={onErrorMock} />);

        let past: null | ReturnType<typeof adapterToUse.date> = null;
        if (withDate) {
          past = adapterToUse.addDays(now!, -1);
        } else if (adapterToUse.isSameDay(adapterToUse.addHours(now!, -1), now!)) {
          past = adapterToUse.addHours(now!, -1);
        }

        if (past === null) {
          return;
        }

        setProps({
          value: [past, now],
        });

        expect(onErrorMock).toHaveBeenCalledTimes(1);
        expect(onErrorMock.mock.calls[229mock.calls.length - 1][0]).to.deep.equal(['disablePast', null]);
        testInvalidStatus([true, false], fieldType);

        setProps({
          value: [past, past],
        });

        expect(onErrorMock).toHaveBeenCalledTimes(2);
        expect(onErrorMock.mock.calls[237mock.calls.length - 1][0]).to.deep.equal(['disablePast', 'disablePast']);
        testInvalidStatus([true, true], fieldType);
      });
    });

    it('should apply disableFuture', () => {
      const onErrorMock = vi.fn();
      const now = adapterToUse.date();
      function WithFakeTimer(props: any) {
        return <ElementToTest value={[now, now]} {...props} />;
      }

      const { setProps } = render(<WithFakeTimer disableFuture onError={onErrorMock} />);

      let future: null | ReturnType<typeof adapterToUse.date> = null;

      if (withDate) {
        future = adapterToUse.addDays(now, 1);
      } else if (adapterToUse.isSameDay(adapterToUse.addHours(now, 1), now)) {
        future = adapterToUse.addHours(now, 1);
      }

      if (future === null) {
        return;
      }

      setProps({
        value: [now, future],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[268mock.calls.length - 1][0]).to.deep.equal([null, 'disableFuture']);
      testInvalidStatus([false, true], fieldType);

      setProps({
        value: [future, future],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[276mock.calls.length - 1][0]).to.deep.equal(['disableFuture', 'disableFuture']);
      testInvalidStatus([true, true], fieldType);
    });

    it.skipIf(!withDate)('should apply minDate', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')]}
          minDate={adapterToUse.date('2018-03-15')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[291mock.calls.length - 1][0]).to.deep.equal(['minDate', 'minDate']);
      testInvalidStatus([true, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-15')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[299mock.calls.length - 1][0]).to.deep.equal(['minDate', null]);
      testInvalidStatus([true, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-16'), adapterToUse.date('2018-03-17')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[307mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType);
    });

    it.skipIf(!withDate)('should apply minDate when only first field is filled', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-03-09'), null]}
          minDate={adapterToUse.date('2018-03-11')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[322mock.calls.length - 1][0]).to.deep.equal(['minDate', null]);
      testInvalidStatus([true, false], fieldType, true);

      setProps({
        value: [adapterToUse.date('2018-03-16'), null],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[330mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType, true);
    });

    it.skipIf(!withDate)('should apply minDate when only second field is filled', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[null, adapterToUse.date('2018-03-09')]}
          minDate={adapterToUse.date('2018-03-15')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[345mock.calls.length - 1][0]).to.deep.equal([null, 'minDate']);
      testInvalidStatus([false, true], fieldType, true);

      setProps({
        value: [null, adapterToUse.date('2018-03-16')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[353mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType, true);
    });

    it.skipIf(!withDate)('should apply maxDate', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')]}
          maxDate={adapterToUse.date('2018-03-15')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-15'), adapterToUse.date('2018-03-17')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[375mock.calls.length - 1][0]).to.deep.equal([null, 'maxDate']);
      testInvalidStatus([false, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-16'), adapterToUse.date('2018-03-17')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[383mock.calls.length - 1][0]).to.deep.equal(['maxDate', 'maxDate']);
      testInvalidStatus([true, true], fieldType);
    });

    it.skipIf(!withTime)('should apply minTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-03-10T09:00:00'),
            adapterToUse.date('2018-03-10T10:00:00'),
          ]}
          minTime={adapterToUse.date('2018-03-10T12:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[401mock.calls.length - 1][0]).to.deep.equal(['minTime', 'minTime']);
      testInvalidStatus([true, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-10T09:00:00'), adapterToUse.date('2018-03-10T12:05:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[409mock.calls.length - 1][0]).to.deep.equal(['minTime', null]);
      testInvalidStatus([true, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-10T12:15:00'), adapterToUse.date('2018-03-10T18:00:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[417mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType);
    });
    it.skipIf(!withTime)('should ignore date when applying minTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-03-05T09:00:00'),
            adapterToUse.date('2018-03-15T10:00:00'),
          ]}
          minTime={adapterToUse.date('2018-03-10T12:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[434mock.calls.length - 1][0]).to.deep.equal(['minTime', 'minTime']);
      testInvalidStatus([true, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-05T15:00:00'), adapterToUse.date('2018-03-15T16:05:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[442mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType);
    });

    it.skipIf(!withTime)('should apply minTime when only first field is filled', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[adapterToUse.date('2018-02-01T15:00:00'), null]}
          minTime={adapterToUse.date('2018-03-01T12:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType, true);

      setProps({
        value: [adapterToUse.date('2018-02-01T05:00:00'), null],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[464mock.calls.length - 1][0]).to.deep.equal(['minTime', null]);
      testInvalidStatus([true, false], fieldType, true);
    });

    it.skipIf(!withTime)('should apply minTime when only second field is filled', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[null, adapterToUse.date('2018-02-01T15:00:00')]}
          minTime={adapterToUse.date('2018-03-01T12:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType, true);

      setProps({
        value: [null, adapterToUse.date('2018-02-01T05:00:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[486mock.calls.length - 1][0]).to.deep.equal([null, 'minTime']);
      testInvalidStatus([false, true], fieldType, true);
    });

    it.skipIf(!withTime)('should apply maxTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-03-10T09:00:00'),
            adapterToUse.date('2018-03-10T10:00:00'),
          ]}
          maxTime={adapterToUse.date('2018-03-10T12:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-10T09:00:00'), adapterToUse.date('2018-03-10T12:05:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[511mock.calls.length - 1][0]).to.deep.equal([null, 'maxTime']);
      testInvalidStatus([false, true], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-10T12:15:00'), adapterToUse.date('2018-03-10T18:00:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[519mock.calls.length - 1][0]).to.deep.equal(['maxTime', 'maxTime']);
      testInvalidStatus([true, true], fieldType);
    });

    it.skipIf(!withTime)('should ignore date when applying maxTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-03-05T09:00:00'),
            adapterToUse.date('2018-03-15T10:00:00'),
          ]}
          maxTime={adapterToUse.date('2018-03-10T12:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({
        value: [adapterToUse.date('2018-03-05T15:00:00'), adapterToUse.date('2018-03-15T16:05:00')],
      });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[544mock.calls.length - 1][0]).to.deep.equal(['maxTime', 'maxTime']);
      testInvalidStatus([true, true], fieldType);
    });

    // prop only available on DateTime pickers
    it.skipIf(!withDate || !withTime)('should apply maxDateTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-03-01T09:00:00'),
            adapterToUse.date('2018-03-02T12:00:00'),
          ]}
          maxDateTime={adapterToUse.date('2018-03-02T13:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(0);
      testInvalidStatus([false, false], fieldType);

      setProps({ maxDateTime: adapterToUse.date('2018-03-02T08:00:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[568mock.calls.length - 1][0]).to.deep.equal([null, 'maxTime']);
      testInvalidStatus([false, true], fieldType);

      setProps({ maxDateTime: adapterToUse.date('2018-03-01T05:00:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[574mock.calls.length - 1][0]).to.deep.equal(['maxTime', 'maxDate']);
      testInvalidStatus([true, true], fieldType);
    });

    it.skipIf(!withDate || !withTime)('should apply minDateTime', () => {
      const onErrorMock = vi.fn();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={[
            adapterToUse.date('2018-03-01T09:00:00'),
            adapterToUse.date('2018-03-02T12:00:00'),
          ]}
          minDateTime={adapterToUse.date('2018-03-02T13:00:00')}
        />,
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock.mock.calls[592mock.calls.length - 1][0]).to.deep.equal(['minDate', 'minTime']);
      testInvalidStatus([true, true], fieldType);

      setProps({ minDateTime: adapterToUse.date('2018-03-02T08:00:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(2);
      expect(onErrorMock.mock.calls[598mock.calls.length - 1][0]).to.deep.equal(['minDate', null]);
      testInvalidStatus([true, false], fieldType);

      setProps({ minDateTime: adapterToUse.date('2018-03-01T05:00:00') });

      expect(onErrorMock).toHaveBeenCalledTimes(3);
      expect(onErrorMock.mock.calls[604mock.calls.length - 1][0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], fieldType);
    });
  });
};
