import * as React from 'react';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/* eslint-disable material-ui/disallow-active-element-as-key-event-target */
describe('<YearCalendar /> - Keyboard', () => {
  const { render } = createPickerRenderer({ clock: 'fake', clockConfig: new Date(2000, 0, 1) });

  const RTL_THEME = createTheme({
    direction: 'rtl',
  });

  function changeYear(
    keyPressed: string,
    expectedValue: string,
    yearsOrder: 'asc' | 'desc' = 'asc',
    direction: 'ltr' | 'rtl' = 'ltr',
  ) {
    const yearCalendar = (
      <YearCalendar
        value={adapterToUse.date('2000-01-01')}
        minDate={adapterToUse.date('1999-01-01')}
        maxDate={adapterToUse.date('2001-01-01')}
        yearsOrder={yearsOrder}
      />
    );

    const elementsToRender =
      direction === 'rtl' ? (
        <ThemeProvider theme={RTL_THEME}>{yearCalendar}</ThemeProvider>
      ) : (
        yearCalendar
      );

    render(elementsToRender);
    const startYear = screen.getByRole('radio', { checked: true });
    fireEvent.focus(startYear);
    fireEvent.keyDown(document.activeElement!, { key: keyPressed });
    expect(document.activeElement?.textContent).to.equal(expectedValue);
  }

  it('should increase the year when pressing right and yearsOrder is asc (default)', () => {
    changeYear('ArrowRight', '2001');
  });

  it('should decrease the year when pressing left and yearsOrder is asc (default)', () => {
    changeYear('ArrowLeft', '1999');
  });

  it('should decrease the year when pressing right and yearsOrder is desc', () => {
    changeYear('ArrowRight', '1999', 'desc');
  });

  it('should increase the year when pressing left and yearsOrder is desc', () => {
    changeYear('ArrowLeft', '2001', 'desc');
  });

  it('should decrease the year when pressing right and yearsOrder is asc (default) and theme is RTL', () => {
    changeYear('ArrowRight', '1999', 'asc', 'rtl');
  });

  it('should increase the year when pressing left and yearsOrder is asc (default) and theme is RTL', () => {
    changeYear('ArrowLeft', '2001', 'asc', 'rtl');
  });

  it('should increase the year when pressing right and yearsOrder is desc and theme is RTL', () => {
    changeYear('ArrowRight', '2001', 'desc', 'rtl');
  });

  it('should decrease the year when pressing left and yearsOrder is desc and theme is RTL', () => {
    changeYear('ArrowLeft', '1999', 'desc', 'rtl');
  });
});
