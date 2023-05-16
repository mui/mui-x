import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen, userEvent } from '@mui/monorepo/test/utils';
import { adapterToUse, getExpectedOnChangeCount } from 'test/utils/pickers-utils';
import { DescribeValueTestSuite } from './describeValue.types';

export const testPickerActionBar: DescribeValueTestSuite<any, 'picker'> = (
  ElementToTest,
  getOptions,
) => {
  const { componentFamily, render, values, emptyValue, setNewValue, ...pickerParams } =
    getOptions();

  if (componentFamily !== 'picker') {
    return;
  }

  describe('Picker action bar', () => {
    describe('clear action', () => {
      it('should call onClose, onChange with empty value and onAccept with empty value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            slotProps={{ actionBar: { actions: ['clear'] } }}
          />,
        );

        // Clear the date
        userEvent.mousePress(screen.getByText(/clear/i));
        expect(onChange.callCount).to.equal(1);
        if (pickerParams.type === 'date-range') {
          onChange.lastCall.args[0].forEach((value, index) => {
            expect(value).to.deep.equal(emptyValue[index]);
          });
        } else {
          expect(onChange.lastCall.args[0]).to.deep.equal(emptyValue);
        }
        expect(onAccept.callCount).to.equal(1);
        if (pickerParams.type === 'date-range') {
          onAccept.lastCall.args[0].forEach((value, index) => {
            expect(value).to.deep.equal(emptyValue[index]);
          });
        } else {
          expect(onAccept.lastCall.args[0]).to.deep.equal(emptyValue);
        }
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange or onAccept if the value is already empty value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            slotProps={{ actionBar: { actions: ['clear'] } }}
            value={emptyValue}
          />,
        );

        // Clear the date
        userEvent.mousePress(screen.getByText(/clear/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });
    });

    describe('cancel action', () => {
      it('should call onClose and onChange with the initial value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            value={values[0]}
            slotProps={{ actionBar: { actions: ['cancel'] } }}
            closeOnSelect={false}
          />,
        );

        // Change the value (already tested)
        setNewValue(values[0], { isOpened: true });

        // Cancel the modifications
        userEvent.mousePress(screen.getByText(/cancel/i));
        expect(onChange.callCount).to.equal(
          getExpectedOnChangeCount(componentFamily, pickerParams) + 1,
        );
        if (pickerParams.type === 'date-range') {
          values[0].forEach((value, index) => {
            expect(onChange.lastCall.args[0][index]).toEqualDateTime(value);
          });
        } else {
          expect(onChange.lastCall.args[0]).toEqualDateTime(values[0] as any);
        }
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });

      it('should not call onChange if no prior value modification', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
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
        userEvent.mousePress(screen.getByText(/cancel/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });
    });

    describe('confirm action', () => {
      it('should call onClose and onAccept with the live value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            open
            defaultValue={values[0]}
            slotProps={{ actionBar: { actions: ['accept'] } }}
            closeOnSelect={false}
          />,
        );

        // Change the value (already tested)
        setNewValue(values[0], { isOpened: true });

        // Accept the modifications
        userEvent.mousePress(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(
          getExpectedOnChangeCount(componentFamily, pickerParams),
        ); // The accepted value as already been committed, don't call onChange again
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onChange, onClose and onAccept when validating the default value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
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
        userEvent.mousePress(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(1);
        expect(onAccept.callCount).to.equal(1);
        expect(onClose.callCount).to.equal(1);
      });

      it('should call onClose but not onAccept when validating an already validated value', () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
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
        userEvent.mousePress(screen.getByText(/ok/i));
        expect(onChange.callCount).to.equal(0);
        expect(onAccept.callCount).to.equal(0);
        expect(onClose.callCount).to.equal(1);
      });
    });

    describe('today action', () => {
      it("should call onClose, onChange with today's value and onAccept with today's value", () => {
        const onChange = spy();
        const onAccept = spy();
        const onClose = spy();

        render(
          <ElementToTest
            onChange={onChange}
            onAccept={onAccept}
            onClose={onClose}
            defaultValue={values[0]}
            open
            slotProps={{ actionBar: { actions: ['today'] } }}
          />,
        );

        userEvent.mousePress(screen.getByText(/today/i));

        const startOfToday =
          pickerParams.type === 'date'
            ? adapterToUse.startOfDay(adapterToUse.date())
            : adapterToUse.date();

        expect(onChange.callCount).to.equal(1);
        if (pickerParams.type === 'date-range') {
          onChange.lastCall.args[0].forEach((value) => {
            expect(value).toEqualDateTime(startOfToday);
          });
        } else {
          expect(onChange.lastCall.args[0]).toEqualDateTime(startOfToday);
        }
        expect(onAccept.callCount).to.equal(1);
        if (pickerParams.type === 'date-range') {
          onAccept.lastCall.args[0].forEach((value) => {
            expect(value).toEqualDateTime(startOfToday);
          });
        } else {
          expect(onAccept.lastCall.args[0]).toEqualDateTime(startOfToday);
        }
        expect(onClose.callCount).to.equal(1);
      });
    });
  });
};
