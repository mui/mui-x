import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/monorepo/test/utils';
import { adapterToUse } from 'test/utils/pickers';
import { DescribeValidationTestSuite } from './describeValidation.types';

export const testYearViewValidation: DescribeValidationTestSuite = (ElementToTest, getOptions) => {
  const { views, componentFamily, render } = getOptions();

  if (componentFamily === 'field' || !views.includes('year')) {
    return;
  }

  describe('year view:', () => {
    const defaultProps = {
      onChange: () => {},
      ...(views.length > 1 && {
        views: ['year'],
        view: 'year',
        openTo: 'year',
      }),
      ...(componentFamily !== 'calendar' && {
        open: true,
        reduceAnimations: true,
        slotProps: { toolbar: { hidden: true } },
      }),
    };

    it('should apply shouldDisableYear', function test() {
      render(
        <ElementToTest
          {...defaultProps}
          value={null}
          shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
        />,
      );

      expect(screen.queryByText('2018')).to.have.attribute('disabled');
      expect(screen.queryByText('2019')).not.to.have.attribute('disabled');
      expect(screen.queryByText('2017')).not.to.have.attribute('disabled');
    });

    it('should apply disablePast', function test() {
      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date(new Date());
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disablePast />);

      const nextYear = adapterToUse.addYears(now, 1);
      const prevYear = adapterToUse.addYears(now, -1);

      expect(screen.queryByText(adapterToUse.format(now, 'year'))).not.to.have.attribute(
        'disabled',
      );
      expect(screen.queryByText(adapterToUse.format(nextYear, 'year'))).not.to.have.attribute(
        'disabled',
      );
      expect(screen.queryByText(adapterToUse.format(prevYear, 'year'))).to.have.attribute(
        'disabled',
      );
    });

    it('should apply disableFuture', function test() {
      let now;
      function WithFakeTimer(props) {
        now = adapterToUse.date(new Date());
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disableFuture />);

      const nextYear = adapterToUse.addYears(now, 1);
      const prevYear = adapterToUse.addYears(now, -1);

      expect(screen.queryByText(adapterToUse.format(now, 'year'))).not.to.have.attribute(
        'disabled',
      );
      expect(screen.queryByText(adapterToUse.format(nextYear, 'year'))).to.have.attribute(
        'disabled',
      );
      expect(screen.queryByText(adapterToUse.format(prevYear, 'year'))).not.to.have.attribute(
        'disabled',
      );
    });

    it('should apply minDate', function test() {
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

    it('should apply maxDate', function test() {
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
  });
};
