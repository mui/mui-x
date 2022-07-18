import * as React from 'react';
import { expect } from 'chai';
import TextField from '@mui/material/TextField';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { createPickerRenderer, adapterToUse } from '../../../../test/utils/pickers-utils';

describe('<StaticDatePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('render proper month', () => {
    render(
      <StaticDatePicker
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByText('January 2019')).toBeVisible();
    expect(screen.getAllByMuiTest('day')).to.have.length(31);
  });

  it('switches between months', () => {
    render(
      <StaticDatePicker
        reduceAnimations
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByMuiTest('calendar-month-and-year-text')).to.have.text('January 2019');

    const nextMonth = screen.getByLabelText('Next month');
    const previousMonth = screen.getByLabelText('Previous month');
    fireEvent.click(nextMonth);
    fireEvent.click(nextMonth);

    fireEvent.click(previousMonth);
    fireEvent.click(previousMonth);
    fireEvent.click(previousMonth);

    expect(screen.getByMuiTest('calendar-month-and-year-text')).to.have.text('December 2018');
  });

  it('prop `shouldDisableYear` – disables years dynamically', () => {
    render(
      <StaticDatePicker
        renderInput={(params) => <TextField {...params} />}
        openTo="year"
        onChange={() => {}}
        // getByRole() with name attribute is too slow, so restrict the number of rendered years
        minDate={adapterToUse.date(new Date(2025, 0, 1))}
        maxDate={adapterToUse.date(new Date(2035, 0, 1))}
        value={adapterToUse.date(new Date(2018, 0, 1))}
        shouldDisableYear={(year) => adapterToUse.getYear(year) === 2030}
      />,
    );

    const getYearButton = (year: number) =>
      screen.getByText(year.toString(), { selector: 'button' });

    expect(getYearButton(2029)).not.to.have.attribute('disabled');
    expect(getYearButton(2030)).to.have.attribute('disabled');
    expect(getYearButton(2031)).not.to.have.attribute('disabled');
  });

  it('prop `shouldDisableMonth` – disables months dynamically', () => {
    render(
      <StaticDatePicker
        renderInput={(params) => <TextField {...params} />}
        views={['year', 'month']}
        openTo="month"
        onChange={() => {}}
        minDate={adapterToUse.date(new Date(2021, 0, 1))}
        maxDate={adapterToUse.date(new Date(2022, 0, 1))}
        value={adapterToUse.date(new Date(2021, 4, 1))}
        shouldDisableMonth={(month) => {
          return adapterToUse.getYear(month) === 2021 && adapterToUse.getMonth(month) === 2;
        }}
      />,
    );

    const getMonthButton = (month: string) => screen.getByText(month, { selector: 'button' });

    expect(getMonthButton('Feb')).not.to.have.attribute('disabled');
    expect(getMonthButton('Mar')).to.have.attribute('disabled');
    expect(getMonthButton('Apr')).not.to.have.attribute('disabled');
  });
});
