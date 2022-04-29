import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';
import { fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import {
  createPickerRenderer,
  FakeTransitionComponent,
  adapterToUse,
  withPickerControls,
  openPicker,
} from '../../../../test/utils/pickers-utils';

const WrappedDesktopDatePicker = withPickerControls(DesktopDatePicker)({
  DialogProps: { TransitionComponent: FakeTransitionComponent },
  renderInput: (params) => <TextField {...params} />,
});

describe('<DesktopDatePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  it('prop: components.OpenPickerIcon', () => {
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
        value={null}
        onChange={() => {}}
        components={{
          OpenPickerIcon: HomeIcon,
        }}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(getByTestId('component-test')).not.to.equal(null);
  });

  ['readOnly', 'disabled'].forEach((prop) => {
    it(`cannot be opened when "Choose date" is clicked when ${prop}={true}`, () => {
      const handleOpen = spy();
      render(
        <DesktopDatePicker
          value={adapterToUse.date('2019-01-01T00:00:00.000')}
          {...{ [prop]: true }}
          onChange={() => {}}
          onOpen={handleOpen}
          open={false}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(handleOpen.callCount).to.equal(0);
    });
  });

  it('allows to change selected date from the input according to `format`', () => {
    const onChangeMock = spy();
    render(
      <DesktopDatePicker
        renderInput={(props) => <TextField placeholder="10/10/2018" {...props} />}
        label="Masked input"
        inputFormat="dd/MM/yyyy"
        value={adapterToUse.date('2018-01-01T00:00:00.000Z')}
        onChange={onChangeMock}
        InputAdornmentProps={{
          disableTypography: true,
        }}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: {
        value: '10/11/2018',
      },
    });

    expect(screen.getByRole('textbox')).to.have.value('10/11/2018');
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('prop `showToolbar` – renders toolbar in desktop mode', () => {
    render(
      <DesktopDatePicker
        open
        showToolbar
        onChange={() => {}}
        TransitionComponent={FakeTransitionComponent}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByMuiTest('picker-toolbar')).toBeVisible();
  });

  it('switches between views uncontrolled', () => {
    const handleViewChange = spy();
    render(
      <DesktopDatePicker
        open
        showToolbar
        onChange={() => {}}
        TransitionComponent={FakeTransitionComponent}
        value={adapterToUse.date('2018-01-01T00:00:00.000')}
        renderInput={(params) => <TextField {...params} />}
        onViewChange={handleViewChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/switch to year view/i));

    expect(handleViewChange.callCount).to.equal(1);
    expect(screen.queryByLabelText(/switch to year view/i)).to.equal(null);
    expect(screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
  });

  describe('prop: PopperProps', () => {
    it('forwards onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDatePicker
          open
          onChange={() => {}}
          PopperProps={{
            onClick: handleClick,
            onTouchStart: handleTouchStart,
            // @ts-expect-error `data-*` attributes are not recognized in props objects
            'data-testid': 'popper',
          }}
          renderInput={(params) => <TextField {...params} />}
          value={null}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('prop: PaperProps', () => {
    it('forwards onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDatePicker
          open
          onChange={() => {}}
          PaperProps={{
            onClick: handleClick,
            onTouchStart: handleTouchStart,
            // @ts-expect-error `data-*` attributes are not recognized in props objects
            'data-testid': 'paper',
          }}
          renderInput={(params) => <TextField {...params} />}
          value={null}
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
              value={adapterToUse.date('2018-01-01T00:00:00.000')}
              OpenPickerButtonProps={{ ref: anchorElRef }}
              onChange={() => {}}
              onClose={handleClose}
              onOpen={handleOpen}
              renderInput={(params) => <TextField {...params} />}
              TransitionComponent={NoTransition}
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

      render(<WrappedDesktopDatePicker onOpen={onOpen} initialValue={null} />);

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange, onClose and onAccept when selecting a date', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date', variant: 'desktop' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date
      fireEvent.click(screen.getByLabelText('Jan 8, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-08T00:00:00.000'),
      );
      expect(onAccept.callCount).to.equal(1);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selection a date and props.closeOnSelect = false', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Change the date
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-08T00:00:00.000'),
      );
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date
      userEvent.mousePress(screen.getByLabelText('Jan 6, 2018'));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-06T00:00:00.000'),
      );
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));

      // Dismiss the picker
      // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target -- don't care
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-08T00:00:00.000'),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Change the date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 8, 2018'));

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).toEqualDateTime(
        adapterToUse.date('2018-01-08T00:00:00.000'),
      );
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when clicking outside of the picker if not opened', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect={false}
        />,
      );

      // Dismiss the picker
      userEvent.mousePress(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = adapterToUse.date('2018-01-01T00:00:00.000');

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          clearable
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Clear the date
      fireEvent.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.equal(null);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.equal(null);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when pressing "Clear" button with an already null value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <WrappedDesktopDatePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={null}
          clearable
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Clear the date
      fireEvent.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test once the `allowSameDateSelection` behavior is cleaned
    // it('should not (?) call onChange and onAccept if same date selected', () => {});
  });
});
