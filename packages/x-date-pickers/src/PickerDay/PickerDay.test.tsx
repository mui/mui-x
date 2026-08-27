import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import ButtonBase from '@mui/material/ButtonBase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PickerDay, pickerDayClasses as classes } from '@mui/x-date-pickers/PickerDay';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';
import { describe, it, expect, vi } from 'vitest';

describe('<PickerDay />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <PickerDay
      day={adapterToUse.date()}
      outsideCurrentMonth={false}
      isFirstVisibleCell={false}
      isLastVisibleCell={false}
      selected
      onDaySelect={() => {}}
    />,
    () => ({
      classes,
      inheritComponent: ButtonBase,
      render,
      muiName: 'MuiPickerDay',
      refInstanceof: window.HTMLButtonElement,
      testVariantProps: { variant: 'variant' },
      skip: ['componentProp'],
    }),
  );

  it('selects the date on click, Enter and Space', async () => {
    const handleDaySelect = vi.fn();
    const day = adapterToUse.date();
    const { user } = render(
      <PickerDay
        day={day}
        outsideCurrentMonth={false}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
        onDaySelect={handleDaySelect}
      />,
    );
    const targetDay = screen.getByRole('button', { name: adapterToUse.format(day, 'dayOfMonth') });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetDay.tagName).to.equal('BUTTON');

    await user.click(targetDay);

    expect(handleDaySelect.mock.calls.length).to.equal(1);
    expect(handleDaySelect.mock.calls[0][0]).toEqualDateTime(day);
  });

  it('renders the day of the month by default', () => {
    render(
      <PickerDay
        day={adapterToUse.date('2020-02-02T02:02:02.000')}
        onDaySelect={() => {}}
        outsideCurrentMonth={false}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
      />,
    );

    const day = screen.getByRole('button');
    expect(day).to.have.text('2');
    expect(day).toHaveAccessibleName('2');
  });

  it('should keep the role and the column index a filler cell received', () => {
    const { container } = render(
      <PickerDay
        day={adapterToUse.date('2018-02-01')}
        onDaySelect={() => {}}
        outsideCurrentMonth
        role="gridcell"
        aria-colindex={5}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
      />,
    );

    expect(container.firstChild).to.have.class(classes.fillerCell);
    expect(container.firstChild).to.have.attribute('role', 'gridcell');
    expect(container.firstChild).to.have.attribute('aria-colindex', '5');
  });

  it('should render children instead of the day of the month when children prop is present', () => {
    render(
      <PickerDay
        day={adapterToUse.date('2020-02-02T02:02:02.000')}
        outsideCurrentMonth={false}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
        onDaySelect={() => {}}
      >
        2 (free)
      </PickerDay>,
    );

    const day = screen.getByRole('button');
    expect(day).to.have.text('2 (free)');
    expect(day).toHaveAccessibleName('2 (free)');
  });

  it('should use the disabled text color for a disabled day outside the current month', () => {
    const theme = createTheme({
      palette: { text: { disabled: 'rgb(1, 2, 3)', secondary: 'rgb(4, 5, 6)' } },
    });

    render(
      <ThemeProvider theme={theme}>
        <PickerDay
          day={adapterToUse.date('2020-02-02')}
          onDaySelect={() => {}}
          outsideCurrentMonth
          showDaysOutsideCurrentMonth
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
          disabled
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).to.have.style('color', 'rgb(1, 2, 3)');
  });
});
