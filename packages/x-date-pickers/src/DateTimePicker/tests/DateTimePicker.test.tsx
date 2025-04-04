import * as React from 'react';
import { expect } from 'chai';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { createPickerRenderer, stubMatchMedia } from 'test/utils/pickers';

describe('<DateTimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should render in mobile mode when `useMediaQuery` returns `false`', async () => {
    stubMatchMedia(false);

    const { user } = render(<DateTimePicker />);

    await user.click(screen.getByLabelText(/Choose date/));
    expect(screen.queryByRole('dialog')).to.not.equal(null);
  });
});
