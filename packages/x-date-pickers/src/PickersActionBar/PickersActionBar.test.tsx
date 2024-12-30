import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import { createPickerRenderer } from 'test/utils/pickers';
import { PickerActionsContext } from '../internals/components/PickerProvider';

describe('<PickersActionBar />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  const renderWithContext = (element: React.ReactElement) => {
    const spys = {
      setOpen: spy(),
      clearValue: spy(),
      setValueToToday: spy(),
      acceptValueChanges: spy(),
      cancelValueChanges: spy(),
    };

    render(<PickerActionsContext.Provider value={spys}>{element}</PickerActionsContext.Provider>);

    return spys;
  };

  it('should not render buttons if actions array is empty', () => {
    renderWithContext(<PickersActionBar actions={[]} />);

    expect(screen.queryByRole('button')).to.equal(null);
  });

  it('should render button for "clear" action calling the associated callback', () => {
    const { clearValue } = renderWithContext(<PickersActionBar actions={['clear']} />);

    fireEvent.click(screen.getByText(/clear/i));
    expect(clearValue.callCount).to.equal(1);
  });

  it('should render button for "cancel" action calling the associated callback', () => {
    const { cancelValueChanges } = renderWithContext(<PickersActionBar actions={['cancel']} />);

    fireEvent.click(screen.getByText(/cancel/i));
    expect(cancelValueChanges.callCount).to.equal(1);
  });

  it('should render button for "accept" action calling the associated callback', () => {
    const { acceptValueChanges } = renderWithContext(<PickersActionBar actions={['accept']} />);

    fireEvent.click(screen.getByText(/ok/i));
    expect(acceptValueChanges.callCount).to.equal(1);
  });

  it('should render button for "today" action calling the associated callback', () => {
    const { setValueToToday } = renderWithContext(<PickersActionBar actions={['today']} />);

    fireEvent.click(screen.getByText(/today/i));
    expect(setValueToToday.callCount).to.equal(1);
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
