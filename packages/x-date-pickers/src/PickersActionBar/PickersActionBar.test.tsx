import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import { createPickerRenderer } from 'test/utils/pickers';
import { vi, describe, it, expect } from 'vitest';
import { PickerContext } from '../hooks/usePickerContext';

describe('<PickersActionBar />', () => {
  const { render } = createPickerRenderer();

  const renderWithContext = (element: React.ReactElement, disabled = false, readOnly = false) => {
    const spys = {
      setValue: vi.fn(),
      setView: vi.fn(),
      setOpen: vi.fn(),
      clearValue: vi.fn(),
      setValueToToday: vi.fn(),
      acceptValueChanges: vi.fn(),
      cancelValueChanges: vi.fn(),
      goToNextStep: vi.fn(),
      goToPreviousStep: vi.fn(),
      hasNextStep: false,
      disabled,
      readOnly,
    } as any;

    const { user } = render(
      <PickerContext.Provider value={spys}>{element}</PickerContext.Provider>,
    );

    return { ...spys, user };
  };

  it('should not render buttons if actions array is empty', () => {
    renderWithContext(<PickersActionBar actions={[]} />);

    expect(screen.queryByRole('button')).to.equal(null);
  });

  it('should render button for "clear" action calling the associated callback', async () => {
    const { clearValue, user } = renderWithContext(<PickersActionBar actions={['clear']} />);

    await user.click(screen.getByText(/clear/i));
    expect(clearValue.mock.calls.length).to.equal(1);
  });

  it('should render button for "cancel" action calling the associated callback', async () => {
    const { cancelValueChanges, user } = renderWithContext(
      <PickersActionBar actions={['cancel']} />,
    );

    await user.click(screen.getByText(/cancel/i));
    expect(cancelValueChanges.mock.calls.length).to.equal(1);
  });

  it('should render button for "accept" action calling the associated callback', async () => {
    const { acceptValueChanges, user } = renderWithContext(
      <PickersActionBar actions={['accept']} />,
    );

    await user.click(screen.getByText(/ok/i));
    expect(acceptValueChanges.mock.calls.length).to.equal(1);
  });

  it('should render button for "today" action calling the associated callback', async () => {
    const { setValueToToday, user } = renderWithContext(<PickersActionBar actions={['today']} />);

    await user.click(screen.getByText(/today/i));
    expect(setValueToToday.mock.calls.length).to.equal(1);
  });

  it.each([
    { disabled: true, readOnly: false },
    { disabled: false, readOnly: true },
    { disabled: true, readOnly: true },
  ])('disables the action buttons for %o', ({ disabled, readOnly }) => {
    const { clearValue, setValueToToday, acceptValueChanges, cancelValueChanges, goToNextStep } =
      renderWithContext(
        <PickersActionBar
          actions={['clear', 'cancel', 'accept', 'today', 'next', 'nextOrAccept']}
        />,
        disabled,
        readOnly,
      );

    const buttons = screen.getAllByRole<HTMLButtonElement>('button');
    expect(buttons.length).to.equal(6);
    expect(buttons.every((button) => button.disabled)).to.equal(true);
    for (const button of buttons) {
      fireEvent.click(button);
    }
    expect(clearValue).not.toHaveBeenCalled();
    expect(setValueToToday).not.toHaveBeenCalled();
    expect(acceptValueChanges).not.toHaveBeenCalled();
    expect(cancelValueChanges).not.toHaveBeenCalled();
    expect(goToNextStep).not.toHaveBeenCalled();
  });

  it('should respect actions order', () => {
    renderWithContext(<PickersActionBar actions={['today', 'accept', 'clear', 'cancel']} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).to.have.text('Today');
    expect(buttons[1]).to.have.text('OK');
    expect(buttons[2]).to.have.text('Clear');
    expect(buttons[3]).to.have.text('Cancel');
  });
});
