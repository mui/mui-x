import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DateRangePickerDay,
  dateRangePickerDayClasses as classes,
} from '@mui/x-date-pickers-pro/DateRangePickerDay';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

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
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
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
              dayWithoutMargin: {
                opacity: '0.3',
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

      const { container: container3 } = render(
        <ThemeProvider theme={theme}>
          <DateRangePickerDay
            day={adapterToUse.date('2018-01-15')}
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
            disableMargin
          />
        </ThemeProvider>,
      );

      // 2018-01-15 is NOT start/end of month, but has disableMargin
      expect(container3.firstChild).to.have.style('opacity', '0.3');

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
});
