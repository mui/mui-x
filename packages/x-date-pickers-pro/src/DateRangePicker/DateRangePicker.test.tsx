import * as React from 'react';
import { DateRangePicker, DateRangePickerProps } from '@mui/x-date-pickers-pro/DateRangePicker';
import { screen } from '@mui/internal-test-utils/createRenderer';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  buildFieldInteractions,
  createPickerRenderer,
  openPicker,
  stubMatchMedia,
} from 'test/utils/pickers';
import { pickerPopperClasses } from '@mui/x-date-pickers/internals/components/PickerPopper';
import { MultiInputDateRangeField } from '../MultiInputDateRangeField';

describe('<DateRangePicker />', () => {
  const { render } = createPickerRenderer();

  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: DateRangePicker,
  });

  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('should not use the mobile picker by default', () => {
    // Test with accessible DOM structure
    window.matchMedia = stubMatchMedia(true);
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);

    unmount();

    // Test with non-accessible DOM structure
    window.matchMedia = stubMatchMedia(true);
    renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);
  });

  it('should use the mobile picker when `useMediaQuery` returns `false`', () => {
    // Test with accessible DOM structure
    window.matchMedia = stubMatchMedia(false);
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);

    unmount();

    // Test with non-accessible DOM structure
    window.matchMedia = stubMatchMedia(false);
    renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);
  });

  describe('form behavior', () => {
    function TestComponent({
      onSubmit,
      ...other
    }: DateRangePickerProps & { onSubmit: (data: FormData) => void }) {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(new window.FormData(event.target as any));
          }}
        >
          <DateRangePicker
            name="testDate"
            defaultValue={[new Date('2022-04-17'), new Date('2022-04-21')]}
            {...other}
          />
          <button type="submit">Submit</button>
        </form>
      );
    }

    it('should submit the form when "Enter" is pressed on the input', async () => {
      const handleSubmit = spy();
      const { user } = render(<TestComponent onSubmit={handleSubmit} />);

      // focus the input
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(handleSubmit.callCount).to.equal(1);
      expect([...handleSubmit.lastCall.args[0]][0]).to.deep.equal([
        'testDate',
        '04/17/2022 – 04/21/2022',
      ]);
    });

    it('should not submit the form when "Enter" is pressed on the multi input field', async () => {
      const handleSubmit = spy();
      const { user } = render(
        <TestComponent
          onSubmit={handleSubmit}
          slots={{ field: MultiInputDateRangeField }}
          name={undefined}
        />,
      );

      // focus the input
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(handleSubmit.callCount).to.equal(0);
    });

    it('should not submit the form when "Enter" is pressed on the input with "defaultMuiPrevented" set to "true"', async () => {
      const handleSubmit = spy();
      const { user } = render(
        <TestComponent
          onSubmit={handleSubmit}
          slotProps={{
            textField: {
              onKeyDown: (event) => {
                if (event.key === 'Enter') {
                  event.defaultMuiPrevented = true;
                }
              },
            },
          }}
        />,
      );

      // focus the input
      await user.keyboard('{Tab}');
      await user.keyboard('{Enter}');

      expect(handleSubmit.callCount).to.equal(0);
    });
  });
});
