import * as React from 'react';
import { spy } from 'sinon';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';
import { usePickerActionsContext } from '@mui/x-date-pickers/hooks';

describe('<DatePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', async () => {
    stubMatchMedia(false);

    const { user } = render(<DatePicker />);

    await user.click(screen.getByLabelText(/Choose date/));
    expect(screen.queryByRole('dialog')).not.to.equal(null);
  });

  describe('form behavior', () => {
    function TestComponent({
      onSubmit,
      ...other
    }: DatePickerProps & { onSubmit: (data: FormData) => void }) {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(new window.FormData(event.target as any));
          }}
        >
          <DatePicker name="testDate" defaultValue={new Date('2022-04-17')} {...other} />
          <button type="submit">Submit</button>
        </form>
      );
    }

    it('should submit the form when "Enter" is pressed on the input', async () => {
      const handleSubmit = spy();
      const { user } = render(<TestComponent onSubmit={handleSubmit} />);

      // focus the input
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(handleSubmit.callCount).to.equal(1);
      expect([...handleSubmit.lastCall.args[0]][0]).to.deep.equal(['testDate', '04/17/2022']);
    });

    it('should not submit the form when "Enter" is pressed on the input with "defaultMuiPrevented" set to "true"', async () => {
      const handleSubmit = spy();
      const { user } = render(
        <TestComponent
          onSubmit={handleSubmit}
          slotProps={{
            textField: {
              onKeyDown: (event) => {
                if (event.key === 'Enter') {
                  event.defaultMuiPrevented = true;
                }
              },
            },
          }}
        />,
      );

      // focus the input
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(handleSubmit.callCount).to.equal(0);
    });
  });

  it('should clear the field when calling clearValue from context even if the value is already null', async () => {
    function CustomActionBar() {
      const { clearValue } = usePickerActionsContext();
      return <button onClick={clearValue}>Custom Clear</button>;
    }

    const { user } = render(
      <DatePicker
        enableAccessibleFieldDOMStructure={false}
        slots={{
          actionBar: CustomActionBar,
        }}
        open
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, '12'); // Only partial date (month)
    expect(input.value).to.contain('12');

    const clearButton = screen.getByText('Custom Clear');
    await user.click(clearButton);

    expect(input.value).not.to.contain('12');
  });

  it('should clear the field when calling clearValue from fieldRef', async () => {
    const fieldRef = React.createRef<any>();
    const { user } = render(
      <DatePicker enableAccessibleFieldDOMStructure={false} slotProps={{ field: { fieldRef } }} />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, '12'); // Only partial date (month)
    expect(input.value).to.contain('12');

    React.act(() => {
      fieldRef.current.clearValue();
    });

    expect(input.value).not.to.contain('12');
  });
});
