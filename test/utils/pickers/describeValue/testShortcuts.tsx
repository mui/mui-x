import * as React from 'react';
import { vi } from 'vitest';
import { expectPickerChangeHandlerValue } from 'test/utils/pickers';
import { fireEvent, screen } from '@mui/internal-test-utils';
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

      render(
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

      fireEvent.click(shortcut);

      expect(onChange).toHaveBeenCalledTimes(1);
      expectPickerChangeHandlerValue(pickerParams.type, onChange, values[1]);
      expect(onAccept).toHaveBeenCalledTimes(1);
      expectPickerChangeHandlerValue(pickerParams.type, onAccept, values[1]);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose and onChange when picking a shortcut with changeImportance="accept"', () => {
      const onChange = vi.fn();
      const onAccept = vi.fn();
      const onClose = vi.fn();

      render(
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
      fireEvent.click(shortcut);

      expect(onChange).toHaveBeenCalledTimes(1);
      expectPickerChangeHandlerValue(pickerParams.type, onChange, values[1]);
      expect(onAccept).toHaveBeenCalledTimes(1);
      expectPickerChangeHandlerValue(pickerParams.type, onAccept, values[1]);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose and onChange when picking a shortcut with changeImportance="set"', () => {
      const onChange = vi.fn();
      const onAccept = vi.fn();
      const onClose = vi.fn();

      render(
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
      fireEvent.click(shortcut);

      expect(onChange).toHaveBeenCalledTimes(1);
      expectPickerChangeHandlerValue(pickerParams.type, onChange, values[1]);
      expect(onAccept).toHaveBeenCalledTimes(0);
      expect(onClose).toHaveBeenCalledTimes(0);
    });
  });
};
