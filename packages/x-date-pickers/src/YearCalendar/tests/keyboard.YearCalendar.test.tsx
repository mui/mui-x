import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<YearCalendar /> - Keyboard', () => {
  const { render } = createPickerRenderer();

  const RTL_THEME = createTheme({
    direction: 'rtl',
  });

  async function changeYear(
    userEventKey: string,
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

    const { user } = render(elementsToRender);
    // Move focus to the current year
    await user.keyboard('{Tab}');
    await user.keyboard(userEventKey);
    expect(document.activeElement?.textContent).to.equal(expectedValue);
  }

  it('should increase the year when pressing right and yearsOrder is asc (default)', async () => {
    await changeYear('{ArrowRight}', '2001');
  });

  it('should decrease the year when pressing left and yearsOrder is asc (default)', async () => {
    await changeYear('{ArrowLeft}', '1999');
  });

  it('should decrease the year when pressing right and yearsOrder is desc', async () => {
    await changeYear('{ArrowRight}', '1999', 'desc');
  });

  it('should increase the year when pressing left and yearsOrder is desc', async () => {
    await changeYear('{ArrowLeft}', '2001', 'desc');
  });

  it('should decrease the year when pressing right and yearsOrder is asc (default) and theme is RTL', async () => {
    await changeYear('{ArrowRight}', '1999', 'asc', 'rtl');
  });

  it('should increase the year when pressing left and yearsOrder is asc (default) and theme is RTL', async () => {
    await changeYear('{ArrowLeft}', '2001', 'asc', 'rtl');
  });

  it('should increase the year when pressing right and yearsOrder is desc and theme is RTL', async () => {
    await changeYear('{ArrowRight}', '2001', 'desc', 'rtl');
  });

  it('should decrease the year when pressing left and yearsOrder is desc and theme is RTL', async () => {
    await changeYear('{ArrowLeft}', '1999', 'desc', 'rtl');
  });
});
