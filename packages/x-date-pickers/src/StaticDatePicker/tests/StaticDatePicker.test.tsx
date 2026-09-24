import { screen } from '@mui/internal-test-utils';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describe, it, expect, vi } from 'vitest';

describe('<StaticDatePicker />', () => {
  const { render } = createPickerRenderer();

  it('render proper month', () => {
    render(<StaticDatePicker defaultValue={adapterToUse.date('2019-01-01')} />);

    expect(screen.getByText('January 2019')).toBeVisible();
    expect(screen.getAllByTestId('day')).to.have.length(31);
  });

  it('should not render the toolbar title as a heading', () => {
    render(<StaticDatePicker defaultValue={adapterToUse.date('2019-01-01')} />);

    // the toolbar is not inside a dialog here, so it must not add an entry to the page's heading outline
    expect(screen.queryByRole('heading', { level: 2 })).to.equal(null);
  });

  it('switches between months', async () => {
    const { user } = render(
      <StaticDatePicker reduceAnimations defaultValue={adapterToUse.date('2019-01-01')} />,
    );

    expect(screen.getByTestId('calendar-month-and-year-text')).to.have.text('January 2019');

    const nextMonth = screen.getByLabelText('Next month');
    const previousMonth = screen.getByLabelText('Previous month');
    await user.click(nextMonth);
    await user.click(nextMonth);

    await user.click(previousMonth);
    await user.click(previousMonth);
    await user.click(previousMonth);

    expect(screen.getByTestId('calendar-month-and-year-text')).to.have.text('December 2018');
  });

  describe('prop: onCancel', () => {
    it('should call onCancel and reset the value when clicking the "Cancel" action', async () => {
      const onCancel = vi.fn();
      const onChange = vi.fn();

      const { user } = render(
        <StaticDatePicker
          onCancel={onCancel}
          onChange={onChange}
          defaultValue={adapterToUse.date('2019-01-01')}
          slotProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );

      await user.click(screen.getByRole('gridcell', { name: '2' }));
      expect(onChange.mock.calls.length).to.equal(1);
      expect(onChange.mock.lastCall?.[0]).toEqualDateTime(new Date(2019, 0, 2));

      await user.click(screen.getByText('Cancel'));

      expect(onCancel.mock.calls.length).to.equal(1);
      expect(onChange.mock.calls.length).to.equal(2);
      expect(onChange.mock.lastCall?.[0]).toEqualDateTime(new Date(2019, 0, 1));
    });
  });

  describe('props - autoFocus', () => {
    function Test(props) {
      return (
        <div id="pickerWrapper">
          <StaticDatePicker {...props} />
        </div>
      );
    }

    it('should take focus when `autoFocus=true`', () => {
      render(<Test autoFocus />);

      const isInside = document.getElementById('pickerWrapper')?.contains(document.activeElement);
      expect(isInside).to.equal(true);
    });

    it('should not take focus when `autoFocus=false`', () => {
      render(<Test />);

      const isInside = document.getElementById('pickerWrapper')?.contains(document.activeElement);
      expect(isInside).to.equal(false);
    });
  });
});
