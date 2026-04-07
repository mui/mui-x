import InputAdornment, { InputAdornmentProps } from '@mui/material/InputAdornment';
import { DateField } from '@mui/x-date-pickers/DateField';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer } from 'test/utils/pickers';

describe('<DateField />', () => {
  const { render } = createPickerRenderer();

  describe('InputProps and slotProps behavior', () => {
    it('should respect the `InputProps`', () => {
      render(<DateField InputProps={{ name: 'test-field' }} />);

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
            textField: { slotProps: { htmlInput: { 'data-testid': 'test-html-input' } } },
          }}
        />,
      );

      expect(screen.getByTestId('test-html-input')).not.to.equal(null);
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
