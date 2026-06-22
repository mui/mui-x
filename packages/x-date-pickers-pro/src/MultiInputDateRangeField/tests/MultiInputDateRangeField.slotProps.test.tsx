import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { createPickerRenderer } from 'test/utils/pickers';

describe('<MultiInputDateRangeField /> - slotProps', () => {
  const { render } = createPickerRenderer();

  it('should set the `data-multi-input` attribute on each input via slotProps.input', () => {
    render(<MultiInputDateRangeField />);

    const groups = screen.getAllByRole('group', { hidden: true });
    const startGroup = groups.find((el) => el.getAttribute('data-multi-input') === 'start');
    const endGroup = groups.find((el) => el.getAttribute('data-multi-input') === 'end');

    expect(startGroup).not.to.equal(undefined);
    expect(endGroup).not.to.equal(undefined);
  });

  it('should forward `slotProps.textField.slotProps.input` to the underlying input wrapper', () => {
    render(
      <MultiInputDateRangeField
        slotProps={{
          textField: {
            slotProps: {
              input: { 'data-custom': 'forwarded' } as any,
            },
          },
        }}
      />,
    );

    const groups = screen.getAllByRole('group', { hidden: true });
    const forwarded = groups.filter((el) => el.getAttribute('data-custom') === 'forwarded');
    // Both start and end inputs should receive the forwarded prop without the merge
    // stripping the internal `data-multi-input` marker added by `useTextFieldProps`.
    expect(forwarded.length).to.equal(2);
    expect(forwarded.every((el) => el.getAttribute('data-multi-input') !== null)).to.equal(true);
  });
});
