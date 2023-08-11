import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/monorepo/test/utils';
import { adapterToUse } from 'test/utils/pickers';
import { DescribeRangeValidationTestSuite } from './describeRangeValidation.types';

const testInvalidStatus = (expectedAnswer: boolean[], isSingleInput: boolean | undefined) => {
  const answers = isSingleInput ? [expectedAnswer[0] || expectedAnswer[1]] : expectedAnswer;

  const textBoxes = screen.getAllByRole('textbox');
  answers.forEach((answer, index) => {
    const textBox = textBoxes[index];

    expect(textBox).to.have.attribute('aria-invalid', answer ? 'true' : 'false');
  });
};

const dateParser = (value: (null | number[])[]) => {
  return value.map((date) => (date === null ? date : adapterToUse.date(new Date(...(date as [])))));
};

export const testTextFieldRangeValidation: DescribeRangeValidationTestSuite = (
  ElementToTest,
  getOptions,
) => {
  const { componentFamily, render, isSingleInput, withDate, withTime } = getOptions();

  if (!['picker', 'field'].includes(componentFamily)) {
    return;
  }

  describe('text field:', () => {
    it('should accept single day range', () => {
      const onErrorMock = spy();
      render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 0, 1, 10, 15, 0],
            [2018, 0, 1, 10, 15, 0],
          ])}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should not accept end date prior to start state', () => {
      const onErrorMock = spy();
      render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 0, 2],
            [2018, 0, 1],
          ])}
        />,
      );

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
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 9],
            [2018, 2, 10],
          ])}
          shouldDisableDate={(date) =>
            adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
          }
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 9],
          [2018, 2, 13],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 12],
          [2018, 2, 13],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([
        'shouldDisableDate',
        'shouldDisableDate',
      ]);
      testInvalidStatus([true, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 12],
          [2018, 2, 13],
        ]),
        shouldDisableDate: (date) =>
          adapterToUse.isBefore(date, adapterToUse.date(new Date(2018, 2, 13))),
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['shouldDisableDate', null]);
      testInvalidStatus([true, false], isSingleInput);
    });

    it('should apply shouldDisableDate specifically on end date', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 9],
            [2018, 2, 10],
          ])}
          shouldDisableDate={(date, position) =>
            position === 'end'
              ? adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
              : false
          }
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 9],
          [2018, 2, 13],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 12],
          [2018, 2, 13],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'shouldDisableDate']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 12],
          [2018, 2, 13],
        ]),
        shouldDisableDate: (date, position) =>
          position === 'end'
            ? adapterToUse.isBefore(date, adapterToUse.date(new Date(2018, 2, 13)))
            : false,
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply shouldDisableDate specifically on start date', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 9],
            [2018, 2, 10],
          ])}
          shouldDisableDate={(date, position) =>
            position === 'start'
              ? adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
              : false
          }
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 9],
          [2018, 2, 13],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(0);

      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 12],
          [2018, 2, 13],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['shouldDisableDate', null]);
      testInvalidStatus([true, false], isSingleInput);

      setProps({
        shouldDisableDate: (date, position) =>
          position === 'start'
            ? adapterToUse.isBefore(date, adapterToUse.date(new Date(2018, 2, 13)))
            : false,
      });

      expect(onErrorMock.callCount).to.equal(1);
      testInvalidStatus([true, false], isSingleInput);
    });

    it('should apply disablePast', function test() {
      const onErrorMock = spy();
      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date(new Date());
        return <ElementToTest value={[now, now]} {...props} />;
      }

      const { setProps } = render(<WithFakeTimer disablePast onError={onErrorMock} />);

      let past: null | typeof now = null;
      if (withDate) {
        past = adapterToUse.addDays(now, -1);
      } else if (adapterToUse.isSameDay(adapterToUse.addHours(now, -1), now)) {
        past = adapterToUse.addHours(now, -1);
      }

      if (past === null) {
        return;
      }

      setProps({
        value: [past, now],
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', null]);
      testInvalidStatus([true, false], isSingleInput);

      setProps({
        value: [past, past],
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disablePast', 'disablePast']);
      testInvalidStatus([true, true], isSingleInput);
    });

    it('should apply disableFuture', function test() {
      const onErrorMock = spy();
      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date(new Date());
        return <ElementToTest value={[now, now]} {...props} />;
      }

      const { setProps } = render(<WithFakeTimer disableFuture onError={onErrorMock} />);

      let future: null | typeof now = null;

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

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'disableFuture']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: [future, future],
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['disableFuture', 'disableFuture']);
      testInvalidStatus([true, true], isSingleInput);
    });

    it('should apply minDate', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 9],
            [2018, 2, 10],
          ])}
          minDate={adapterToUse.date(new Date(2018, 2, 15))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', 'minDate']);
      testInvalidStatus([true, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 9],
          [2018, 2, 15],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', null]);
      testInvalidStatus([true, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 16],
          [2018, 2, 17],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply minDate when only first field is filled', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([[2018, 2, 9], null])}
          minDate={adapterToUse.date(new Date(2018, 2, 11))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', null]);
      testInvalidStatus([true, false], isSingleInput);

      setProps({
        value: dateParser([[2018, 2, 16], null]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply minDate when only second field is filled', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([null, [2018, 2, 9]])}
          minDate={adapterToUse.date(new Date(2018, 2, 15))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'minDate']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: dateParser([null, [2018, 2, 16]]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply maxDate', function test() {
      if (!withDate) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 9],
            [2018, 2, 10],
          ])}
          maxDate={adapterToUse.date(new Date(2018, 2, 15))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 15],
          [2018, 2, 17],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxDate']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 16],
          [2018, 2, 17],
        ]),
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
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 10, 9, 0, 0],
            [2018, 2, 10, 10, 0, 0],
          ])}
          minTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', 'minTime']);
      testInvalidStatus([true, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 10, 9, 0, 0],
          [2018, 2, 10, 12, 5, 0],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', null]);
      testInvalidStatus([true, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 10, 12, 15, 0],
          [2018, 2, 10, 18, 0, 0],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });
    it('should ignore date when applying minTime', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 5, 9, 0, 0],
            [2018, 2, 15, 10, 0, 0],
          ])}
          minTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', 'minTime']);
      testInvalidStatus([true, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 5, 15, 0, 0],
          [2018, 2, 15, 16, 5, 0],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should apply minTime when only first field is filled', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([[2018, 1, 1, 15], null])}
          minTime={adapterToUse.date(new Date(2018, 1, 1, 12))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([[2018, 1, 1, 5], null]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minTime', null]);
      testInvalidStatus([true, false], isSingleInput);
    });

    it('should apply minTime when only second field is filled', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([null, [2018, 1, 1, 15]])}
          minTime={adapterToUse.date(new Date(2018, 1, 1, 12))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([null, [2018, 1, 1, 5]]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'minTime']);
      testInvalidStatus([false, true], isSingleInput);
    });

    it('should apply maxTime', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 10, 9, 0, 0],
            [2018, 2, 10, 10, 0, 0],
          ])}
          maxTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 10, 9, 0, 0],
          [2018, 2, 10, 12, 5, 0],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxTime']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 10, 12, 15, 0],
          [2018, 2, 10, 18, 0, 0],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxTime']);
      testInvalidStatus([true, true], isSingleInput);
    });
    it('should ignore date when applying maxTime', function test() {
      if (!withTime) {
        return;
      }

      const onErrorMock = spy();
      const { setProps } = render(
        <ElementToTest
          onError={onErrorMock}
          value={dateParser([
            [2018, 2, 5, 9, 0, 0],
            [2018, 2, 15, 10, 0, 0],
          ])}
          maxTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({
        value: dateParser([
          [2018, 2, 5, 15, 0, 0],
          [2018, 2, 15, 16, 5, 0],
        ]),
      });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxTime']);
      testInvalidStatus([true, true], isSingleInput);
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
          value={dateParser([
            [2018, 2, 1, 9, 0, 0],
            [2018, 2, 2, 12, 0, 0],
          ])}
          maxDateTime={adapterToUse.date(new Date(2018, 2, 2, 13, 0))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(0);
      testInvalidStatus([false, false], isSingleInput);

      setProps({ maxDateTime: adapterToUse.date(new Date(2018, 2, 2, 8, 0)) });

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, 'maxTime']);
      testInvalidStatus([false, true], isSingleInput);

      setProps({ maxDateTime: adapterToUse.date(new Date(2018, 2, 1, 5, 0)) });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['maxTime', 'maxDate']);
      testInvalidStatus([true, true], isSingleInput);
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
          value={dateParser([
            [2018, 2, 1, 9, 0, 0],
            [2018, 2, 2, 12, 0, 0],
          ])}
          minDateTime={adapterToUse.date(new Date(2018, 2, 2, 13, 0))}
        />,
      );

      expect(onErrorMock.callCount).to.equal(1);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', 'minTime']);
      testInvalidStatus([true, true], isSingleInput);

      setProps({ minDateTime: adapterToUse.date(new Date(2018, 2, 2, 8, 0)) });

      expect(onErrorMock.callCount).to.equal(2);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal(['minDate', null]);
      testInvalidStatus([true, false], isSingleInput);

      setProps({ minDateTime: adapterToUse.date(new Date(2018, 2, 1, 5, 0)) });

      expect(onErrorMock.callCount).to.equal(3);
      expect(onErrorMock.lastCall.args[0]).to.deep.equal([null, null]);
      testInvalidStatus([false, false], isSingleInput);
    });
  });
};
