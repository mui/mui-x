import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';

describe('<MonthCalendar />', () => {
  const { render } = createPickerRenderer({ clock: 'fake', clockConfig: new Date(2019, 0, 1) });

  it('should allow to pick month standalone by click, `Enter` and `Space`', () => {
    const onChange = spy();
    render(<MonthCalendar value={adapterToUse.date('2019-02-02')} onChange={onChange} />);
    const targetMonth = screen.getByRole('radio', { name: 'February' });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetMonth.tagName).to.equal('BUTTON');

    fireEvent.click(targetMonth);

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2019, 1, 2));
  });

  it('should select start of month without time when no initial value is present', () => {
    const onChange = spy();
    render(<MonthCalendar onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: 'February' }));

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2019, 1, 1, 0, 0, 0));
  });

  it('does not allow to pick months if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <MonthCalendar value={adapterToUse.date('2019-02-02')} onChange={onChangeMock} readOnly />,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('clicking on a PickersMonth button should not trigger the form submit', () => {
    const onSubmitMock = spy();
    render(
      <form onSubmit={onSubmitMock}>
        <MonthCalendar defaultValue={adapterToUse.date('2018-02-02')} />
      </form>,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onSubmitMock.callCount).to.equal(0);
  });

  describe('Disabled', () => {
    it('should disable all months if props.disabled = true', () => {
      const onChange = spy();
      render(
        <MonthCalendar value={adapterToUse.date('2019-02-15')} onChange={onChange} disabled />,
      );

      screen.getAllByRole('radio').forEach((monthButton) => {
        expect(monthButton).to.have.attribute('disabled');
        fireEvent.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      });
    });

    it('should disable months before props.minDate but not the month in which props.minDate is', () => {
      const onChange = spy();
      render(
        <MonthCalendar
          value={adapterToUse.date('2019-02-15')}
          onChange={onChange}
          minDate={adapterToUse.date('2019-02-12')}
        />,
      );

      const january = screen.getByText('Jan', { selector: 'button' });
      const february = screen.getByText('Feb', { selector: 'button' });

      expect(january).to.have.attribute('disabled');
      expect(february).not.to.have.attribute('disabled');

      fireEvent.click(january);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(february);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months after props.maxDate but not the month in which props.maxDate is', () => {
      const onChange = spy();
      render(
        <MonthCalendar
          value={adapterToUse.date('2019-02-15')}
          onChange={onChange}
          maxDate={adapterToUse.date('2019-04-12')}
        />,
      );

      const may = screen.getByText('May', { selector: 'button' });
      const april = screen.getByText('Apr', { selector: 'button' });

      expect(may).to.have.attribute('disabled');
      expect(april).not.to.have.attribute('disabled');

      fireEvent.click(may);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(april);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months if props.shouldDisableMonth returns true', () => {
      const onChange = spy();
      render(
        <MonthCalendar
          value={adapterToUse.date('2019-02-02')}
          onChange={onChange}
          shouldDisableMonth={(month) => adapterToUse.getMonth(month) === 3}
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      const jun = screen.getByText('Jun', { selector: 'button' });

      expect(april).to.have.attribute('disabled');
      expect(jun).not.to.have.attribute('disabled');

      fireEvent.click(april);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(jun);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months after initial render when "disableFuture" prop changes', () => {
      const { setProps } = render(<MonthCalendar />);

      const january = screen.getByText('Jan', { selector: 'button' });
      const february = screen.getByText('Feb', { selector: 'button' });

      expect(january).not.to.have.attribute('disabled');
      expect(february).not.to.have.attribute('disabled');

      setProps({ disableFuture: true });

      expect(january).not.to.have.attribute('disabled');
      expect(february).to.have.attribute('disabled');
    });

    it('should not mark the `referenceDate` month as selected', () => {
      render(<MonthCalendar referenceDate={adapterToUse.date('2018-02-02')} />);

      expect(screen.getByRole('radio', { name: 'February', checked: false })).not.to.equal(null);
    });
  });
});
