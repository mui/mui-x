import * as React from 'react';
import { expectPickerChangeHandlerValue } from 'test/utils/pickers';
import { screen } from '@mui/internal-test-utils';
import { vi, describe, it, expect } from 'vitest';
import { DescribeValueTestSuite } from './describeValue.types';

export const testShortcuts: DescribeValueTestSuite<any, 'picker'> = (ElementToTest, options) => {
  const {
    componentFamily,
    render,
    renderWithProps,
    values,
    emptyValue,
    setNewValue,
    ...pickerParams
  } = options;

  describe.skipIf(componentFamily !== 'picker')('Picker shortcuts', () => {
    it('should call onClose, onChange and onAccept when picking a shortcut without explicit changeImportance', async () => {
      const onChange = vi.fn();
      const onAccept = vi.fn();
      const onClose = vi.fn();

      const { user } = render(
        <ElementToTest
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

      const shortcut = await screen.findByRole('button', { name: 'Test shortcut' });

      await user.click(shortcut);

      expect(onChange.mock.calls.length).to.equal(1);
      expectPickerChangeHandlerValue(pickerParams.type, onChange.mock.lastCall?.[0], values[1]);
      expect(onAccept.mock.calls.length).to.equal(1);
      expectPickerChangeHandlerValue(pickerParams.type, onAccept.mock.lastCall?.[0], values[1]);
      expect(onClose.mock.calls.length).to.equal(1);
    });

    it('should call onClose and onChange when picking a shortcut with changeImportance="accept"', async () => {
      const onChange = vi.fn();
      const onAccept = vi.fn();
      const onClose = vi.fn();

      const { user } = render(
        <ElementToTest
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

      expect(onChange.mock.calls.length).to.equal(1);
      expectPickerChangeHandlerValue(pickerParams.type, onChange.mock.lastCall?.[0], values[1]);
      expect(onAccept.mock.calls.length).to.equal(1);
      expectPickerChangeHandlerValue(pickerParams.type, onAccept.mock.lastCall?.[0], values[1]);
      expect(onClose.mock.calls.length).to.equal(1);
    });

    it('should call onClose and onChange when picking a shortcut with changeImportance="set"', async () => {
      const onChange = vi.fn();
      const onAccept = vi.fn();
      const onClose = vi.fn();

      const { user } = render(
        <ElementToTest
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

      expect(onChange.mock.calls.length).to.equal(1);
      expectPickerChangeHandlerValue(pickerParams.type, onChange.mock.lastCall?.[0], values[1]);
      expect(onAccept.mock.calls.length).to.equal(0);
      expect(onClose.mock.calls.length).to.equal(0);
    });
  });
};
