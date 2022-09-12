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
});
