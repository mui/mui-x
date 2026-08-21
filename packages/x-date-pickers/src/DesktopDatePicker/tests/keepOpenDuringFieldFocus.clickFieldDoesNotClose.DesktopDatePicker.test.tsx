import * as React from 'react';
import { spy } from 'sinon';
import { screen, waitFor } from '@mui/internal-test-utils';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  adapterToUse,
  createPickerRenderer,
  getFieldSectionsContainer,
  openPicker,
} from 'test/utils/pickers';

describe('DesktopDatePicker keepOpenDuringFieldFocus - clicking field should not close', () => {
  const { render } = createPickerRenderer();

  it('keeps popper open when clicking back into the field while open', async () => {
    const { user } = render(<DesktopDatePicker keepOpenDuringFieldFocus />);

    await openPicker(user, { type: 'date' });

    // Click the textbox (field input)
    const textbox = getFieldSectionsContainer();
    await user.click(textbox);

    // Popper should still be open (role can be dialog or tooltip depending on variant settings)
    const popper = screen.queryByRole('dialog') ?? screen.queryByRole('tooltip');
    expect(popper).not.to.equal(null);
    expect(popper).toBeVisible();
  });

  it('does not reopen after selecting a date and restoring focus to the field', async () => {
    const onOpen = spy();
    const { user } = render(
      <React.Fragment>
        <button type="button">Before picker</button>
        <DesktopDatePicker
          defaultValue={adapterToUse.date('2018-01-01')}
          keepOpenDuringFieldFocus
          onOpen={onOpen}
        />
      </React.Fragment>,
    );

    const field = getFieldSectionsContainer();
    await user.click(field);
    expect(onOpen.callCount).to.equal(1);
    const monthSection = screen.getByRole('spinbutton', { name: 'Month' });

    await user.click(screen.getByRole('gridcell', { name: '2' }));

    await waitFor(() => {
      expect(monthSection).toHaveFocus();
      expect(onOpen.callCount).to.equal(1);
    });
    await waitFor(() => expect(screen.queryByRole('dialog')).to.equal(null));

    await user.click(screen.getByRole('button', { name: 'Before picker' }));
    await user.tab();

    expect(screen.getByRole('dialog')).toBeVisible();
  });
});
