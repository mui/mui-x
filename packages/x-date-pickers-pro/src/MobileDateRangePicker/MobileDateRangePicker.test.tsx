import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { describeConformance, screen, userEvent, fireEvent } from '@mui/monorepo/test/utils';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  openPicker,
} from 'test/utils/pickers-utils';
import { DateRange } from '@mui/x-date-pickers-pro';

describe('<MobileDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeConformance(<MobileDateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDateRangePicker',
    wrapMount: wrapPickerMount,
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'reactTestRenderer',
    ],
  }));

  describeRangeValidation(MobileDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    views: ['day'],
    variant: 'mobile',
  }));

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
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
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
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
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
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting the end date if props.closeOnSelect = true', () => {
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
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
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange with the initial value when clicking "Cancel" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
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
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
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
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
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
      userEvent.mousePress(screen.getByRole('gridcell', { name: '3' }));

      // Accept the modifications
      userEvent.mousePress(screen.getByText(/ok/i));
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
      const defaultValue: DateRange<any> = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
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
      userEvent.mousePress(screen.getByText(/clear/i));
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
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should correctly set focused styles when input is focused', () => {
      render(<MobileDateRangePicker />);

      const firstInput = screen.getAllByRole('textbox')[0];
      fireEvent.focus(firstInput);

      expect(screen.getByText('Start', { selector: 'label' })).to.have.class('Mui-focused');
    });

    it('should render "readonly" input elements', () => {
      render(<MobileDateRangePicker />);

      screen.getAllByRole('textbox').forEach((input) => {
        expect(input).to.have.attribute('readonly');
      });
    });
  });

  // TODO: Write test
  // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
  // })

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<MobileDateRangePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);
      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
