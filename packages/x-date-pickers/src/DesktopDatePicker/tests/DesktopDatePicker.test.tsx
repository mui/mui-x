import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { TransitionProps } from '@mui/material/transitions';
import { inputBaseClasses } from '@mui/material/InputBase';
import { screen } from '@mui/internal-test-utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { createPickerRenderer, adapterToUse, openPicker } from 'test/utils/pickers';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

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
          reduceAnimations
        />,
      );

      await user.click(screen.getByLabelText(/switch to year view/i));

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

      await openPicker({ type: 'date', variant: 'desktop' });

      await user.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);

      // Dismiss the picker
      await user.keyboard('{Escape}');

      await openPicker({ type: 'date', variant: 'desktop' });
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

      await openPicker({ type: 'date', variant: 'desktop' });

      await user.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);

      // Dismiss the picker
      await user.keyboard('{Escape}');

      await openPicker({ type: 'date', variant: 'desktop' });
      expect(handleViewChange.callCount).to.equal(2);
      expect(handleViewChange.lastCall.firstArg).to.equal('month');
    });

    it('should go to the relevant `view` when `views` prop changes', async () => {
      const { setProps, user } = render(
        <DesktopDatePicker defaultValue={adapterToUse.date('2018-01-01')} views={['year']} />,
      );

      await openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByRole('radio', { checked: true, name: '2018' })).not.to.equal(null);

      // Dismiss the picker
      await user.keyboard('{Escape}');
      setProps({ views: ['month', 'year'] });
      await openPicker({ type: 'date', variant: 'desktop' });

      // should have changed the open view
      expect(screen.getByRole('radio', { checked: true, name: 'January' })).not.to.equal(null);
    });

    it('should move the focus to the newly opened views', async function test() {
      if (isJSDOM) {
        this.skip();
      }
      const { user } = render(
        <DesktopDatePicker defaultValue={new Date(2019, 5, 5)} openTo="year" />,
      );

      await openPicker({ type: 'date', variant: 'desktop' });
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

      await openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByRole('radio', { checked: true, name: 'January' })).not.to.equal(null);

      // Dismiss the picker
      await user.keyboard('{Escape}');
      setProps({ view: 'year' });
      await openPicker({ type: 'date', variant: 'desktop' });

      // should have changed the open view
      expect(screen.getByRole('radio', { checked: true, name: '2018' })).not.to.equal(null);
    });
  });

  describe('scroll', () => {
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

    before(function beforeHook() {
      // JSDOM has neither layout nor window.scrollTo
      if (/jsdom/.test(window.navigator.userAgent)) {
        this.skip();
      }
    });

    let originalScrollX: number;
    let originalScrollY: number;

    beforeEach(() => {
      originalScrollX = window.screenX;
      originalScrollY = window.scrollY;
    });

    afterEach(() => {
      window.scrollTo(originalScrollX, originalScrollY);
    });

    it('does not scroll when opened', async () => {
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
      const { user } = render(<BottomAnchoredDesktopTimePicker />);
      const scrollYBeforeOpen = window.scrollY;

      await user.click(screen.getByLabelText(/choose date/i));

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

      await openPicker({ type: 'date', variant: 'desktop' });

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
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          minDate={adapterToUse.date('2018-02-05')}
        />,
      );

      await openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Previous month')).to.have.attribute('disabled');
    });

    it('should allow to navigate to previous month if props.minDate is the last day of the previous month', async () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          minDate={adapterToUse.date('2018-01-31')}
        />,
      );

      await openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
    });

    it('should not allow to navigate to next month if props.maxDate is before the first day of the next month', async () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          maxDate={adapterToUse.date('2018-02-20')}
        />,
      );

      await openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Next month')).to.have.attribute('disabled');
    });

    it('should allow to navigate to next month if props.maxDate is the first day of the next month', async () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-02-10')}
          maxDate={adapterToUse.date('2018-03-01')}
        />,
      );

      await openPicker({ type: 'date', variant: 'desktop' });

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
      render(<DesktopDatePicker defaultValue={null} openTo="month" />);

      await openPicker({ type: 'date', variant: 'desktop' });
    }).toWarnDev('MUI X: `openTo="month"` is not a valid prop.');
  });
});
