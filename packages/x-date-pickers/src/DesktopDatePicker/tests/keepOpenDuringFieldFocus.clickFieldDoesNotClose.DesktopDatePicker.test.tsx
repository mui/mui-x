import { screen } from '@mui/internal-test-utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  getFieldSectionsContainer,
  openPickerAsync,
} from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';

describe('DesktopDatePicker keepOpenDuringFieldFocus - clicking field should not close', () => {
  const { render } = createPickerRenderer();

  it.skipIf(isJSDOM)('keeps popper open when clicking back into the field while open', async () => {
    const { user } = render(<DesktopDatePicker keepOpenDuringFieldFocus />);

    await openPickerAsync(user, { type: 'date' });

    // Click the textbox (field input)
    const textbox = getFieldSectionsContainer();
    await user.click(textbox);

    // Popper should still be open (role can be dialog or tooltip depending on variant settings)
    const popper = screen.queryByRole('dialog') ?? screen.queryByRole('tooltip');
    expect(popper).not.to.equal(null);
    expect(popper).toBeVisible();
  });
});
