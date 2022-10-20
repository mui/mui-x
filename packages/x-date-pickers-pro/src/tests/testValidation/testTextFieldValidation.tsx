import { expect } from 'chai';
import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { adapterToUse } from 'test/utils/pickers-utils';

const testInvalidStatus = (expectedAnswer: boolean[], isSingleInput?: boolean) => {
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

function testTextFieldValidation(ElementToTest, propsToTest, getOptions) {
  describe('validation in textfield:', () => {
    const { isLegacyPicker } = getOptions();

    const defaultProps = isLegacyPicker
      ? {
          onChange: () => {},
          renderInput: (startProps, endProps) => (
            <div>
              <TextField {...startProps} />
              <TextField {...endProps} />
            </div>
          ),
        }
      : {};

    it('should accept single day range', () => {
      const { render, isSingleInput } = getOptions();
      render(
        <ElementToTest
          {...defaultProps}
          value={dateParser([
            [2018, 0, 1, 10, 15, 0],
            [2018, 0, 1, 10, 15, 0],
          ])}
        />,
      );
      testInvalidStatus([false, false], isSingleInput);
    });

    it('should not accept end date prior to start state', () => {
      const { render, isSingleInput } = getOptions();
      render(
        <ElementToTest
          {...defaultProps}
          value={dateParser([
            [2018, 0, 2],
            [2018, 0, 1],
          ])}
        />,
      );
      testInvalidStatus([true, true], isSingleInput);
    });

    if (propsToTest.includes('shouldDisableDate')) {
      it('should apply shouldDisableDate', function test() {
        const { render, withDate, isSingleInput } = getOptions();
        if (!withDate) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 9],
              [2018, 2, 10],
            ])}
            shouldDisableDate={(date) =>
              adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
            }
          />,
        );

        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 13],
          ]),
        });

        testInvalidStatus([false, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 12],
            [2018, 2, 13],
          ]),
        });
        testInvalidStatus([true, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 13],
          ]),
          shouldDisableDate: (date) =>
            adapterToUse.isBefore(date, adapterToUse.date(new Date(2018, 2, 10))),
        });
        testInvalidStatus([true, false], isSingleInput);
      });

      it('should apply shouldDisableDate specifically on end date', function test() {
        const { render, withDate, isSingleInput } = getOptions();
        if (!withDate) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
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

        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 13],
          ]),
        });
        testInvalidStatus([false, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 12],
            [2018, 2, 13],
          ]),
        });
        testInvalidStatus([false, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 13],
          ]),
          shouldDisableDate: (date, position) =>
            position === 'end'
              ? adapterToUse.isBefore(date, adapterToUse.date(new Date(2018, 2, 10)))
              : false,
        });
        testInvalidStatus([false, false], isSingleInput);
      });

      it('should apply shouldDisableDate specifically on start date', function test() {
        const { render, withDate, isSingleInput } = getOptions();
        if (!withDate) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
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

        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 13],
          ]),
        });
        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 12],
            [2018, 2, 13],
          ]),
        });
        testInvalidStatus([true, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 13],
          ]),
          shouldDisableDate: (date, position) =>
            position === 'start'
              ? adapterToUse.isBefore(date, adapterToUse.date(new Date(2018, 2, 10)))
              : false,
        });
        testInvalidStatus([true, false], isSingleInput);
      });
    }

    if (propsToTest.includes('disablePast')) {
      it('should apply disablePast', function test() {
        const { render, withDate, isSingleInput } = getOptions();

        let now;
        const WithFakeTimer = (props) => {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={[now, now]} {...props} />;
        };

        const { setProps } = render(<WithFakeTimer {...defaultProps} disablePast />);

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
        testInvalidStatus([true, false], isSingleInput);

        setProps({
          value: [past, past],
        });
        testInvalidStatus([true, true], isSingleInput);
      });
    }

    if (propsToTest.includes('disableFuture')) {
      it('should apply disableFuture', function test() {
        const { render, withDate, isSingleInput } = getOptions();

        let now;
        const WithFakeTimer = (props) => {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={[now, now]} {...props} />;
        };

        const { setProps } = render(<WithFakeTimer {...defaultProps} disableFuture />);

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
        testInvalidStatus([false, true], isSingleInput);

        setProps({
          value: [future, future],
        });
        testInvalidStatus([true, true], isSingleInput);
      });
    }

    if (propsToTest.includes('minDate')) {
      it('should apply minDate', function test() {
        const { render, withDate, isSingleInput } = getOptions();
        if (!withDate) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 9],
              [2018, 2, 10],
            ])}
            minDate={adapterToUse.date(new Date(2018, 2, 15))}
          />,
        );

        testInvalidStatus([true, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 9],
            [2018, 2, 15],
          ]),
        });
        testInvalidStatus([true, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 16],
            [2018, 2, 17],
          ]),
        });
        testInvalidStatus([false, false], isSingleInput);
      });
    }

    if (propsToTest.includes('maxDate')) {
      it('should apply maxDate', function test() {
        const { render, withDate, isSingleInput } = getOptions();
        if (!withDate) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 9],
              [2018, 2, 10],
            ])}
            maxDate={adapterToUse.date(new Date(2018, 2, 15))}
          />,
        );

        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 15],
            [2018, 2, 17],
          ]),
        });
        testInvalidStatus([false, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 16],
            [2018, 2, 17],
          ]),
        });
        testInvalidStatus([true, true], isSingleInput);
      });
    }

    if (propsToTest.includes('minTime')) {
      it('should apply minTime', function test() {
        const { render, withTime, isSingleInput } = getOptions();
        if (!withTime) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 10, 9, 0, 0],
              [2018, 2, 10, 10, 0, 0],
            ])}
            minTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
          />,
        );

        testInvalidStatus([true, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 10, 9, 0, 0],
            [2018, 2, 10, 12, 5, 0],
          ]),
        });
        testInvalidStatus([true, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 10, 12, 15, 0],
            [2018, 2, 10, 18, 0, 0],
          ]),
        });
        testInvalidStatus([false, false], isSingleInput);
      });
      it('should ignore date when applying minTime', function test() {
        const { render, withTime, isSingleInput } = getOptions();
        if (!withTime) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 5, 9, 0, 0],
              [2018, 2, 15, 10, 0, 0],
            ])}
            minTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
          />,
        );
        testInvalidStatus([true, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 5, 15, 0, 0],
            [2018, 2, 15, 16, 5, 0],
          ]),
        });
        testInvalidStatus([false, false], isSingleInput);
      });
    }
    if (propsToTest.includes('maxTime')) {
      it('should apply maxTime', function test() {
        const { render, withTime, isSingleInput } = getOptions();
        if (!withTime) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 10, 9, 0, 0],
              [2018, 2, 10, 10, 0, 0],
            ])}
            maxTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
          />,
        );

        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 10, 9, 0, 0],
            [2018, 2, 10, 12, 5, 0],
          ]),
        });
        testInvalidStatus([false, true], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 10, 12, 15, 0],
            [2018, 2, 10, 18, 0, 0],
          ]),
        });
        testInvalidStatus([true, true], isSingleInput);
      });
      it('should ignore date when applying maxTime', function test() {
        const { render, withTime, isSingleInput } = getOptions();
        if (!withTime) {
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 5, 9, 0, 0],
              [2018, 2, 15, 10, 0, 0],
            ])}
            maxTime={adapterToUse.date(new Date(2018, 2, 10, 12, 0))}
          />,
        );
        testInvalidStatus([false, false], isSingleInput);

        setProps({
          value: dateParser([
            [2018, 2, 5, 15, 0, 0],
            [2018, 2, 15, 16, 5, 0],
          ]),
        });
        testInvalidStatus([true, true], isSingleInput);
      });
    }

    if (propsToTest.includes('maxDateTime')) {
      it('should apply maxDateTime', function test() {
        const { render, isSingleInput, withDate, withTime } = getOptions();
        if (!withDate || !withTime) {
          // prop only available on DateTime pickers
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 1, 9, 0, 0],
              [2018, 2, 2, 12, 0, 0],
            ])}
            maxDateTime={adapterToUse.date(new Date(2018, 2, 2, 13, 0))}
          />,
        );
        testInvalidStatus([false, false], isSingleInput);

        setProps({ maxDateTime: adapterToUse.date(new Date(2018, 2, 2, 8, 0)) });
        testInvalidStatus([false, true], isSingleInput);

        setProps({ maxDateTime: adapterToUse.date(new Date(2018, 2, 1, 5, 0)) });
        testInvalidStatus([true, true], isSingleInput);
      });
    }

    if (propsToTest.includes('minDateTime')) {
      it('should apply minDateTime', function test() {
        const { render, isSingleInput, withDate, withTime } = getOptions();
        if (!withDate || !withTime) {
          // prop only available on DateTime pickers
          return;
        }

        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            value={dateParser([
              [2018, 2, 1, 9, 0, 0],
              [2018, 2, 2, 12, 0, 0],
            ])}
            minDateTime={adapterToUse.date(new Date(2018, 2, 2, 13, 0))}
          />,
        );
        testInvalidStatus([true, true], isSingleInput);

        setProps({ minDateTime: adapterToUse.date(new Date(2018, 2, 2, 8, 0)) });
        testInvalidStatus([true, false], isSingleInput);

        setProps({ minDateTime: adapterToUse.date(new Date(2018, 2, 1, 5, 0)) });
        testInvalidStatus([false, false], isSingleInput);
      });
    }
  });
}

export default testTextFieldValidation;
