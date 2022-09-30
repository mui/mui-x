import { expect } from 'chai';
import * as React from 'react';
import { screen } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { adapterToUse } from 'test/utils/pickers-utils';

function testYearViewValidation(ElementToTest, propsToTest, getOptions) {
  const { views, name: testedComponentName } = getOptions();
  if (!views.includes('year')) {
    return;
  }
  describe('validation in year view:', () => {
    const defaultProps = {
      onChange: () => {},

      ...(testedComponentName === 'YearPicker'
        ? {}
        : {
            renderInput: (params) => <TextField {...params} />,
            open: true,
            views: ['year'],
            view: 'year',
            openTo: 'year',
            reduceAnimations: true,
            showToolbar: false,
          }),
    };

    if (propsToTest.includes('shouldDisableYear')) {
      it('should apply shouldDisableYear', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={null}
            shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
          />,
        );

        expect(screen.queryByText('2018').getAttribute('disabled')).not.to.equal(null);
        expect(screen.queryByText('2019').getAttribute('disabled')).to.equal(null);
        expect(screen.queryByText('2017').getAttribute('disabled')).to.equal(null);
      });
    }

    if (propsToTest.includes('disablePast')) {
      it('should apply disablePast', function test() {
        const { render } = getOptions();

        let now;
        const WithFakeTimer = (props) => {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={now} {...props} />;
        };
        render(<WithFakeTimer {...defaultProps} disablePast />);

        const nextYear = adapterToUse.addYears(now, 1);
        const prevYear = adapterToUse.addYears(now, -1);

        expect(
          screen.queryByText(adapterToUse.format(now, 'year')).getAttribute('disabled'),
        ).to.equal(null);
        expect(
          screen.queryByText(adapterToUse.format(nextYear, 'year')).getAttribute('disabled'),
        ).to.equal(null);
        expect(
          screen.queryByText(adapterToUse.format(prevYear, 'year')).getAttribute('disabled'),
        ).not.to.equal(null);
      });
    }

    if (propsToTest.includes('disableFuture')) {
      it('should apply disableFuture', function test() {
        const { render } = getOptions();

        let now;
        const WithFakeTimer = (props) => {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={now} {...props} />;
        };
        render(<WithFakeTimer {...defaultProps} disableFuture />);

        const nextYear = adapterToUse.addYears(now, 1);
        const prevYear = adapterToUse.addYears(now, -1);

        expect(
          screen.queryByText(adapterToUse.format(now, 'year')).getAttribute('disabled'),
        ).to.equal(null);
        expect(
          screen.queryByText(adapterToUse.format(nextYear, 'year')).getAttribute('disabled'),
        ).not.to.equal(null);
        expect(
          screen.queryByText(adapterToUse.format(prevYear, 'year')).getAttribute('disabled'),
        ).to.equal(null);
      });
    }

    if (propsToTest.includes('minDate')) {
      it('should apply minDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            minDate={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );

        expect(screen.queryByText('2018')).to.equal(null);
        expect(screen.queryByText('2019')).not.to.equal(null);
        expect(screen.queryByText('2020')).not.to.equal(null);
      });
    }

    if (propsToTest.includes('maxDate')) {
      it('should apply maxDate', function test() {
        const { render } = getOptions();

        render(
          <ElementToTest
            {...defaultProps}
            value={adapterToUse.date(new Date(2019, 5, 15))}
            maxDate={adapterToUse.date(new Date(2019, 5, 4))}
          />,
        );

        expect(screen.queryByText('2018')).not.to.equal(null);
        expect(screen.queryByText('2019')).not.to.equal(null);
        expect(screen.queryByText('2020')).to.equal(null);
      });
    }
  });
}

export default testYearViewValidation;
