import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { screen, userEvent, fireEvent } from '@mui-internal/test-utils';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import {
  createPickerRenderer,
  adapterToUse,
  openPicker,
  getFieldSectionsContainer,
} from 'test/utils/pickers';
import { DateRange } from '@mui/x-date-pickers-pro/models';

describe('<MobileDateRangePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describe('picker state', () => {
    it('should open when focusing the start input', () => {
      const onOpen = spy();

      render(<MobileDateRangePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />);

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should open when focusing the end input', () => {
      const onOpen = spy();

      render(<MobileDateRangePicker enableAccessibleFieldDOMStructure onOpen={onOpen} />);

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange with updated start date then call onChange with updated end date when opening from start input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          enableAccessibleFieldDOMStructure
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
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);

      // Change the end date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '5' }));
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
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          enableAccessibleFieldDOMStructure
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
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting the start date then the end date if props.closeOnSelect = true', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          enableAccessibleFieldDOMStructure
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the start date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '2' }));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime('2018-01-02');
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime('2018-01-03');
      expect(onClose.callCount).to.equal(1);
    });

    it('should not call onClose or onAccept when selecting the end date without selecting the start date before and props.closeOnSelect = true', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date('2018-01-01'),
        adapterToUse.date('2018-01-06'),
      ];

      render(
        <MobileDateRangePicker
          enableAccessibleFieldDOMStructure
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={defaultValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should correctly set focused styles when input is focused', () => {
      render(<MobileDateRangePicker enableAccessibleFieldDOMStructure />);

      const startSectionsContainer = getFieldSectionsContainer();
      fireEvent.focus(startSectionsContainer);

      expect(screen.getByText('Start', { selector: 'label' })).to.have.class('Mui-focused');
    });
  });

  // TODO: Write test
  // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
  // })
});
