import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireTouchChangedEvent, screen, within, fireEvent } from '@mui/internal-test-utils';
import { adapterToUse, createPickerRenderer, describeValidation } from 'test/utils/pickers';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

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
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));

  it('should allow view modification, but not update value when `readOnly` prop is passed', function test() {
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
        value={adapterToUse.date('2019-01-01')}
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
    const hours = within(hoursContainer).getAllByRole('option');
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
        value={adapterToUse.date('2019-01-01')}
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
    const hours = within(hoursContainer).getAllByRole('option');
    const disabledHours = hours.filter((hour) => hour.getAttribute('aria-disabled') === 'true');
    expect(hours.length).to.equal(12);
    expect(disabledHours.length).to.equal(12);

    // meridiem are disabled
    expect(screen.getByRole('button', { name: /AM/i })).to.have.attribute('disabled');
    expect(screen.getByRole('button', { name: /PM/i })).to.have.attribute('disabled');
  });
});
