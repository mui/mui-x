import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<DatePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    const { user } = render(<DatePicker />);

    await user.click(screen.getByLabelText(/Choose date/));
    expect(screen.queryByRole('dialog')).to.not.equal(null);

    window.matchMedia = originalMatchMedia;
  });

  it('should submit the form when "Enter" is pressed on the input', async () => {
    function TestComponent({ onSubmit }) {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(new window.FormData(event.target as any));
          }}
        >
          <DatePicker name="testDate" defaultValue={new Date('2022-04-17')} />
          <button type="submit">Submit</button>
        </form>
      );
    }

    const handleSubmit = spy();
    const { user } = render(<TestComponent onSubmit={handleSubmit} />);

    // focus the input
    await user.keyboard('{Tab}');
    await user.keyboard('{Enter}');

    expect(handleSubmit.callCount).to.equal(1);
    expect([...handleSubmit.lastCall.args[0]][0]).to.deep.equal(['testDate', '04/17/2022']);
  });
});
