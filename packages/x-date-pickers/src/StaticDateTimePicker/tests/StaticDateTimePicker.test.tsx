import * as React from 'react';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { DateTimePicker, DateTimePickerTabs, DateTimePickerTabsProps } from '../../DateTimePicker';

describe('<StaticDateTimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should allow to select the same day', () => {
    const onChange = spy();
    render(
      <StaticDateTimePicker onChange={onChange} defaultValue={adapterToUse.date('2018-01-01')} />,
    );

    fireEvent.click(screen.getByRole('gridcell', { name: '1' }));
    expect(onChange.callCount).to.equal(1);
  });

  describe('Component slot: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <StaticDateTimePicker
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByTestId('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });

    it('should render tabs when `hidden` is `false`', () => {
      render(
        <StaticDateTimePicker
          displayStaticWrapperAs="desktop"
          slotProps={{
            tabs: { hidden: false },
          }}
        />,
      );

      expect(screen.queryByTestId('picker-toolbar-title')).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });

    it('should render custom component', () => {
      function CustomPickerTabs(props: DateTimePickerTabsProps) {
        return (
          <React.Fragment>
            <DateTimePickerTabs {...props} />
            <span>test-custom-picker-tabs</span>
          </React.Fragment>
        );
      }
      render(
        <StaticDateTimePicker displayStaticWrapperAs="mobile" slots={{ tabs: CustomPickerTabs }} />,
      );

      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
      expect(screen.getByText('test-custom-picker-tabs')).not.to.equal(null);
    });
  });

  it('should not steal focus from DateTimePicker field when sharing a controlled value', async () => {
    function App() {
      const [value, setValue] = React.useState<PickerValue>(adapterToUse.date('2026-02-16T15:30'));

      return (
        <div>
          <DateTimePicker label="DateTimePicker" value={value} onChange={setValue} />
          <StaticDateTimePicker value={value} onChange={setValue} />
        </div>
      );
    }

    const { user } = render(<App />);

    // Switch to time tab in StaticDateTimePicker
    await user.click(screen.getByRole('tab', { name: 'pick time' }));

    const monthInput = screen.getByRole('spinbutton', { name: 'Month' });
    const dayInput = screen.getByRole('spinbutton', { name: 'Day' });

    await user.click(monthInput);
    expect(document.activeElement).to.equal(monthInput);

    // arrow up to the next month
    await user.keyboard('{ArrowUp}');
    // Focus should remain on the DateTimePicker field, not move to StaticDateTimePicker
    expect(document.activeElement).to.equal(monthInput);

    // arrow right to the day spinbutton
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).to.equal(dayInput);

    // arrow down to previous day
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).to.equal(dayInput);
  });
});
