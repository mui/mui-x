import * as React from 'react';
import { expect } from 'chai';
import { spy, useFakeTimers, SinonFakeTimers } from 'sinon';
import { fireEvent, screen, act, within, waitFor } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  createPickerRenderer,
  adapterToUse,
  AdapterClassToUse,
  openPickerAsync,
  getFieldSectionsContainer,
  getTextbox,
} from 'test/utils/pickers';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

const getPickerDay = (name: string, picker = 'January 2018') =>
  within(screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name });

describe('<DesktopDateRangePicker />', () => {
  const { render } = createPickerRenderer();

  it('should scroll current month to the active selection when focusing appropriate field (multi input field)', async () => {
    const { user } = render(
      <DesktopDateRangePicker
        reduceAnimations
        defaultValue={[adapterToUse.date('2019-05-19'), adapterToUse.date('2019-10-30')]}
        slots={{ field: MultiInputDateRangeField }}
      />,
    );

    await openPickerAsync(user, {
      type: 'date-range',
      initialFocus: 'start',
      fieldType: 'multi-input',
    });
    expect(screen.getByText('May 2019')).toBeVisible();

    await openPickerAsync(user, {
      type: 'date-range',
      initialFocus: 'end',
      fieldType: 'multi-input',
    });
    expect(screen.getByText('October 2019')).toBeVisible();

    // scroll back
    await openPickerAsync(user, {
      type: 'date-range',
      initialFocus: 'start',
      fieldType: 'multi-input',
    });
    expect(screen.getByText('May 2019')).toBeVisible();
  });

  it(`should not crash when opening picker with invalid date value`, async () => {
    const { user } = render(
      <DesktopDateRangePicker defaultValue={[new Date(NaN), adapterToUse.date('2019-01-31')]} />,
    );

    await openPickerAsync(user, {
      type: 'date-range',
      initialFocus: 'start',
      fieldType: 'single-input',
    });
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should respect localeText from the theme', () => {
    const theme = createTheme({
      components: {
        MuiLocalizationProvider: {
          defaultProps: {
            localeText: { start: 'Início', end: 'Fim' },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterClassToUse}>
          <DesktopDateRangePicker
            // We set the variant to standard to avoid having the label rendered in two places.
            slotProps={{
              textField: {
                variant: 'standard',
              },
            }}
            slots={{ field: MultiInputDateRangeField }}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByText('Início')).not.to.equal(null);
    expect(screen.queryByText('Fim')).not.to.equal(null);
  });

  it('should add focused class to the field when it is focused', async () => {
    // Test with accessible DOM structure
    const { unmount } = render(<DesktopDateRangePicker />);

    const sectionsContainer = getFieldSectionsContainer();
    await act(async () => sectionsContainer.focus());

    expect(sectionsContainer.parentElement).to.have.class('Mui-focused');

    unmount();

    // Test with non-accessible DOM structure
    render(<DesktopDateRangePicker enableAccessibleFieldDOMStructure={false} />);

    const input = getTextbox();
    await act(async () => input.focus());

    expect(input.parentElement).to.have.class('Mui-focused');
  });

  it('should render the input with a given `name`', () => {
    // Test with accessible DOM structure
    const { unmount } = render(<DesktopDateRangePicker name="test" />);
    expect(screen.getByRole<HTMLInputElement>('textbox', { hidden: true }).name).to.equal('test');

    unmount();

    // Test with non-accessible DOM structure
    render(<DesktopDateRangePicker enableAccessibleFieldDOMStructure={false} name="test" />);
    expect(screen.getByRole<HTMLInputElement>('textbox').name).to.equal('test');
  });

  describe('Component slot: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopDateRangePicker
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

  describe('picker state', () => {
    it('should open when clicking the start input (multi input field)', async () => {
      const onOpen = spy();

      const { user } = render(
        <DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField }} />,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    it('should open when clicking the end input (multi input field)', async () => {
      const onOpen = spy();

      const { user } = render(
        <DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField }} />,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'end',
        fieldType: 'multi-input',
      });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the start input (multi input field)`, () => {
        const onOpen = spy();

        render(
          <DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField }} />,
        );

        const startInput = getFieldSectionsContainer();
        act(() => startInput.focus());
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key });

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the end input (multi input field)`, () => {
        const onOpen = spy();

        render(
          <DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField }} />,
        );

        const endInput = getFieldSectionsContainer(1);
        act(() => endInput.focus());
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key });

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    it('should call onChange with updated start date then call onChange with updated end date, onClose and onAccept with update date range when opening from start input', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slots={{ field: MultiInputDateRangeField }}
        />,
      );

      // Open the picker
      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the start date
      await user.click(getPickerDay('3'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);

      // Change the end date
      await user.click(getPickerDay('5'));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onChange with updated end date, onClose and onAccept with update date range when opening from end input (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slots={{ field: MultiInputDateRangeField }}
        />,
      );

      // Open the picker
      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'end',
        fieldType: 'multi-input',
      });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      fireEvent.click(getPickerDay('3'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selecting the end date if props.closeOnSelect = false (multi input field)', async () => {
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect={false}
          slots={{ field: MultiInputDateRangeField }}
        />,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'end',
        fieldType: 'multi-input',
      });

      // Change the end date
      await user.click(getPickerDay('3'));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      // Change the start date (already tested)
      await user.click(getPickerDay('3'));

      // Dismiss the picker
      await user.keyboard('[Escape]');
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <div>
          <input id="test-id" />
          <DesktopDateRangePicker
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            slots={{ field: MultiInputDateRangeField }}
          />
        </div>,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });

      // Dismiss the picker
      const input = document.getElementById('test-id')!;

      await user.click(input);

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(2);
    });

    it('should call onClose and onAccept with the live value when clicking outside of the picker (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <div>
          <DesktopDateRangePicker
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={defaultValue}
            slots={{ field: MultiInputDateRangeField }}
          />
          <input id="test-id" />
        </div>,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });

      // Change the start date (already tested)
      await user.click(getPickerDay('3'));

      // Dismiss the picker
      const input = document.getElementById('test-id')!;

      await user.click(input);

      // Start date change
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when clicking outside of the picker if not opened (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          slots={{ field: MultiInputDateRangeField }}
        />,
      );

      // Dismiss the picker
      await user.click(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    // test:unit does not call `blur` when focusing another element.
    testSkipIf(isJSDOM)(
      'should call onClose when blur the current field without prior change (multi input field)',
      async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <React.Fragment>
            <DesktopDateRangePicker
              onChange={onChange}
              onAccept={onAccept}
              onClose={onClose}
              slots={{ field: MultiInputDateRangeField }}
            />
            <button type="button" id="test">
              focus me
            </button>
          </React.Fragment>,
        );

        await openPickerAsync(user, {
          type: 'date-range',
          initialFocus: 'start',
          fieldType: 'multi-input',
        });
        expect(screen.getByRole('tooltip')).toBeVisible();

        await act(async () => document.querySelector<HTMLButtonElement>('#test')!.focus());

        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        await waitFor(() => {
          expect(onClose.callCount).to.equal(1);
        });
      },
    );

    it('should call onClose and onAccept when blur the current field (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <div>
          <DesktopDateRangePicker
            defaultValue={defaultValue}
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            slots={{ field: MultiInputDateRangeField }}
          />
          <button id="test" />
        </div>,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });
      expect(screen.getByRole('tooltip')).toBeVisible();

      // Change the start date (already tested)
      await user.click(getPickerDay('3'));

      expect(onAccept.callCount).to.equal(0);

      await user.click(document.querySelector<HTMLButtonElement>('#test')!);

      // Start date change
      expect(onChange.callCount).to.equal(1);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slotProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      // Clear the date
      await user.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onChange.lastCall.args[0]).to.deep.equal([null, null]);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.deep.equal([null, null]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when pressing "Clear" button with an already null value', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          slotProps={{ actionBar: { actions: ['clear'] } }}
          value={[null, null]}
        />,
      );

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      // Clear the date
      await user.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
    it('should not close picker when switching focus from start to end input (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-06')]}
          slots={{ field: MultiInputDateRangeField }}
        />,
      );

      // Open the picker (already tested)
      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });

      // Switch to end date
      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'end',
        fieldType: 'multi-input',
      });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should not close picker when switching focus from end to start input (multi input field)', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-06')]}
          slots={{ field: MultiInputDateRangeField }}
        />,
      );

      // Open the picker (already tested)
      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'end',
        fieldType: 'multi-input',
      });

      // Switch to start date
      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'multi-input',
      });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });

  describe('disabled dates', () => {
    // TODO: temporary for vitest. Can move to `vi.useFakeTimers`
    let timer: SinonFakeTimers | null = null;

    beforeEach(() => {
      timer = useFakeTimers({ now: new Date(2018, 0, 10), toFake: ['Date'] });
    });

    afterEach(() => {
      timer?.restore();
    });

    it('should respect the disablePast prop', async () => {
      const { user } = render(<DesktopDateRangePicker disablePast />);

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      expect(getPickerDay('8')).to.have.attribute('disabled');
      expect(getPickerDay('9')).to.have.attribute('disabled');
      expect(getPickerDay('10')).not.to.have.attribute('disabled');
      expect(getPickerDay('11')).not.to.have.attribute('disabled');
      expect(getPickerDay('12')).not.to.have.attribute('disabled');
    });

    it('should respect the disableFuture prop', async () => {
      const { user } = render(<DesktopDateRangePicker disableFuture />);

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      expect(getPickerDay('8')).not.to.have.attribute('disabled');
      expect(getPickerDay('9')).not.to.have.attribute('disabled');
      expect(getPickerDay('10')).not.to.have.attribute('disabled');
      expect(getPickerDay('11')).to.have.attribute('disabled');
      expect(getPickerDay('12')).to.have.attribute('disabled');
    });

    it('should respect the minDate prop', async () => {
      const { user } = render(<DesktopDateRangePicker minDate={adapterToUse.date('2018-01-15')} />);

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      expect(getPickerDay('13')).to.have.attribute('disabled');
      expect(getPickerDay('14')).to.have.attribute('disabled');
      expect(getPickerDay('15')).not.to.have.attribute('disabled');
      expect(getPickerDay('16')).not.to.have.attribute('disabled');
      expect(getPickerDay('17')).not.to.have.attribute('disabled');
    });

    it('should respect the maxDate prop', async () => {
      const { user } = render(<DesktopDateRangePicker maxDate={adapterToUse.date('2018-01-15')} />);

      await openPickerAsync(user, {
        type: 'date-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      expect(getPickerDay('13')).not.to.have.attribute('disabled');
      expect(getPickerDay('14')).not.to.have.attribute('disabled');
      expect(getPickerDay('15')).not.to.have.attribute('disabled');
      expect(getPickerDay('16')).to.have.attribute('disabled');
      expect(getPickerDay('17')).to.have.attribute('disabled');
    });
  });
});
