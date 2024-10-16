import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import {
  adapterToUse,
  getExpectedOnChangeCount,
  expectPickerChangeHandlerValue,
} from 'test/utils/pickers';
import { DescribeValueTestSuite } from './describeValue.types';

export const testPickerActionBar: DescribeValueTestSuite<any, 'picker'> = (
  ElementToTest,
  options,
) => {
  const {
    componentFamily,
    render,
    renderWithProps,
    values,
    emptyValue,
    setNewValue,
    ...pickerParams
  } = options;

  if (componentFamily !== 'picker') {
    return;
  }

  const isRangeType = pickerParams.type === 'date-range' || pickerParams.type === 'date-time-range';

  describe('Picker action bar', () => {
    describe('clear action', () => {
      it('should call onClose, onChange with empty value and onAccept with empty value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <ElementToTest
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            slotProps={{ actionBar: { actions: ['clear'] } }}
          />,
        );

        // Clear the date
        await user.click(screen.getByText(/clear/i));
        expect(onChange.callCount).to.equal(1);
        expectPickerChangeHandlerValue(onChange.lastCall.firstArg, emptyValue);
        expect(onAccept.callCount).to.equal(1);
        expectPickerChangeHandlerValue(onAccept.lastCall.firstArg, emptyValue);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange or onAccept if the value is already empty value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <ElementToTest
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            slotProps={{ actionBar: { actions: ['clear'] } }}
            value={emptyValue}
          />,
        );

        // Clear the date
        await user.click(screen.getByText(/clear/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });
    });

    describe('cancel action', () => {
      it('should call onClose and onChange with the initial value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { selectSection, pressKey, user } = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          open: true,
          value: values[0],
          slotProps: { actionBar: { actions: ['cancel'] } },
          closeOnSelect: false,
        });

        // Change the value (already tested)
        await setNewValue(values[0], { isOpened: true, selectSection, pressKey });

        // Cancel the modifications
        await user.click(screen.getByText(/cancel/i));
        expect(onChange.callCount).to.equal(
          getExpectedOnChangeCount(componentFamily, pickerParams) + 1,
        );
        if (isRangeType) {
          values[0].forEach((value, index) => {
            expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
          });
        } else {
          expect(onChange.lastCall.args[0]).toEqualDateTime(values[0] as any);
        }
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange if no prior value modification', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <ElementToTest
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            value={values[0]}
            slotProps={{ actionBar: { actions: ['cancel'] } }}
            closeOnSelect={false}
          />,
        );

        // Cancel the modifications
        await user.click(screen.getByText(/cancel/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });
    });

    describe('confirm action', () => {
      it('should call onClose and onAccept with the live value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { selectSection, pressKey, user } = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          onChange,
          onAccept,
          onClose,
          open: true,
          defaultValue: values[0],
          slotProps: { actionBar: { actions: ['accept'] } },
          closeOnSelect: false,
        });

        // Change the value (already tested)
        await setNewValue(values[0], { isOpened: true, selectSection, pressKey });

        // Accept the modifications
        await user.click(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(
          getExpectedOnChangeCount(componentFamily, pickerParams),
        ); // The accepted value as already been committed, don't call onChange again
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onChange, onClose and onAccept when validating the default value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <ElementToTest
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            defaultValue={values[0]}
            slotProps={{ actionBar: { actions: ['accept'] } }}
            closeOnSelect={false}
          />,
        );

        // Accept the modifications
        await user.click(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(1);
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose but not onAccept when validating an already validated value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <ElementToTest
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            value={values[0]}
            slotProps={{ actionBar: { actions: ['accept'] } }}
            closeOnSelect={false}
          />,
        );

        // Accept the modifications
        await user.click(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });
    });

    describe('today action', () => {
      it("should call onClose, onChange with today's value and onAccept with today's value", async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        const { user } = render(
          <ElementToTest
            enableAccessibleFieldDOMStructure
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            slotProps={{ actionBar: { actions: ['today'] } }}
          />,
        );

        await user.click(screen.getByText(/today/i));

        let startOfToday = adapterToUse.startOfDay(adapterToUse.date());
        if (isRangeType) {
          if (pickerParams.type === 'date-time-range') {
            startOfToday = [
              adapterToUse.setMilliseconds(adapterToUse.date(), 0),
              adapterToUse.setMilliseconds(adapterToUse.date(), 0),
            ];
          } else {
            startOfToday = [startOfToday, startOfToday];
          }
        } else if (pickerParams.type !== 'date') {
          startOfToday = adapterToUse.setMilliseconds(adapterToUse.date(), 0);
        }

        expect(onChange.callCount).to.equal(1);
        expectPickerChangeHandlerValue(
          onChange.lastCall.firstArg,
          startOfToday,
          true,
          adapterToUse,
        );
        expect(onAccept.callCount).to.equal(1);
        expectPickerChangeHandlerValue(
          onAccept.lastCall.firstArg,
          startOfToday,
          true,
          adapterToUse,
        );
        expect(onClose.callCount).to.equal(1);
      });
    });
  });
};
