import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { adapterToUse } from 'test/utils/pickers';
import { SinonFakeTimers, useFakeTimers } from 'sinon';
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

  describe.skipIf(componentFamily === 'field' || !views.includes('year'))('year view:', () => {
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

    describe('with fake timers', () => {
      // TODO: temporary for vitest. Can move to `vi.useFakeTimers`
      let timer: SinonFakeTimers | null = null;
      beforeEach(() => {
        timer = useFakeTimers({ now: new Date(2018, 0, 1), toFake: ['Date'] });
      });
      afterEach(() => {
        timer?.restore();
      });
      it('should apply disablePast', () => {
        const now = adapterToUse.date();
        function WithFakeTimer(props: any) {
          return <ElementToTest value={now} {...props} />;
        }
        render(<WithFakeTimer {...defaultProps} disablePast />);

        const nextYear = adapterToUse.addYears(now, 1);
        const prevYear = adapterToUse.addYears(now, -1);

        expect(queryByTextInView(adapterToUse.format(now, 'year'))).not.to.have.attribute(
          'disabled',
        );
        expect(queryByTextInView(adapterToUse.format(nextYear, 'year'))).not.to.have.attribute(
          'disabled',
        );
        expect(queryByTextInView(adapterToUse.format(prevYear, 'year'))).to.have.attribute(
          'disabled',
        );
      });

      it('should apply disableFuture', () => {
        const now = adapterToUse.date();
        function WithFakeTimer(props: any) {
          return <ElementToTest value={now} {...props} />;
        }
        render(<WithFakeTimer {...defaultProps} disableFuture />);

        const nextYear = adapterToUse.addYears(now, 1);
        const prevYear = adapterToUse.addYears(now, -1);

        expect(queryByTextInView(adapterToUse.format(now, 'year'))).not.to.have.attribute(
          'disabled',
        );
        expect(queryByTextInView(adapterToUse.format(nextYear, 'year'))).to.have.attribute(
          'disabled',
        );
        expect(queryByTextInView(adapterToUse.format(prevYear, 'year'))).not.to.have.attribute(
          'disabled',
        );
      });
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
