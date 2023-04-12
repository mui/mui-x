import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { TransitionProps } from '@mui/material/transitions';
import { inputBaseClasses } from '@mui/material/InputBase';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  expectInputValue,
  getTextbox,
} from 'test/utils/pickers-utils';

describe('<DesktopDatePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describe('Component slots: OpenPickerIcon', () => {
    it('should render custom component', () => {
      function HomeIcon(props: SvgIconProps) {
        return (
          <SvgIcon data-testid="component-test" {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </SvgIcon>
        );
      }

      const { getByTestId } = render(
        <DesktopDatePicker
          label="icon test example"
          slots={{
            openPickerIcon: HomeIcon,
          }}
        />,
      );

      expect(getByTestId('component-test')).not.to.equal(null);
    });
  });

  describe('Slots: openPickerIcon', () => {
    it('should render custom component', () => {
      function HomeIcon(props: SvgIconProps) {
        return (
          <SvgIcon data-testid="component-test" {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </SvgIcon>
        );
      }

      const { getByTestId } = render(
        <DesktopDatePicker
          label="icon test example"
          slots={{
            openPickerIcon: HomeIcon,
          }}
        />,
      );

      expect(getByTestId('component-test')).not.to.equal(null);
    });
  });

  it('allows to change selected date from the field according to `format`', () => {
    const handleChange = spy();

    render(<DesktopDatePicker onChange={handleChange} />);
    const input = getTextbox();

    fireEvent.change(input, {
      target: {
        value: '10/11/2018',
      },
    });

    expectInputValue(input, '10/11/2018');
    expect(handleChange.callCount).to.equal(1);
  });

  describe('Component slots: Toolbar', () => {
    it('should render toolbar in desktop mode when `hidden` is `false`', () => {
      render(
        <DesktopDatePicker
          open
          componentsProps={{ toolbar: { hidden: false } }}
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
        />,
      );

      expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
    });
  });

  describe('Views', () => {
    it('should switch between views uncontrolled', () => {
      const handleViewChange = spy();
      render(
        <DesktopDatePicker
          open
          componentsProps={{ toolbar: { hidden: false } }}
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          onViewChange={handleViewChange}
        />,
      );

      fireEvent.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);
      expect(screen.queryByLabelText(/switch to year view/i)).to.equal(null);
      expect(screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
    });

    it('should go to the first view when re-opening the picker', () => {
      const handleViewChange = spy();
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          onViewChange={handleViewChange}
          slotProps={{ toolbar: { hidden: false } }}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      fireEvent.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);

      // Dismiss the picker
      userEvent.keyPress(document.activeElement!, { key: 'Escape' });

      openPicker({ type: 'date', variant: 'desktop' });
      expect(handleViewChange.callCount).to.equal(2);
      expect(handleViewChange.lastCall.firstArg).to.equal('day');
    });

    it('should go to the `openTo` view when re-opening the picker', () => {
      const handleViewChange = spy();
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          onViewChange={handleViewChange}
          openTo="month"
          views={['year', 'month', 'day']}
          slotProps={{ toolbar: { hidden: false } }}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      fireEvent.click(screen.getByLabelText(/switch to year view/i));
      expect(handleViewChange.callCount).to.equal(1);

      // Dismiss the picker
      userEvent.keyPress(document.activeElement!, { key: 'Escape' });

      openPicker({ type: 'date', variant: 'desktop' });
      expect(handleViewChange.callCount).to.equal(2);
      expect(handleViewChange.lastCall.firstArg).to.equal('month');
    });
  });

  describe('Component slots: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDatePicker
          open
          slotProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Slots: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDatePicker
          open
          slotProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Component slots: DesktopPaper', () => {
    it('forwards onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDatePicker
          open
          slotProps={{
            desktopPaper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'paper',
            },
          }}
        />,
      );
      const paper = screen.getByTestId('paper');

      fireEvent.click(paper);
      fireEvent.touchStart(paper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
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
              defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
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

      fireEvent.click(screen.getByLabelText(/choose date/i));

      expect(handleClose.callCount).to.equal(0);
      expect(handleOpen.callCount).to.equal(1);
      expect(window.scrollY, 'focus caused scroll').to.equal(scrollYBeforeOpen);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<DesktopDatePicker onOpen={onOpen} />);

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onAccept when selecting the same date after changing the year', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
          openTo="year"
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Select year
      userEvent.mousePress(screen.getByRole('button', { name: '2025' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date (same value)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1));
      expect(onClose.callCount).to.equal(1);
    });
  });

  describe('Month navigation', () => {
    it('should not allow to navigate to previous month if props.minDate is after the last date of the previous month', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 1, 10))}
          minDate={adapterToUse.date(new Date(2018, 1, 5))}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Previous month')).to.have.attribute('disabled');
    });

    it('should allow to navigate to previous month if props.minDate is the last date of the previous month', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 1, 10))}
          minDate={adapterToUse.date(new Date(2018, 0, 31))}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
    });

    it('should not allow to navigate to next month if props.maxDate is before the last date of the next month', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 1, 10))}
          maxDate={adapterToUse.date(new Date(2018, 1, 20))}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Next month')).to.have.attribute('disabled');
    });

    it('should allow to navigate to next month if props.maxDate is the first date of the next month', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 1, 10))}
          minDate={adapterToUse.date(new Date(2018, 0, 1))}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
    });

    it('should allow to navigate to previous and next month if props.minDate == null', () => {
      render(<DesktopDatePicker minDate={null} />);

      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
      expect(screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
    });
  });

  describe('Validation', () => {
    it('should enable the input error state when the current date has an invalid day', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 5, 1))}
          shouldDisableDate={() => true}
        />,
      );

      expect(document.querySelector(`.${inputBaseClasses.error}`)).to.not.equal(null);
    });

    it('should enable the input error state when the current date has an invalid month', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 5, 1))}
          shouldDisableMonth={() => true}
        />,
      );

      expect(document.querySelector(`.${inputBaseClasses.error}`)).to.not.equal(null);
    });

    it('should enable the input error state when the current date has an invalid year', () => {
      render(
        <DesktopDatePicker
          defaultValue={adapterToUse.date(new Date(2018, 1, 1))}
          shouldDisableYear={() => true}
        />,
      );

      expect(document.querySelector(`.${inputBaseClasses.error}`)).to.not.equal(null);
    });
  });

  it('should throw console warning when invalid `openTo` prop is provided', () => {
    expect(() => {
      render(<DesktopDatePicker defaultValue={null} openTo="month" />);

      openPicker({ type: 'date', variant: 'desktop' });
    }).toWarnDev('MUI: `openTo="month"` is not a valid prop.');
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(
        <DesktopDatePicker
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
          slotProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );
      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
