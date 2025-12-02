import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import ButtonBase from '@mui/material/ButtonBase';
import { PickerDay2, pickerDay2Classes as classes } from '@mui/x-date-pickers/PickerDay2';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<PickerDay2 />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <PickerDay2
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
      muiName: 'MuiPickerDay2',
      refInstanceof: window.HTMLButtonElement,
      testVariantProps: { variant: 'disableMargin' },
      skip: ['componentProp', 'componentsProp'],
    }),
  );

  it('selects the date on click, Enter and Space', () => {
    const handleDaySelect = spy();
    const day = adapterToUse.date();
    render(
      <PickerDay2
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
      <PickerDay2
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
      <PickerDay2
        day={adapterToUse.date('2020-02-02T02:02:02.000')}
        outsideCurrentMonth={false}
        isFirstVisibleCell={false}
        isLastVisibleCell={false}
        onDaySelect={() => {}}
      >
        2 (free)
      </PickerDay2>,
    );

    const day = screen.getByRole('button');
    expect(day).to.have.text('2 (free)');
    expect(day).toHaveAccessibleName('2 (free)');
  });
});
