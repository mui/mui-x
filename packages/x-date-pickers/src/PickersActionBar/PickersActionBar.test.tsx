import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import { createPickerRenderer } from 'test/utils/pickers';
import { vi, describe, it, expect } from 'vitest';
import { PickerContext } from '../hooks/usePickerContext';

describe('<PickersActionBar />', () => {
  const { render } = createPickerRenderer();

  const renderWithContext = (element: React.ReactElement) => {
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

  it('should respect actions order', () => {
    renderWithContext(<PickersActionBar actions={['today', 'accept', 'clear', 'cancel']} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).to.have.text('Today');
    expect(buttons[1]).to.have.text('OK');
    expect(buttons[2]).to.have.text('Clear');
    expect(buttons[3]).to.have.text('Cancel');
  });
});
