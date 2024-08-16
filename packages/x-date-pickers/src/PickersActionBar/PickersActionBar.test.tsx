import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/internal-test-utils';
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import { createPickerRenderer } from 'test/utils/pickers';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<PickersActionBar />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
  });

  it('should not render buttons if actions array is empty', () => {
    const onAccept = () => {};
    const onClear = () => {};
    const onCancel = () => {};
    const onSetToday = () => {};
    render(
      <PickersActionBar
        actions={[]}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
      />,
    );

    expect(screen.queryByRole('button')).to.equal(null);
  });

  it('should render button for "clear" action calling the associated callback', () => {
    const onAccept = spy();
    const onClear = spy();
    const onCancel = spy();
    const onSetToday = spy();

    render(
      <PickersActionBar
        actions={['clear']}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
      />,
    );

    fireUserEvent.mousePress(screen.getByText(/clear/i));
    expect(onClear.callCount).to.equal(1);
  });

  it('should render button for "cancel" action calling the associated callback', () => {
    const onAccept = spy();
    const onClear = spy();
    const onCancel = spy();
    const onSetToday = spy();

    render(
      <PickersActionBar
        actions={['cancel']}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
      />,
    );

    fireUserEvent.mousePress(screen.getByText(/cancel/i));
    expect(onCancel.callCount).to.equal(1);
  });

  it('should render button for "accept" action calling the associated callback', () => {
    const onAccept = spy();
    const onClear = spy();
    const onCancel = spy();
    const onSetToday = spy();

    render(
      <PickersActionBar
        actions={['accept']}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
      />,
    );

    fireUserEvent.mousePress(screen.getByText(/ok/i));
    expect(onAccept.callCount).to.equal(1);
  });

  it('should render button for "today" action calling the associated callback', () => {
    const onAccept = spy();
    const onClear = spy();
    const onCancel = spy();
    const onSetToday = spy();

    render(
      <PickersActionBar
        actions={['today']}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
      />,
    );

    fireUserEvent.mousePress(screen.getByText(/today/i));
    expect(onSetToday.callCount).to.equal(1);
  });

  it('should respect actions order', () => {
    const onAccept = () => {};
    const onClear = () => {};
    const onCancel = () => {};
    const onSetToday = () => {};
    render(
      <PickersActionBar
        actions={['today', 'accept', 'clear', 'cancel']}
        onAccept={onAccept}
        onClear={onClear}
        onCancel={onCancel}
        onSetToday={onSetToday}
      />,
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).to.have.text('Today');
    expect(buttons[1]).to.have.text('OK');
    expect(buttons[2]).to.have.text('Clear');
    expect(buttons[3]).to.have.text('Cancel');
  });
});
