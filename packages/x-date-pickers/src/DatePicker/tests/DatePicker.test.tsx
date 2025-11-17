import { vi } from 'vitest';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

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
      const handleSubmit = vi.fn();
      const { user } = render(<TestComponent onSubmit={handleSubmit} />);

      // focus the input
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(handleSubmit).toHaveBeenCalledTimes(1);
      const lastCall = handleSubmit.mock.calls[handleSubmit.mock.calls.length - 1];
      expect([...lastCall[0]][0]).to.deep.equal(['testDate', '04/17/2022']);
    });

    it('should not submit the form when "Enter" is pressed on the input with "defaultMuiPrevented" set to "true"', async () => {
      const handleSubmit = vi.fn();
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

      expect(handleSubmit).toHaveBeenCalledTimes(0);
    });
  });
});
