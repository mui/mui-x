import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { describeConformance, fireEvent, screen } from '@mui/monorepo/test/utils';
import ButtonBase from '@mui/material/ButtonBase';
import { PickersDay, pickersDayClasses as classes } from '@mui/x-date-pickers/PickersDay';
import { adapterToUse, wrapPickerMount, createPickerRenderer } from 'test/utils/pickers';

describe('<PickersDay />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <PickersDay
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
      wrapMount: wrapPickerMount,
      muiName: 'MuiPickersDay',
      refInstanceof: window.HTMLButtonElement,
      testVariantProps: { variant: 'disableMargin' },
      // cannot test reactTestRenderer because of required context
      skip: ['componentProp', 'componentsProp', 'reactTestRenderer'],
    }),
  );

  it('selects the date on click, Enter and Space', () => {
    const handleDaySelect = spy();
    const day = adapterToUse.date();
    render(
      <PickersDay
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

    fireEvent.click(targetDay);

    expect(handleDaySelect.callCount).to.equal(1);
    expect(handleDaySelect.args[0][0]).toEqualDateTime(day);
  });

  it('renders the day of the month by default', () => {
    render(
      <PickersDay
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

  it('should render children instead of the day of the month when children prop is present', () => {
    render(
      <PickersDay
        day={adapterToUse.date('2020-02-02T02:02:02.000')}
        outsideCurrentMonth={false}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
        onDaySelect={() => {}}
      >
        2 (free)
      </PickersDay>,
    );

    const day = screen.getByRole('button');
    expect(day).to.have.text('2 (free)');
    expect(day).toHaveAccessibleName('2 (free)');
  });
});
