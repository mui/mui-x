import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { expectPickerChangeHandlerValue } from 'test/utils/pickers';
import { screen } from '@mui/internal-test-utils';
import { DescribeValueTestSuite } from './describeValue.types';

export const testShortcuts: DescribeValueTestSuite<any, 'picker'> = (ElementToTest, options) => {
  const { componentFamily, render, values } = options;

  if (componentFamily !== 'picker') {
    return;
  }

  describe('Picker shortcuts', () => {
    it('should call onClose, onChange and onAccept when picking a shortcut without explicit changeImportance', async () => {
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
          closeOnSelect
          slotProps={{
            shortcuts: {
              items: [
                {
                  label: 'Test shortcut',
                  getValue: () => values[1],
                },
              ],
            },
          }}
        />,
      );

      const shortcut = screen.getByRole('button', { name: 'Test shortcut' });
      await user.click(shortcut);

      expect(onChange.callCount).to.equal(1);
      expectPickerChangeHandlerValue(onChange.lastCall.firstArg, values[1]);
      expect(onAccept.callCount).to.equal(1);
      expectPickerChangeHandlerValue(onAccept.lastCall.firstArg, values[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange when picking a shortcut with changeImportance="accept"', async () => {
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
          closeOnSelect
          slotProps={{
            shortcuts: {
              items: [
                {
                  label: 'Test shortcut',
                  getValue: () => values[1],
                },
              ],
              changeImportance: 'accept',
            },
          }}
        />,
      );

      const shortcut = screen.getByRole('button', { name: 'Test shortcut' });
      await user.click(shortcut);

      expect(onChange.callCount).to.equal(1);
      expectPickerChangeHandlerValue(onChange.lastCall.firstArg, values[1]);
      expect(onAccept.callCount).to.equal(1);
      expectPickerChangeHandlerValue(onAccept.lastCall.firstArg, values[1]);
      expect(onClose.callCount).to.equal(1);
    });

    it('should call onClose and onChange when picking a shortcut with changeImportance="set"', async () => {
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
          closeOnSelect
          slotProps={{
            shortcuts: {
              items: [
                {
                  label: 'Test shortcut',
                  getValue: () => values[1],
                },
              ],
              changeImportance: 'set',
            },
          }}
        />,
      );

      const shortcut = screen.getByRole('button', { name: 'Test shortcut' });
      await user.click(shortcut);

      expect(onChange.callCount).to.equal(1);
      expectPickerChangeHandlerValue(onChange.lastCall.firstArg, values[1]);
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);
    });
  });
};
