import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, act, within, waitFor, waitForElementToBeRemoved } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import {
  createPickerRenderer,
  adapterToUse,
  AdapterClassToUse,
  openPicker,
  getFieldSectionsContainer,
  getTextbox,
} from 'test/utils/pickers';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const getPickerDay = (name: string, picker = 'January 2018') =>
  within(screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name });

describe('<DesktopDateRangePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 10),
    clockOptions: { toFake: ['Date'] },
  });

  it('should scroll current month to the active selection when focusing appropriate field', async () => {
    render(
      <DesktopDateRangePicker
        enableAccessibleFieldDOMStructure
        reduceAnimations
        defaultValue={[adapterToUse.date('2019-05-19'), adapterToUse.date('2019-10-30')]}
      />,
    );

    await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByText('May 2019')).toBeVisible();

    await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
    expect(screen.getByText('October 2019')).toBeVisible();

    // scroll back
    await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByText('May 2019')).toBeVisible();
  });

  it(`should not crash when opening picker with invalid date value`, async () => {
    render(
      <DesktopDateRangePicker
        enableAccessibleFieldDOMStructure
        defaultValue={[new Date(NaN), adapterToUse.date('2019-01-31')]}
      />,
    );

    await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
    expect(screen.getByRole('tooltip')).toBeVisible();
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
            enableAccessibleFieldDOMStructure
            // We set the variant to standard to avoid having the label rendered in two places.
            slotProps={{
              textField: {
                variant: 'standard',
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>,
    );

    expect(screen.queryByText('Início')).not.to.equal(null);
    expect(screen.queryByText('Fim')).not.to.equal(null);
  });

  describe('Field slot: SingleInputDateRangeField', () => {
    it('should add focused class to the field when it is focused', async () => {
      // test v7 behavior
      const { unmount } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          slots={{ field: SingleInputDateRangeField }}
        />,
      );

      const sectionsContainer = getFieldSectionsContainer();
      await act(async () => sectionsContainer.focus());

      expect(sectionsContainer.parentElement).to.have.class('Mui-focused');

      unmount();

      // test v6 behavior
      render(<DesktopDateRangePicker slots={{ field: SingleInputDateRangeField }} />);

      const input = getTextbox();
      await act(async () => input.focus());

      expect(input.parentElement).to.have.class('Mui-focused');
    });

    it('should render the input with a given `name` when `SingleInputDateRangeField` is used', () => {
      // Test with v7 input
      const { unmount } = render(
        <DesktopDateRangePicker
          name="test"
          enableAccessibleFieldDOMStructure
          slots={{ field: SingleInputDateRangeField }}
        />,
      );
      expect(screen.getByRole<HTMLInputElement>('textbox', { hidden: true }).name).to.equal('test');

      unmount();

      // Test with v6 input
      render(<DesktopDateRangePicker name="test" slots={{ field: SingleInputDateRangeField }} />);
      expect(screen.getByRole<HTMLInputElement>('textbox').name).to.equal('test');
    });
  });

  describe('Component slot: Popper', () => {
    it('should forward onClick and onPointerDown', async () => {
      const handleClick = spy();
      const handlePointerDown = spy();
      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          open
          slotProps={{
            popper: {
              onClick: handleClick,
              onPointerDown: handlePointerDown,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
        />,
      );
      const popper = screen.getByTestId('popper');

      await user.click(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handlePointerDown.callCount).to.equal(1);
    });
  });

  describe('picker state', () => {
    it('should open when clicking the start input', async () => {
      const onOpen = spy();

      render(<DesktopDateRangePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />);

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    it('should open when clicking the end input', async () => {
      const onOpen = spy();

      render(<DesktopDateRangePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />);

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the start input`, async () => {
        const onOpen = spy();

        const { user } = render(
          <DesktopDateRangePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />,
        );

        const startInput = getFieldSectionsContainer();
        await act(() => startInput.focus());
        await user.keyboard(`{${key}}`);

        await waitFor(() => expect(screen.queryByRole('tooltip')).toBeVisible());
        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    ['Enter', ' '].forEach((key) =>
      it(`should open when pressing "${key}" in the end input`, async () => {
        const onOpen = spy();

        const { user } = render(
          <DesktopDateRangePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />,
        );

        const endInput = getFieldSectionsContainer(1);
        await act(() => endInput.focus());
        await user.keyboard(`{${key}}`);

        await waitFor(() => expect(screen.queryByRole('tooltip')).toBeVisible());

        expect(onOpen.callCount).to.equal(1);
        expect(screen.getByRole('tooltip')).toBeVisible();
      }),
    );

    it('should call onChange with updated start date then call onChange with updated end date, onClose and onAccept with update date range when opening from start input', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      // Open the picker
      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
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

    it('should call onChange with updated end date, onClose and onAccept with update date range when opening from end input', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      // Open the picker
      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      await user.click(getPickerDay('3'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose and onAccept when selecting the end date if props.closeOnSelect = false', async () => {
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect={false}
        />,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      // Change the end date
      await user.click(getPickerDay('3'));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept with the live value when pressing Escape', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Change the start date (already tested)
      await user.click(getPickerDay('3'));

      // Dismiss the picker
      await user.keyboard('{Escape}');
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose when clicking outside of the picker without prior change', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <div>
          <DesktopDateRangePicker
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
          />
          <input id="test-id" />
        </div>,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      const input = document.getElementById('test-id')!;

      // Dismiss the picker
      await user.pointer({ keys: '[MouseLeft>]', target: input });
      await act(async () => {
        input.focus();
      });
      await user.pointer({ keys: '[/MouseLeft]', target: input });

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value when clicking outside of the picker', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <div>
          <DesktopDateRangePicker
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={defaultValue}
          />
          <input id="test-id" />
        </div>,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Change the start date (already tested)
      await user.click(getPickerDay('3'));

      expect(onClose.callCount).to.equal(0);

      const input = document.getElementById('test-id')!;
      // Dismiss the picker
      await user.pointer({ keys: '[MouseLeft>]', target: input });
      await act(async () => {
        input.focus();
      });
      await user.pointer({ keys: '[/MouseLeft]', target: input });

      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when clicking outside of the picker if not opened', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
        />,
      );

      // Dismiss the picker
      await user.click(document.body);
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose when blur the current field without prior change', async function test() {
      // test:unit does not call `blur` when focusing another element.
      if (isJSDOM) {
        this.skip();
      }

      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <React.Fragment>
          <DesktopDateRangePicker
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
          />
          <button type="button" id="test">
            {' '}
            focus me
          </button>
        </React.Fragment>,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(screen.getByRole('tooltip')).toBeVisible();

      await act(() => {
        document.querySelector<HTMLButtonElement>('#test')!.focus();
      });

      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept when blur the current field', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <div>
          <DesktopDateRangePicker
            enableAccessibleFieldDOMStructure
            defaultValue={defaultValue}
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
          />
          <button id="test" />
        </div>,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(screen.getByRole('tooltip')).toBeVisible();

      // Change the start date (already tested)
      await user.click(getPickerDay('3'));

      await act(async () => {
        document.querySelector<HTMLButtonElement>('#test')!.focus();
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('tooltip'));
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      const { user } = render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slotProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

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
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          slotProps={{ actionBar: { actions: ['clear'] } }}
          value={[null, null]}
        />,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Clear the date
      await user.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
    it('should not close picker when switching focus from start to end input', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-06')]}
        />,
      );

      // Open the picker (already tested)
      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      // Switch to end date
      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should not close picker when switching focus from end to start input', async () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-06')]}
        />,
      );

      // Open the picker (already tested)
      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'end' });

      // Switch to start date
      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });

  describe('disabled dates', () => {
    it('should respect the disablePast prop', async () => {
      render(<DesktopDateRangePicker enableAccessibleFieldDOMStructure disablePast />);

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('8')).to.have.attribute('disabled');
      expect(getPickerDay('9')).to.have.attribute('disabled');
      expect(getPickerDay('10')).not.to.have.attribute('disabled');
      expect(getPickerDay('11')).not.to.have.attribute('disabled');
      expect(getPickerDay('12')).not.to.have.attribute('disabled');
    });

    it('should respect the disableFuture prop', async () => {
      render(<DesktopDateRangePicker enableAccessibleFieldDOMStructure disableFuture />);

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('8')).not.to.have.attribute('disabled');
      expect(getPickerDay('9')).not.to.have.attribute('disabled');
      expect(getPickerDay('10')).not.to.have.attribute('disabled');
      expect(getPickerDay('11')).to.have.attribute('disabled');
      expect(getPickerDay('12')).to.have.attribute('disabled');
    });

    it('should respect the minDate prop', async () => {
      render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          minDate={adapterToUse.date('2018-01-15')}
        />,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('13')).to.have.attribute('disabled');
      expect(getPickerDay('14')).to.have.attribute('disabled');
      expect(getPickerDay('15')).not.to.have.attribute('disabled');
      expect(getPickerDay('16')).not.to.have.attribute('disabled');
      expect(getPickerDay('17')).not.to.have.attribute('disabled');
    });

    it('should respect the maxDate prop', async () => {
      render(
        <DesktopDateRangePicker
          enableAccessibleFieldDOMStructure
          maxDate={adapterToUse.date('2018-01-15')}
        />,
      );

      await openPicker({ type: 'date-range', variant: 'desktop', initialFocus: 'start' });

      expect(getPickerDay('13')).not.to.have.attribute('disabled');
      expect(getPickerDay('14')).not.to.have.attribute('disabled');
      expect(getPickerDay('15')).not.to.have.attribute('disabled');
      expect(getPickerDay('16')).to.have.attribute('disabled');
      expect(getPickerDay('17')).to.have.attribute('disabled');
    });
  });
});
