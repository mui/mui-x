import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { adapterToUse } from 'test/utils/pickers';
import { describeSkipIf } from 'test/utils/skipIf';
import { DescribeValidationTestSuite } from './describeValidation.types';

const queryByTextInView = (text: string) => {
  const view = screen.queryByRole('dialog');

  return screen.queryByText((content, element) => {
    if (view && !view.contains(element)) {
      return false;
    }

    return content === text;
  });
};

export const testYearViewValidation: DescribeValidationTestSuite = (ElementToTest, getOptions) => {
  const { views, componentFamily, render } = getOptions();

  describeSkipIf(componentFamily === 'field' || !views.includes('year'))('year view:', () => {
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

    it('should apply shouldDisableYear', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={null}
          shouldDisableYear={(date: any) => adapterToUse.getYear(date) === 2018}
        />,
      );

      expect(queryByTextInView('2018')).to.have.attribute('disabled');
      expect(queryByTextInView('2019')).not.to.have.attribute('disabled');
      expect(queryByTextInView('2017')).not.to.have.attribute('disabled');
    });

    it('should apply disablePast', () => {
      let now;
      function WithFakeTimer(props: any) {
        now = adapterToUse.date();
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disablePast />);

      const nextYear = adapterToUse.addYears(now, 1);
      const prevYear = adapterToUse.addYears(now, -1);

      expect(queryByTextInView(adapterToUse.format(now, 'year'))).not.to.have.attribute('disabled');
      expect(queryByTextInView(adapterToUse.format(nextYear, 'year'))).not.to.have.attribute(
        'disabled',
      );
      expect(queryByTextInView(adapterToUse.format(prevYear, 'year'))).to.have.attribute(
        'disabled',
      );
    });

    it('should apply disableFuture', () => {
      let now;
      function WithFakeTimer(props: any) {
        now = adapterToUse.date();
        return <ElementToTest value={now} {...props} />;
      }
      render(<WithFakeTimer {...defaultProps} disableFuture />);

      const nextYear = adapterToUse.addYears(now, 1);
      const prevYear = adapterToUse.addYears(now, -1);

      expect(queryByTextInView(adapterToUse.format(now, 'year'))).not.to.have.attribute('disabled');
      expect(queryByTextInView(adapterToUse.format(nextYear, 'year'))).to.have.attribute(
        'disabled',
      );
      expect(queryByTextInView(adapterToUse.format(prevYear, 'year'))).not.to.have.attribute(
        'disabled',
      );
    });

    it('should apply minDate', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2019-06-15')}
          minDate={adapterToUse.date('2019-06-04')}
        />,
      );

      expect(queryByTextInView('2018')).to.equal(null);
      expect(queryByTextInView('2019')).not.to.equal(null);
      expect(queryByTextInView('2020')).not.to.equal(null);
    });

    it('should apply maxDate', () => {
      render(
        <ElementToTest
          {...defaultProps}
          value={adapterToUse.date('2019-06-15')}
          maxDate={adapterToUse.date('2019-06-04')}
        />,
      );

      expect(queryByTextInView('2018')).not.to.equal(null);
      expect(queryByTextInView('2019')).not.to.equal(null);
      expect(queryByTextInView('2020')).to.equal(null);
    });
  });
};
