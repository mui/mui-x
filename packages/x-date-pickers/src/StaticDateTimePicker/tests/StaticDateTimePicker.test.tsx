import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { DateTimePickerTabs, DateTimePickerTabsProps } from '../../DateTimePicker';

describe('<StaticDateTimePicker />', () => {
  const { render } = createPickerRenderer();

  it('should allow to select the same day and move to the next view', () => {
    const onChange = spy();
    render(
      <StaticDateTimePicker onChange={onChange} defaultValue={adapterToUse.date('2018-01-01')} />,
    );

    fireEvent.click(screen.getByRole('gridcell', { name: '1' }));
    expect(onChange.callCount).to.equal(1);

    expect(screen.getByLabelText(/Selected time/)).toBeVisible();
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

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
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

      expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
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
});
