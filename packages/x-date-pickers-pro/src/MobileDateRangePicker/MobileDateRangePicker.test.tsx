import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import TextField from '@mui/material/TextField';
import { describeConformance, screen, userEvent } from '@mui/monorepo/test/utils';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import {
  wrapPickerMount,
  createPickerRenderer,
  withPickerControls,
  FakeTransitionComponent,
  adapterToUse,
  openPicker,
} from '../../../../test/utils/pickers-utils';

const WrappedMobileDateRangePicker = withPickerControls(MobileDateRangePicker)({
  DialogProps: { TransitionComponent: FakeTransitionComponent },
  renderInput: (startProps, endProps) => (
    <React.Fragment>
      <TextField {...startProps} />
      <TextField {...endProps} />
    </React.Fragment>
  ),
});

describe('<MobileDateRangePicker />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <MobileDateRangePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={[null, null]}
    />,
    () => ({
      classes: {},
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
    }),
  );

  describe('picker state', () => {
    it('should open when focusing the start input', () => {
      const onOpen = spy();

      render(<WrappedMobileDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should open when focusing the end input', () => {
      const onOpen = spy();

      render(<WrappedMobileDateRangePicker onOpen={onOpen} initialValue={[null, null]} />);

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onChange with updated start date then call onChange with updated end date when opening from start input', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedMobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the start date
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 5, 2018'));
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
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedMobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      // Open the picker
      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });

    it('should call onClose and onAccept when selecting the end date if props.closeOnSelect = true', () => {
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedMobileDateRangePicker
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          closeOnSelect
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'end' });

      // Change the end date
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange with the initial value when clicking "Cancel" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedMobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          componentsProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Change the start date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      // Cancel the modifications
      userEvent.mousePress(screen.getByText(/cancel/i));
      expect(onChange.callCount).to.equal(2); // Start date change + reset
      expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
      expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onAccept with the live value and onAccept with the live value when clicking the "OK"', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedMobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Change the start date (already tested)
      userEvent.mousePress(screen.getByLabelText('Jan 3, 2018'));

      // Accept the modifications
      userEvent.mousePress(screen.getByText(/ok/i));
      expect(onChange.callCount).to.equal(1); // Start date change
      expect(onAccept.callCount).to.equal(1);
      expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
      expect(onAccept.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();
      const initialValue = [
        adapterToUse.date(new Date(2018, 0, 1)),
        adapterToUse.date(new Date(2018, 0, 6)),
      ];

      render(
        <WrappedMobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
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
      const initialValue = [null, null];

      render(
        <WrappedMobileDateRangePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          initialValue={initialValue}
          componentsProps={{ actionBar: { actions: ['clear'] } }}
        />,
      );

      openPicker({ type: 'date-range', variant: 'mobile', initialFocus: 'start' });

      // Clear the date
      userEvent.mousePress(screen.getByText(/clear/i));
      expect(onChange.callCount).to.equal(0);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });

    // TODO: Write test
    // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
    // })
  });
});
