import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { act, fireEvent, screen } from '@mui/internal-test-utils';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';

describe('<YearCalendar />', () => {
  const { render } = createPickerRenderer({ clock: 'fake', clockConfig: new Date(2019, 0, 1) });

  it('allows to pick year standalone by click, `Enter` and `Space`', () => {
    const onChange = spy();
    render(<YearCalendar value={adapterToUse.date('2019-02-02')} onChange={onChange} />);
    const targetYear = screen.getByRole('radio', { name: '2025' });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2025, 1, 2));
  });

  it('should select start of year without time when no initial value is present', () => {
    const onChange = spy();
    render(<YearCalendar onChange={onChange} />);

    fireEvent.click(screen.getByRole('radio', { name: '2025' }));

    expect(onChange.callCount).to.equal(1);
    expect(onChange.args[0][0]).toEqualDateTime(new Date(2025, 0, 1, 0, 0, 0, 0));
  });

  it('does not allow to pick year if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <YearCalendar value={adapterToUse.date('2019-02-02')} onChange={onChangeMock} readOnly />,
    );
    const targetYear = screen.getByRole('radio', { name: '2025' });
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(0);
  });

  describe('Disabled', () => {
    it('should disable all years if props.disabled = true', () => {
      const onChange = spy();
      render(<YearCalendar value={adapterToUse.date('2017-02-15')} onChange={onChange} disabled />);

      screen.getAllByRole('radio').forEach((monthButton) => {
        expect(monthButton).to.have.attribute('disabled');
        fireEvent.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      });
    });

    it('should not render years before props.minDate but should render and not disable the year in which props.minDate is', () => {
      const onChange = spy();
      render(
        <YearCalendar
          value={adapterToUse.date('2017-02-15')}
          onChange={onChange}
          minDate={adapterToUse.date('2018-02-12')}
        />,
      );

      const year2017 = screen.queryByText('2017', { selector: 'button' });
      const year2018 = screen.getByText('2018', { selector: 'button' });

      expect(year2017).to.equal(null);
      expect(year2018).not.to.have.attribute('disabled');

      fireEvent.click(year2018);
      expect(onChange.callCount).to.equal(1);
    });

    it('should not render years after props.maxDate but should render and not disable the year in which props.maxDate is', () => {
      const onChange = spy();
      render(
        <YearCalendar
          value={adapterToUse.date('2019-02-15')}
          onChange={onChange}
          maxDate={adapterToUse.date('2025-04-12')}
        />,
      );

      const year2026 = screen.queryByText('2026', { selector: 'button' });
      const year2025 = screen.getByText('2025', { selector: 'button' });

      expect(year2026).to.equal(null);
      expect(year2025).not.to.have.attribute('disabled');

      fireEvent.click(year2025);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable years if props.shouldDisableYear returns true', () => {
      const onChange = spy();
      render(
        <YearCalendar
          value={adapterToUse.date('2019-01-02')}
          onChange={onChange}
          shouldDisableYear={(month) => adapterToUse.getYear(month) === 2024}
        />,
      );

      const year2024 = screen.getByText('2024', { selector: 'button' });
      const year2025 = screen.getByText('2025', { selector: 'button' });

      expect(year2024).to.have.attribute('disabled');
      expect(year2025).not.to.have.attribute('disabled');

      fireEvent.click(year2024);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(year2025);
      expect(onChange.callCount).to.equal(1);
    });
  });

  it('should allow to focus years when it contains valid date', () => {
    render(
      <YearCalendar
        // date is chose such as replacing year by 2018 or 2020 makes it out of valid range
        defaultValue={adapterToUse.date('2019-08-01')}
        autoFocus // needed to allow keyboard navigation
      />,
    );

    const button2019 = screen.getByRole('radio', { name: '2019' });

    act(() => button2019.focus());
    fireEvent.keyDown(button2019, { key: 'ArrowLeft' });
    expect(document.activeElement).to.have.text('2018');

    act(() => button2019.focus());
    fireEvent.keyDown(button2019, { key: 'ArrowRight' });
    expect(document.activeElement).to.have.text('2020');
  });

  it('should disable years after initial render when "disableFuture" prop changes', () => {
    const { setProps } = render(<YearCalendar />);

    const year2019 = screen.getByText('2019', { selector: 'button' });
    const year2020 = screen.getByText('2020', { selector: 'button' });

    expect(year2019).not.to.have.attribute('disabled');
    expect(year2020).not.to.have.attribute('disabled');

    setProps({ disableFuture: true });

    expect(year2019).not.to.have.attribute('disabled');
    expect(year2020).to.have.attribute('disabled');
  });

  it('should not mark the `referenceDate` year as selected', () => {
    render(<YearCalendar referenceDate={adapterToUse.date('2018-02-02')} />);

    expect(screen.getByRole('radio', { name: '2018', checked: false })).not.to.equal(null);
  });
});
