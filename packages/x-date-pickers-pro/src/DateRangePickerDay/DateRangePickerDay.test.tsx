import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DateRangePickerDay,
  dateRangePickerDayClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import type { DateRangePickerDayProps } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DateRangePickerDay />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <DateRangePickerDay
      day={adapterToUse.date()}
      outsideCurrentMonth={false}
      selected
      onDaySelect={() => {}}
      isHighlighting
      isPreviewing
      isStartOfPreviewing
      isEndOfPreviewing
      isStartOfHighlighting
      isEndOfHighlighting
      isFirstVisibleCell
      isLastVisibleCell={false}
    />,
    () => ({
      classes,
      inheritComponent: 'button',
      muiName: 'MuiDateRangePickerDay',
      render,
      refInstanceof: window.HTMLButtonElement,
      // cannot test reactTestRenderer because of required context
      skip: ['componentProp', 'themeVariants'],
    }),
  );

  describe('styleOverrides', () => {
    it('should apply custom styleOverrides', () => {
      const theme = createTheme({
        components: {
          MuiDateRangePickerDay: {
            styleOverrides: {
              startOfMonth: {
                opacity: '0.1',
              },
              endOfMonth: {
                opacity: '0.2',
              },
              previewed: {
                opacity: '0.4',
              },
            },
          },
        },
      });

      const day = adapterToUse.date('2018-01-01');
      const { container: container1 } = render(
        <ThemeProvider theme={theme}>
          <DateRangePickerDay
            day={day}
            onDaySelect={() => {}}
            outsideCurrentMonth={false}
            isHighlighting={false}
            isPreviewing={false}
            isStartOfPreviewing={false}
            isEndOfPreviewing={false}
            isStartOfHighlighting={false}
            isEndOfHighlighting={false}
            isFirstVisibleCell={false}
            isLastVisibleCell={false}
          />
        </ThemeProvider>,
      );

      // 2018-01-01 is start of month
      expect(container1.firstChild).to.have.style('opacity', '0.1');

      const { container: container2 } = render(
        <ThemeProvider theme={theme}>
          <DateRangePickerDay
            day={adapterToUse.date('2018-01-31')}
            onDaySelect={() => {}}
            outsideCurrentMonth={false}
            isHighlighting={false}
            isPreviewing={false}
            isStartOfPreviewing={false}
            isEndOfPreviewing={false}
            isStartOfHighlighting={false}
            isEndOfHighlighting={false}
            isFirstVisibleCell={false}
            isLastVisibleCell={false}
          />
        </ThemeProvider>,
      );

      // 2018-01-31 is end of month
      expect(container2.firstChild).to.have.style('opacity', '0.2');

      const { container: container4 } = render(
        <ThemeProvider theme={theme}>
          <DateRangePickerDay
            day={adapterToUse.date('2018-01-15')}
            onDaySelect={() => {}}
            outsideCurrentMonth={false}
            isHighlighting={false}
            isPreviewing
            isStartOfPreviewing={false}
            isEndOfPreviewing={false}
            isStartOfHighlighting={false}
            isEndOfHighlighting={false}
            isFirstVisibleCell={false}
            isLastVisibleCell={false}
          />
        </ThemeProvider>,
      );

      // 2018-01-15 is NOT start/end of month, but is previewed
      expect(container4.firstChild).to.have.style('opacity', '0.4');
    });
  });

  describe('disabled day', () => {
    const disabledDayProps = {
      onDaySelect: () => {},
      outsideCurrentMonth: false,
      disabled: true,
      isHighlighting: true,
      isPreviewing: false,
      isStartOfPreviewing: false,
      isEndOfPreviewing: false,
      isFirstVisibleCell: false,
      isLastVisibleCell: false,
    };

    it('should not dim the day inside the selected range', () => {
      const { container } = render(
        <DateRangePickerDay
          {...disabledDayProps}
          day={adapterToUse.date('2018-01-15')}
          isStartOfHighlighting={false}
          isEndOfHighlighting={false}
        />,
      );

      expect(container.firstChild).to.have.class(classes.insideSelection);
      expect(container.firstChild).to.have.style('opacity', '1');
    });

    it('should use the disabled text color outside of the current month', () => {
      const theme = createTheme({
        palette: { text: { disabled: 'rgb(1, 2, 3)', secondary: 'rgb(4, 5, 6)' } },
      });

      const { container } = render(
        <ThemeProvider theme={theme}>
          <DateRangePickerDay
            {...disabledDayProps}
            day={adapterToUse.date('2018-02-01')}
            outsideCurrentMonth
            showDaysOutsideCurrentMonth
            isStartOfHighlighting={false}
            isEndOfHighlighting={false}
          />
        </ThemeProvider>,
      );

      expect(container.firstChild).to.have.style('color', 'rgb(1, 2, 3)');
    });

    it('should not dim the day at the edge of the selected range', () => {
      const { container } = render(
        <DateRangePickerDay
          {...disabledDayProps}
          day={adapterToUse.date('2018-01-15')}
          isStartOfHighlighting
          isEndOfHighlighting={false}
        />,
      );

      expect(container.firstChild).to.have.class(classes.selectionStart);
      expect(container.firstChild).to.have.style('opacity', '1');
    });
  });

  describe('filler cell', () => {
    it('should stay hidden when it is disabled and inside the selected range', () => {
      const { container } = render(
        <DateRangePickerDay
          day={adapterToUse.date('2018-02-01')}
          onDaySelect={() => {}}
          outsideCurrentMonth
          disabled
          isHighlighting
          isPreviewing={false}
          isStartOfPreviewing={false}
          isEndOfPreviewing={false}
          isStartOfHighlighting={false}
          isEndOfHighlighting={false}
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
        />,
      );

      expect(container.firstChild).to.have.class(classes.fillerCell);
      expect(container.firstChild).not.to.have.class(classes.selected);
      expect(container.firstChild).not.to.have.class(classes.insideSelection);
      expect(container.firstChild).to.have.style('opacity', '0');
    });

    it('should keep the role and the column index it received', () => {
      const { container } = render(
        <DateRangePickerDay
          day={adapterToUse.date('2018-02-01')}
          onDaySelect={() => {}}
          outsideCurrentMonth
          role="gridcell"
          aria-colindex={5}
          isPreviewing={false}
          isStartOfPreviewing={false}
          isEndOfPreviewing={false}
          isStartOfHighlighting={false}
          isEndOfHighlighting={false}
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
        />,
      );

      expect(container.firstChild).to.have.class(classes.fillerCell);
      expect(container.firstChild).to.have.attribute('role', 'gridcell');
      expect(container.firstChild).to.have.attribute('aria-colindex', '5');
    });
  });

  // jsdom does not compute styles of pseudo-elements.
  describe.skipIf(isJSDOM)('highlight rounding', () => {
    const renderInsideSelection = (
      props: Partial<Pick<DateRangePickerDayProps, 'isFirstVisibleCell' | 'isLastVisibleCell'>>,
    ) =>
      render(
        <DateRangePickerDay
          day={adapterToUse.date('2018-01-15')}
          onDaySelect={() => {}}
          outsideCurrentMonth={false}
          isHighlighting
          isPreviewing={false}
          isStartOfPreviewing={false}
          isEndOfPreviewing={false}
          isStartOfHighlighting={false}
          isEndOfHighlighting={false}
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
          {...props}
        />,
      );

    it('should round the end of the highlight on the last visible cell', () => {
      const { container } = renderInsideSelection({ isLastVisibleCell: true });
      const highlight = getComputedStyle(container.firstChild as Element, '::before');

      expect(highlight.borderTopRightRadius).not.to.equal('0px');
      expect(highlight.borderBottomRightRadius).not.to.equal('0px');
    });

    it('should round the start of the highlight on the first visible cell', () => {
      const { container } = renderInsideSelection({ isFirstVisibleCell: true });
      const highlight = getComputedStyle(container.firstChild as Element, '::before');

      expect(highlight.borderTopLeftRadius).not.to.equal('0px');
      expect(highlight.borderBottomLeftRadius).not.to.equal('0px');
    });

    it('should not round the highlight in the middle of the grid', () => {
      const { container } = renderInsideSelection({});
      const highlight = getComputedStyle(container.firstChild as Element, '::before');

      expect(highlight.borderTopRightRadius).to.equal('0px');
      expect(highlight.borderTopLeftRadius).to.equal('0px');
    });
  });
});
