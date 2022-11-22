import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<DateTimePicker />', () => {
  function ControlledDateTimePicker() {
    const [value, setValue] = React.useState<Date | null>(null);
    return (
      <DateTimePicker
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  }

  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValidation(DateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'legacy-picker',
  }));

  it('should handle controlled `onChange` in desktop mode', () => {
    render(<ControlledDateTimePicker />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '02/22/2022 11:30am' } });

    expect(screen.getByDisplayValue('02/22/2022 11:30 am')).not.to.equal(null);
  });

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(
      <DateTimePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={null}
      />,
    );

    expect(screen.getByLabelText(/Choose date/)).to.have.tagName('input');

    window.matchMedia = originalMatchMedia;
  });
});
