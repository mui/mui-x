import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { adapterToUse, getAllFieldInputRoot } from 'test/utils/pickers';
import { act } from '@mui/internal-test-utils/createRenderer';
import { DescribeRangeValidationTestSuite } from './describeRangeValidation.types';

const testInvalidStatus = (expectedAnswer: boolean[], isSingleInput?: boolean) => {
  const answers = isSingleInput ? [expectedAnswer[0] || expectedAnswer[1]] : expectedAnswer;

  const fieldInputRoots = getAllFieldInputRoot();
  answers.forEach((answer, index) => {
    const fieldInputRoot = fieldInputRoots[index];

    expect(fieldInputRoot).to.have.attribute('aria-invalid', answer ? 'true' : 'false');
  });
};

export const testTextFieldKeyboardRangeValidation: DescribeRangeValidationTestSuite = (
  ElementToTest,
  getOptions,
) => {
  const { componentFamily, render, isSingleInput, withDate, withTime, setValue } = getOptions();

  if (componentFamily !== 'field' || !setValue) {
    return;
  }

  describe('text field keyboard:', () => {
    it('should not accept end date prior to start state', () => {
      const onErrorMock = spy();
      render(<ElementToTest enableAccessibleFieldDOMStructure onError={onErrorMock} />);

      expect(onErrorMock.callCount).to.equal(0);
      act(() => {
        [
          adapterToUse.date('2018-01-02T12:00:00'),
          adapterToUse.date('2018-01-01T11:00:00'),
        ].forEach((date, index) => {
          setValue(date, { setEndDate: index === 1 });
        });
      });
      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['invalidRange', 'invalidRange']);
      testInvalidStatus([true, true], isSingleInput);
    });

    it('should apply shouldDisableDate', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          enableAccessibleFieldDOMStructure
          onError={onErrorMock}
          shouldDisableDate={(date) => adapterToUse.isAfter(date, adapterToUse.date('2018-03-11'))}
        />,
      );
      act(() => {
        [adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')].forEach(
          (date, index) => {
            setValue(date, { setEndDate: index === 1 });
          },
        );
      });

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-13'), { setEndDate: true });
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-12'));
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([
        'shouldDisableDate',
        'shouldDisableDate',
      ]);
      testInvalidStatus([true, true], isSingleInput);

      setProps({
        shouldDisableDate: (date) => adapterToUse.isBefore(date, adapterToUse.date('2018-03-13')),
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['shouldDisableDate', null]);
      testInvalidStatus([true, false], isSingleInput);
    });

    it('should apply disablePast', function test() {
      const onErrorMock = spy();
      const now = adapterToUse.date();
      render(<ElementToTest enableAccessibleFieldDOMStructure disablePast onError={onErrorMock} />);

      let past: null | typeof now = null;
      if (withDate) {
        past = adapterToUse.addDays(now, -1);
      } else if (adapterToUse.isSameDay(adapterToUse.addHours(now, -1), now)) {
        past = adapterToUse.addHours(now, -1);
      }

      if (past === null) {
        return;
      }

      act(() => {
        setValue(adapterToUse.date(past));
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', null]);
      testInvalidStatus([true, false], isSingleInput);

      act(() => {
        setValue(adapterToUse.date(past), { setEndDate: true });
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', 'disablePast']);
      testInvalidStatus([true, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date(now));
      });
      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disablePast']);
      testInvalidStatus([false, true], isSingleInput);
    });

    it('should apply disableFuture', function test() {
      const onErrorMock = spy();
      const now = adapterToUse.date();
      render(
        <ElementToTest enableAccessibleFieldDOMStructure disableFuture onError={onErrorMock} />,
      );

      let future: null | typeof now = null;

      if (withDate) {
        future = adapterToUse.addDays(now, 1);
      } else if (adapterToUse.isSameDay(adapterToUse.addHours(now, 1), now)) {
        future = adapterToUse.addHours(now, 1);
      }

      if (future === null) {
        return;
      }

      act(() => {
        setValue(adapterToUse.date(future), { setEndDate: true });
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disableFuture']);
      testInvalidStatus([false, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date(future));
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disableFuture', 'disableFuture']);
      testInvalidStatus([true, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date(now));
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disableFuture']);
      testInvalidStatus([false, true], isSingleInput);
    });

    it('should apply minDate', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      render(
        <ElementToTest
          enableAccessibleFieldDOMStructure
          onError={onErrorMock}
          minDate={adapterToUse.date('2018-03-15')}
        />,
      );

      act(() => {
        [adapterToUse.date('2018-03-09'), adapterToUse.date('2018-03-10')].forEach(
          (date, index) => {
            setValue(date, { setEndDate: index === 1 });
          },
        );
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', 'minDate']);
      testInvalidStatus([true, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-15'));
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'minDate']);
      testInvalidStatus([false, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-16'), { setEndDate: true });
      });

      expect(onErrorMock.callCount).to.equal(4);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply maxDate', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      render(
        <ElementToTest
          enableAccessibleFieldDOMStructure
          onError={onErrorMock}
          maxDate={adapterToUse.date('2018-03-15')}
        />,
      );

      act(() => {
        [adapterToUse.date('2018-03-15'), adapterToUse.date('2018-03-17')].forEach(
          (date, index) => {
            setValue(date, { setEndDate: index === 1 });
          },
        );
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxDate']);
      testInvalidStatus([false, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-16'));
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxDate', 'maxDate']);
      testInvalidStatus([true, true], isSingleInput);
    });

    it('should apply minTime', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      render(
        <ElementToTest
          enableAccessibleFieldDOMStructure
          onError={onErrorMock}
          minTime={adapterToUse.date('2018-03-10T12:00:00')}
        />,
      );

      act(() => {
        [
          adapterToUse.date('2018-03-10T09:00:00'),
          adapterToUse.date('2018-03-10T10:00:00'),
        ].forEach((date, index) => {
          setValue(date, { setEndDate: index === 1 });
        });
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', 'minTime']);
      testInvalidStatus([true, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-10T12:10:00'), { setEndDate: true });
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', null]);
      testInvalidStatus([true, false], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-10T12:05:00'));
      });

      expect(onErrorMock.callCount).to.equal(4);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply maxTime', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      render(
        <ElementToTest
          enableAccessibleFieldDOMStructure
          onError={onErrorMock}
          maxTime={adapterToUse.date('2018-03-10T12:00:00')}
        />,
      );

      act(() => {
        [
          adapterToUse.date('2018-03-10T09:00:00'),
          adapterToUse.date('2018-03-10T12:15:00'),
        ].forEach((date, index) => {
          setValue(date, { setEndDate: index === 1 });
        });
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxTime']);
      testInvalidStatus([false, true], isSingleInput);

      act(() => {
        setValue(adapterToUse.date('2018-03-10T12:05:00'));
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxTime']);
      testInvalidStatus([true, true], isSingleInput);
    });
  });
};
