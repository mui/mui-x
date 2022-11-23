import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers-utils';

describe('<MonthCalendar />', () => {
  const { render } = createPickerRenderer();

  it('allows to pick month standalone', () => {
    const onChangeMock = spy();
    render(
      <MonthCalendar value={adapterToUse.date(new Date(2019, 1, 2))} onChange={onChangeMock} />,
    );

    fireEvent.click(screen.getByText('May', { selector: 'button' }));
    expect((onChangeMock.args[0][0] as Date).getMonth()).to.equal(4); // month index starting from 0
  });

  it('does not allow to pick months if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <MonthCalendar
        value={adapterToUse.date(new Date(2019, 1, 2))}
        onChange={onChangeMock}
        readOnly
      />,
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
        <MonthCalendar defaultValue={adapterToUse.date(new Date(2019, 1, 2))} />
      </form>,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onSubmitMock.callCount).to.equal(0);
  });

  describe('Disabled', () => {
    it('should disable all months if props.disabled = true', () => {
      const onChange = spy();
      render(
        <MonthCalendar
          value={adapterToUse.date(new Date(2019, 1, 15))}
          onChange={onChange}
          disabled
        />,
      );

      screen.getAllByRole('button').forEach((monthButton) => {
        expect(monthButton).to.have.attribute('disabled');
        fireEvent.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      });
    });

    it('should disable months before props.minDate but not the month in which props.minDate is', () => {
      const onChange = spy();
      render(
        <MonthCalendar
          value={adapterToUse.date(new Date(2019, 1, 15))}
          onChange={onChange}
          minDate={adapterToUse.date(new Date(2019, 1, 12))}
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
          value={adapterToUse.date(new Date(2019, 1, 15))}
          onChange={onChange}
          maxDate={adapterToUse.date(new Date(2019, 3, 12))}
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
          value={adapterToUse.date(new Date(2019, 1, 2))}
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
  });
});
