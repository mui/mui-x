import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { TransitionProps } from '@mui/material/transitions';
import { inputBaseClasses } from '@mui/material/InputBase';
import { act, screen } from '@mui/internal-test-utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { createPickerRenderer, adapterToUse, openPickerAsync } from 'test/utils/pickers';
import { describeSkipIf, testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { PickersActionBar, PickersActionBarAction } from '@mui/x-date-pickers/PickersActionBar';

describe('<DesktopDatePicker />', () => {
  const { render } = createPickerRenderer();

  describe('Views', () => {
    it('should switch between views uncontrolled', async () => {
      const handleViewChange = spy();
      const { user } = render(
        <DesktopDatePicker
          open
          slotProps={{ toolbar: { hidden: false } }}
          defaultValue={adapterToUse.date('2018-01-01')}
          onViewChange={handleViewChange}
        />,
      );

      // Specifically selecting the button element to avoid the ripple effect triggering act warnings.
      await user.click(screen.getByLabelText(/switch to year view/i, { selector: 'button' }));
      expect(handleViewChange.callCount).to.equal(1);
      expect(screen.queryByLabelText(/switch to year view/i)).to.equal(null);
      expect(screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
    });

    it('should go to the first view when re-opening the picker', async () => {
      const handleViewChange = spy();
      const { user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-01-01')}
          onViewChange={handleViewChange}
          slotProps={{ toolbar: { hidden: false } }}
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      await user.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);

      // Dismiss the picker
      await user.keyboard('[Escape]');

      await openPickerAsync(user, { type: 'date' });
      expect(handleViewChange.callCount).to.equal(2);
      expect(handleViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should go to the `openTo` view when re-opening the picker', async () => {
      const handleViewChange = spy();
      const { user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-01-01')}
          onViewChange={handleViewChange}
          openTo="month"
          views={['year', 'month', 'day']}
          slotProps={{ toolbar: { hidden: false } }}
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      await user.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);

      // Dismiss the picker
      await user.keyboard('[Escape]');

      await openPickerAsync(user, { type: 'date' });
      expect(handleViewChange.callCount).to.equal(2);
      expect(handleViewChange.lastCall.firstArg).to.equal('month');
    });

    it('should go to the relevant `view` when `views` prop changes', async () => {
      const { setProps, user } = render(
        <DesktopDatePicker defaultValue={adapterToUse.date('2018-01-01')} views={['year']} />,
      );

      await openPickerAsync(user, { type: 'date' });

      expect(screen.getByRole('radio', { checked: true, name: '2018' })).not.to.equal(null);

      // Dismiss the picker
      await user.keyboard('[Escape]');
      setProps({ views: ['month', 'year'] });
      await openPickerAsync(user, { type: 'date' });
      // should have changed the open view
      expect(screen.getByRole('radio', { checked: true, name: 'January' })).not.to.equal(null);
    });

    testSkipIf(isJSDOM)('should move the focus to the newly opened views', async () => {
      const { user } = render(
        <DesktopDatePicker defaultValue={new Date(2019, 5, 5)} openTo="year" />,
      );

      await openPickerAsync(user, { type: 'date' });
      expect(document.activeElement).to.have.text('2019');

      await user.click(screen.getByText('2020'));
      expect(document.activeElement).to.have.text('5');
    });

    it('should go to the relevant `view` when `view` prop changes', async () => {
      const { setProps, user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-01-01')}
          views={['year', 'month', 'day']}
          view="month"
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      expect(screen.getByRole('radio', { checked: true, name: 'January' })).not.to.equal(null);

      // Dismiss the picker
      await user.keyboard('[Escape]');
      setProps({ view: 'year' });
      await openPickerAsync(user, { type: 'date' });
      // should have changed the open view
      expect(screen.getByRole('radio', { checked: true, name: '2018' })).not.to.equal(null);
    });
  });

  // JSDOM has neither layout nor window.scrollTo
  describeSkipIf(isJSDOM)('scroll', () => {
    const NoTransition = React.forwardRef(function NoTransition(
      props: TransitionProps & { children?: React.ReactNode },
      ref: React.Ref<HTMLDivElement>,
    ) {
      const { children, in: inProp } = props;

      if (!inProp) {
        return null;
      }
      return (
        <div ref={ref} tabIndex={-1}>
          {children}
        </div>
      );
    });

    let originalScrollX: number;
    let originalScrollY: number;

    beforeEach(() => {
      originalScrollX = window.screenX;
      originalScrollY = window.scrollY;
    });

    afterEach(() => {
      if (!isJSDOM) {
        window.scrollTo?.(originalScrollX, originalScrollY);
      }
    });

    it('does not scroll when opened', () => {
      const handleClose = spy();
      const handleOpen = spy();
      function BottomAnchoredDesktopTimePicker() {
        const [anchorEl, anchorElRef] = React.useState<HTMLElement | null>(null);

        React.useEffect(() => {
          if (anchorEl !== null) {
            window.scrollTo(0, anchorEl.getBoundingClientRect().top);
          }
        }, [anchorEl]);

        return (
          <React.Fragment>
            <div style={{ height: '200vh' }}>Spacer</div>
            <DesktopDatePicker
              defaultValue={adapterToUse.date('2018-01-01')}
              onClose={handleClose}
              onOpen={handleOpen}
              slots={{
                desktopTransition: NoTransition,
              }}
              slotProps={{
                openPickerButton: {
                  ref: anchorElRef,
                },
              }}
            />
          </React.Fragment>
        );
      }
      render(<BottomAnchoredDesktopTimePicker />);
      const scrollYBeforeOpen = window.scrollY;

      // Can't use `userEvent.click` as it scrolls the window before it clicks on browsers.
      act(() => {
        screen.getByLabelText(/choose date/i).click();
      });

      expect(handleClose.callCount).to.equal(0);
      expect(handleOpen.callCount).to.equal(1);
      expect(window.scrollY, 'focus caused scroll').to.equal(scrollYBeforeOpen);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', async () => {
      const onOpen = spy();

      const { user } = render(<DesktopDatePicker onOpen={onOpen} />);

      await user.click(screen.getByLabelText(/Choose date/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onAccept when selecting the same date after changing the year', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={adapterToUse.date('2018-01-01')}
          openTo="year"
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      // Select year
      await user.click(screen.getByRole('radio', { name: '2025' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date (same value)
      await user.click(screen.getByRole('gridcell', { name: '1' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1));
      expect(onClose.callCount).to.equal(1);
    });
  });

  describe('Month navigation', () => {
    it('should not allow to navigate to previous month if props.minDate is after the last day of the previous month', async () => {
      const { user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          minDate={adapterToUse.date('2018-02-05')}
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      expect(screen.getByLabelText('Previous month')).to.have.attribute('disabled');
    });

    it('should allow to navigate to previous month if props.minDate is the last day of the previous month', async () => {
      const { user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          minDate={adapterToUse.date('2018-01-31')}
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      expect(screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
    });

    it('should not allow to navigate to next month if props.maxDate is before the first day of the next month', async () => {
      const { user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          maxDate={adapterToUse.date('2018-02-20')}
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      expect(screen.getByLabelText('Next month')).to.have.attribute('disabled');
    });

    it('should allow to navigate to next month if props.maxDate is the first day of the next month', async () => {
      const { user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          maxDate={adapterToUse.date('2018-03-01')}
        />,
      );

      await openPickerAsync(user, { type: 'date' });

      expect(screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
    });
  });

  describe('Validation', () => {
    it('should enable the input error state when the current date has an invalid day', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-06-01')}
          shouldDisableDate={() => true}
        />,
      );

      expect(document.querySelector(`.${inputBaseClasses.error}`)).not.to.equal(null);
    });

    it('should enable the input error state when the current date has an invalid month', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-06-01')}
          shouldDisableMonth={() => true}
        />,
      );

      expect(document.querySelector(`.${inputBaseClasses.error}`)).not.to.equal(null);
    });

    it('should enable the input error state when the current date has an invalid year', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-01')}
          shouldDisableYear={() => true}
        />,
      );

      expect(document.querySelector(`.${inputBaseClasses.error}`)).not.to.equal(null);
    });
  });

  it('should throw console warning when invalid `openTo` prop is provided', () => {
    expect(async () => {
      const { user } = render(<DesktopDatePicker defaultValue={null} openTo="month" />);

      await openPickerAsync(user, { type: 'date' });
    }).toWarnDev('MUI X: `openTo="month"` is not a valid prop.');
  });

  describe('performance', () => {
    it('should not re-render the `PickersActionBar` on date change', async () => {
      const RenderCount = spy((props) => <PickersActionBar {...props} />);

      const { user } = render(
        <DesktopDatePicker
          slots={{ actionBar: React.memo(RenderCount) }}
          closeOnSelect={false}
          open
        />,
      );

      const renderCountBeforeChange = RenderCount.callCount;
      await user.click(screen.getByRole('gridcell', { name: '2' }));
      await user.click(screen.getByRole('gridcell', { name: '3' }));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(0); // no re-renders after selecting new values
    });

    it('should not re-render the `PickersActionBar` on date change with custom callback actions with root component updates', async () => {
      const RenderCount = spy((props) => <PickersActionBar {...props} />);
      const actions: PickersActionBarAction[] = ['clear', 'today'];

      const { setProps, user } = render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-01-01')}
          slots={{ actionBar: React.memo(RenderCount) }}
          slotProps={{ actionBar: () => ({ actions }) }}
          closeOnSelect={false}
          open
        />,
      );

      const renderCountBeforeChange = RenderCount.callCount;

      setProps({ defaultValue: adapterToUse.date('2018-01-04') });

      await user.click(screen.getByRole('gridcell', { name: '2' }));
      await user.click(screen.getByRole('gridcell', { name: '3' }));
      expect(RenderCount.callCount - renderCountBeforeChange).to.equal(0); // no re-renders after selecting new values and causing a root component re-render
    });
  });
});
