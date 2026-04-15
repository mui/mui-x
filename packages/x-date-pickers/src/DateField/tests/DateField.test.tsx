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
  });

  describe('slotProps.textField focus/blur behavior', () => {
    it('should not call `slotProps.textField.onBlur` when focus enters the field via tab', async () => {
      const onBlur = spy();
      const view = renderWithProps({ slotProps: { textField: { onBlur } } } as any);

      // Tabbing into the field moves focus to the PickersSectionList root (tabIndex=0)
      // first, then programmatically to section 0. The transient root blur must not
      // dispatch the user's onBlur callback.
      await view.user.tab();

      expect(onBlur.callCount).to.equal(0);
      view.unmount();
    });

    it('should call `slotProps.textField.onFocus` only once when focus enters the field via tab', async () => {
      const onFocus = spy();
      const view = renderWithProps({ slotProps: { textField: { onFocus } } } as any);

      // Tabbing into the field fires a focus on the root and then on section 0.
      // Only the first focus (from outside the field) should reach the user.
      await view.user.tab();

      expect(onFocus.callCount).to.equal(1);
      view.unmount();
    });

    it('should call `slotProps.textField.onBlur` when focus leaves the field via tab', async () => {
      const onBlur = spy();
      const view = renderWithProps({ slotProps: { textField: { onBlur } } } as any);

      await view.user.tab();
      expect(onBlur.callCount).to.equal(0);

      // Tab out of the field (to the document body or next focusable).
      await view.user.tab();
      expect(onBlur.callCount).to.equal(1);

      view.unmount();
    });

    it('should not fire `slotProps.textField.onBlur` or `onFocus` when focus moves between sections', async () => {
      const onBlur = spy();
      const onFocus = spy();
      const view = renderWithProps({
        slotProps: { textField: { onBlur, onFocus } },
      } as any);

      await view.user.tab();
      const blurCallCountAfterTabIn = onBlur.callCount;
      const focusCallCountAfterTabIn = onFocus.callCount;

      // Navigate across sections inside the field.
      await view.user.keyboard('[ArrowRight][ArrowRight][ArrowLeft]');

      expect(onBlur.callCount).to.equal(blurCallCountAfterTabIn);
      expect(onFocus.callCount).to.equal(focusCallCountAfterTabIn);

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
