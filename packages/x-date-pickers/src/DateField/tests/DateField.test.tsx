import * as React from 'react';
import { spy } from 'sinon';
import InputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import { DateField } from '@mui/x-date-pickers/DateField';
import { screen } from '@mui/internal-test-utils';
import { buildFieldInteractions, createPickerRenderer } from 'test/utils/pickers';

describe('<DateField />', () => {
  const { render } = createPickerRenderer();
  const { renderWithProps } = buildFieldInteractions({ render, Component: DateField });

  describe('slotProps behavior', () => {
    it('should respect the `slotProps.textField.slotProps.input`', () => {
      render(
        <DateField slotProps={{ textField: { slotProps: { input: { name: 'test-field' } } } }} />,
      );

      expect(screen.getByRole('textbox', { hidden: true }))
        .attribute('name')
        .to.equal('test-field');
    });

    it('should respect the `slotProps.textField`', () => {
      render(<DateField slotProps={{ textField: { helperText: 'field-helper' } }} />);

      expect(screen.getByRole('group', { description: 'field-helper' })).not.to.equal(null);
    });

    it('should respect the `slotProps.textField.slotProps.htmlInput`', () => {
      render(
        <DateField
          slotProps={{
            textField: {
              slotProps: {
                htmlInput: { 'data-testid': 'test-html-input' } as any,
              },
            },
          }}
        />,
      );

      expect(screen.getByTestId('test-html-input')).not.to.equal(null);
    });

    it('should not call `slotProps.textField.onBlur` when the field gains focus', async () => {
      const onBlur = spy();
      const view = renderWithProps({ slotProps: { textField: { onBlur } } } as any);

      // Tab into the field: the PickersSectionList root (tabIndex=0) receives focus first,
      // then focus moves programmatically to section 0. That transient root blur must NOT
      // dispatch the user's onBlur callback.
      await view.user.tab();

      expect(onBlur.callCount).to.equal(0);
      view.unmount();
    });
  });

  describe('slotProps.inputAdornment behavior', () => {
    function CustomInputAdornment(props: InputAdornmentProps) {
      const { children, ...other } = props;
      return (
        <InputAdornment {...other}>
          <span>x</span>
          {children}
        </InputAdornment>
      );
    }

    it('should respect the `slots.inputAdornment`', () => {
      render(
        <DateField
          slots={{ inputAdornment: CustomInputAdornment }}
          slotProps={{ inputAdornment: { 'aria-label': 'test-adornment-icon', role: 'figure' } }}
        />,
      );

      expect(screen.getByRole('figure', { name: 'test-adornment-icon' })).to.have.text('x');
    });
  });
});
