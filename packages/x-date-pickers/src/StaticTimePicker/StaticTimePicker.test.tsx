import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import TextField from '@mui/material/TextField';
import {
  describeConformance,
  fireTouchChangedEvent,
  screen,
  getAllByRole,
  fireEvent,
} from '@mui/monorepo/test/utils';
import { StaticTimePicker } from './StaticTimePicker';
import {
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
} from '../../../../test/utils/pickers-utils';

describe('<StaticTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

  describeConformance(
    <StaticTimePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={null}
    />,
    () => ({
      classes: {},
      muiName: 'MuiStaticTimePicker',
      wrapMount: wrapPickerMount,
      refInstanceof: undefined,
      skip: [
        'componentProp',
        'componentsProp',
        'themeDefaultProps',
        'themeStyleOverrides',
        'themeVariants',
        'mergeClassName',
        'propsSpread',
        // TODO: `ref` is typed but has no effect
        'refForwarding',
        'rootClass',
        'reactTestRenderer',
      ],
    }),
  );

  it('should allows view modification, but not update value when `readOnly` prop is passed', function test() {
    // Only run in supported browsers
    if (typeof Touch === 'undefined') {
      this.skip();
    }
    const selectEvent = {
      changedTouches: [
        {
          clientX: 150,
          clientY: 60,
        },
      ],
    };
    const onChangeMock = spy();
    const onViewChangeMock = spy();
    render(
      <StaticTimePicker
        value={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onViewChange={onViewChangeMock}
        renderInput={(props) => <TextField {...props} />}
        readOnly
      />,
    );

    // Can switch between views
    fireEvent.click(screen.getByMuiTest('minutes'));
    expect(onViewChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByMuiTest('hours'));
    expect(onViewChangeMock.callCount).to.equal(2);

    // Can not switch between meridiem
    fireEvent.click(screen.getByRole('button', { name: /AM/i }));
    expect(onChangeMock.callCount).to.equal(0);
    fireEvent.click(screen.getByRole('button', { name: /PM/i }));
    expect(onChangeMock.callCount).to.equal(0);

    // Can not set value
    fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', selectEvent);
    expect(onChangeMock.callCount).to.equal(0);

    // hours are not disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = getAllByRole(hoursContainer, 'option');
    const disabledHours = hours.filter((day) => day.getAttribute('aria-disabled') === 'true');

    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(0);
  });

  it('should allow switching between views and display disabled options when `disabled` prop is passed', function test() {
    // Only run in supported browsers
    if (typeof Touch === 'undefined') {
      this.skip();
    }
    const selectEvent = {
      changedTouches: [
        {
          clientX: 150,
          clientY: 60,
        },
      ],
    };
    const onChangeMock = spy();
    const onViewChangeMock = spy();
    render(
      <StaticTimePicker
        value={adapterToUse.date('2019-01-01T00:00:00.000')}
        onChange={onChangeMock}
        onViewChange={onViewChangeMock}
        renderInput={(props) => <TextField {...props} />}
        disabled
      />,
    );

    // Can switch between views
    fireEvent.click(screen.getByMuiTest('minutes'));
    expect(onViewChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByMuiTest('hours'));
    expect(onViewChangeMock.callCount).to.equal(2);

    // Can not switch between meridiem
    fireEvent.click(screen.getByRole('button', { name: /AM/i }));
    expect(onChangeMock.callCount).to.equal(0);
    fireEvent.click(screen.getByRole('button', { name: /PM/i }));
    expect(onChangeMock.callCount).to.equal(0);

    // Can not set value
    fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', selectEvent);
    expect(onChangeMock.callCount).to.equal(0);

    // hours are disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = getAllByRole(hoursContainer, 'option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');
    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(12);

    // meridiem are disabled
    expect(screen.getByRole('button', { name: /AM/i }).getAttribute('disabled')).to.not.equal(null);
    expect(screen.getByRole('button', { name: /PM/i }).getAttribute('disabled')).to.not.equal(null);
  });
});
