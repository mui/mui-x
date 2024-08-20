import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { act, screen } from '@mui/internal-test-utils';
import {
  adapterToUse,
  getExpectedOnChangeCount,
  expectPickerChangeHandlerValue,
} from 'test/utils/pickers';
import { DescribeValueTestSuite } from './describeValue.types';
import { fireUserEvent } from '../../fireUserEvent';

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

        render(
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

        await act(async () => {
          // Clear the date
          fireUserEvent.mousePress(screen.getByText(/clear/i));
        });
        expect(onChange.callCount).to.equal(1);
        expectPickerChangeHandlerValue(pickerParams.type, onChange, emptyValue);
        expect(onAccept.callCount).to.equal(1);
        expectPickerChangeHandlerValue(pickerParams.type, onAccept, emptyValue);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange or onAccept if the value is already empty value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
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

        await act(async () => {
          // Clear the date
          fireUserEvent.mousePress(screen.getByText(/clear/i));
        });
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

        const { selectSection, pressKey } = renderWithProps({
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

        await act(async () => {
          // Cancel the modifications
          fireUserEvent.mousePress(screen.getByText(/cancel/i));
        });
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

        render(
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

        await act(async () => {
          // Cancel the modifications
          fireUserEvent.mousePress(screen.getByText(/cancel/i));
        });
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

        const { selectSection, pressKey } = renderWithProps({
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

        await act(async () => {
          // Accept the modifications
          fireUserEvent.mousePress(screen.getByText(/ok/i));
        });
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

        render(
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

        await act(async () => {
          // Accept the modifications
          fireUserEvent.mousePress(screen.getByText(/ok/i));
        });
        expect(onChange.callCount).to.equal(1);
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose but not onAccept when validating an already validated value', async () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
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

        await act(async () => {
          // Accept the modifications
          fireUserEvent.mousePress(screen.getByText(/ok/i));
        });
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

        render(
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

        await act(async () => {
          fireUserEvent.mousePress(screen.getByText(/today/i));
        });

        let startOfToday: any;
        if (pickerParams.type === 'date') {
          startOfToday = adapterToUse.startOfDay(adapterToUse.date());
        } else if (isRangeType) {
          startOfToday = [adapterToUse.date(), adapterToUse.date()];
        } else {
          startOfToday = adapterToUse.date();
        }

        expect(onChange.callCount).to.equal(1);
        expectPickerChangeHandlerValue(pickerParams.type, onChange, startOfToday);
        expect(onAccept.callCount).to.equal(1);
        expectPickerChangeHandlerValue(pickerParams.type, onAccept, startOfToday);
        expect(onClose.callCount).to.equal(1);
      });
    });
  });
};
