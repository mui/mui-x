import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  describeConformance,
  fireTouchChangedEvent,
  screen,
  getAllByRole,
  fireEvent,
} from '@mui/monorepo/test/utils';
import { adapterToUse, wrapPickerMount, createPickerRenderer } from 'test/utils/pickers-utils';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<StaticTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 2, 12, 8, 16, 0),
  });

  describeValidation(StaticTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'static-picker',
  }));

  describeConformance(<StaticTimePicker />, () => ({
    classes: {} as any,
    render,
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
  }));

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
    const onChange = spy();
    const onViewChange = spy();
    render(
      <StaticTimePicker
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={onChange}
        onViewChange={onViewChange}
        readOnly
      />,
    );

    // Can switch between views
    fireEvent.click(screen.getByMuiTest('minutes'));
    expect(onViewChange.callCount).to.equal(1);

    fireEvent.click(screen.getByMuiTest('hours'));
    expect(onViewChange.callCount).to.equal(2);

    // Can not switch between meridiem
    fireEvent.click(screen.getByRole('button', { name: /AM/i }));
    expect(onChange.callCount).to.equal(0);
    fireEvent.click(screen.getByRole('button', { name: /PM/i }));
    expect(onChange.callCount).to.equal(0);

    // Can not set value
    fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', selectEvent);
    expect(onChange.callCount).to.equal(0);

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
    const onChange = spy();
    const onViewChange = spy();
    render(
      <StaticTimePicker
        value={adapterToUse.date(new Date(2019, 0, 1))}
        onChange={onChange}
        onViewChange={onViewChange}
        disabled
      />,
    );

    // Can switch between views
    fireEvent.click(screen.getByMuiTest('minutes'));
    expect(onViewChange.callCount).to.equal(1);

    fireEvent.click(screen.getByMuiTest('hours'));
    expect(onViewChange.callCount).to.equal(2);

    // Can not switch between meridiem
    fireEvent.click(screen.getByRole('button', { name: /AM/i }));
    expect(onChange.callCount).to.equal(0);
    fireEvent.click(screen.getByRole('button', { name: /PM/i }));
    expect(onChange.callCount).to.equal(0);

    // Can not set value
    fireTouchChangedEvent(screen.getByMuiTest('clock'), 'touchmove', selectEvent);
    expect(onChange.callCount).to.equal(0);

    // hours are disabled
    const hoursContainer = screen.getByRole('listbox');
    const hours = getAllByRole(hoursContainer, 'option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');
    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(12);

    // meridiem are disabled
    expect(screen.getByRole('button', { name: /AM/i })).to.have.attribute('disabled');
    expect(screen.getByRole('button', { name: /PM/i })).to.have.attribute('disabled');
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<StaticTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
