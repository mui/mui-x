import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getFieldSectionsContainer,
} from 'test/utils/pickers';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

describe('<MobileDateRangePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describe('Field slot: SingleInputDateRangeField', () => {
    it('should render the input with a given `name` when `SingleInputDateRangeField` is used', () => {
      // Test with accessible DOM structure
      const { unmount } = render(
        <MobileDateRangePicker name="test" slots={{ field: SingleInputDateRangeField }} />,
      );
      expect(screen.getByRole<HTMLInputElement>('textbox', { hidden: true }).name).to.equal('test');

      unmount();

      // Test with non-accessible DOM structure
      render(
        <MobileDateRangePicker
          enableAccessibleFieldDOMStructure={false}
          name="test"
          slots={{ field: SingleInputDateRangeField }}
        />,
      );
      expect(screen.getByRole<HTMLInputElement>('textbox').name).to.equal('test');
    });
  });

  describe('picker state', () => {
    it('should open when focusing the start input', () => {
      const onOpen = spy();

      render(<MobileDateRangePicker onOpen={onOpen} />);

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should open when focusing the end input', () => {
      const onOpen = spy();

      render(<MobileDateRangePicker onOpen={onOpen} />);

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange with updated start date then call onChange with updated end date when opening from start input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the start date
      fireEvent.click(screen.getByRole('gridcell', { name: '3' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);

      // Change the end date
      fireEvent.click(screen.getByRole('gridcell', { name: '5' }));
      expect(onChange.callCount).to.equal(2);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));

      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onChange with updated end date when opening from end input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      fireEvent.click(screen.getByRole('gridcell', { name: '3' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting the end date if props.closeOnSelect = true', () => {
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });

      // Change the end date
      fireEvent.click(screen.getByRole('gridcell', { name: '3' }));

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange with the initial value when clicking "Cancel" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slotProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Change the start date (already tested)
      fireEvent.click(screen.getByRole('gridcell', { name: '3' }));

      // Cancel the modifications
      fireEvent.click(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(2); // Start date change + reset
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value and onAccept with the live value when clicking the "OK"', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Change the start date (already tested)
      fireEvent.click(screen.getByRole('gridcell', { name: '3' }));

      // Accept the modifications
      fireEvent.click(screen.getByText(/ok/i));
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<PickerValidDate> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          slotProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Clear the date
      fireEvent.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onChange.lastCall.args[0]).to.deep.equal([null, null]);
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0]).to.deep.equal([null, null]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onChange or onAccept when pressing "Clear" button with an already null value', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <MobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          slotProps={{ actionBar: { actions: ['clear'] } }}
          value={[null, null]}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Clear the date
      fireEvent.click(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should correctly set focused styles when input is focused', () => {
      render(<MobileDateRangePicker />);

      const startSectionsContainer = getFieldSectionsContainer();
      fireEvent.focus(startSectionsContainer);

      expect(screen.getByText('Start', { selector: 'label' })).to.have.class('Mui-focused');
    });
  });

  // TODO: Write test
  // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
  // })
});
