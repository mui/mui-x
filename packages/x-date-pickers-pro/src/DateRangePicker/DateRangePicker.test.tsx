import { DateRangePicker, DateRangePickerProps } from '@mui/x-date-pickers-pro/DateRangePicker';
import { screen, waitFor, within } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import {
  adapterToUse,
  buildFieldInteractions,
  createPickerRenderer,
  openPicker,
  openPickerAsync,
  stubMatchMedia,
} from 'test/utils/pickers';
import { pickerPopperClasses } from '@mui/x-date-pickers/internals';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';
import { isJSDOM } from 'test/utils/skipIf';
import { MultiInputDateRangeField } from '../MultiInputDateRangeField';

describe('<DateRangePicker />', () => {
  const { render } = createPickerRenderer();

  const { renderWithProps } = buildFieldInteractions({
    render,
    Component: DateRangePicker,
  });

  it('should not use the mobile picker by default', () => {
    stubMatchMedia(true);
    // Test with accessible DOM structure
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);

    unmount();

    // Test with non-accessible DOM structure
    renderWithProps({ enableAccessibleFieldDOMStructure: false });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).to.have.class(pickerPopperClasses.root);
  });

  it('should use the mobile picker when `useMediaQuery` returns `false`', () => {
    stubMatchMedia(false);
    // Test with accessible DOM structure
    const { unmount } = renderWithProps({ enableAccessibleFieldDOMStructure: true });
    openPicker({ type: 'date-range', initialFocus: 'start', fieldType: 'single-input' });
    expect(screen.queryByRole('dialog')).not.to.have.class(pickerPopperClasses.root);

    unmount();

    // Test with non-accessible DOM structure
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

  // The active range position underline (`activeBar`) is measured from the rendered
  // section widths (`offsetWidth`), which is always `0` in jsdom, so these run in the browser.
  describe('active range position underline (single input)', () => {
    const getPickerDay = (name: string, picker = 'January 2018') =>
      within(screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name });

    it.skipIf(isJSDOM)(
      'should render the active bar with a non-zero width for the focused range position',
      async () => {
        stubMatchMedia(true);
        const { user } = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapterToUse.date('2022-04-17'), adapterToUse.date('2022-04-21')],
        });
        await openPickerAsync(user, {
          type: 'date-range',
          initialFocus: 'start',
          fieldType: 'single-input',
        });

        const fieldRoot = document.querySelector<HTMLElement>('[data-active-range-position]');
        expect(fieldRoot).to.have.attribute('data-active-range-position', 'start');

        const activeBar = document.querySelector<HTMLElement>(
          `.${pickersInputBaseClasses.activeBar}`,
        );
        expect(activeBar).not.to.equal(null);
        await waitFor(() => {
          expect(activeBar!.offsetWidth).to.be.greaterThan(0);
        });
      },
    );

    it.skipIf(isJSDOM)(
      'should move the active bar to the end range position after selecting the start date',
      async () => {
        stubMatchMedia(true);
        const { user } = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          defaultValue: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-06')],
        });
        await openPickerAsync(user, {
          type: 'date-range',
          initialFocus: 'start',
          fieldType: 'single-input',
        });

        const activeBarSelector = `.${pickersInputBaseClasses.activeBar}`;
        let startLeft = 0;
        await waitFor(() => {
          const activeBar = document.querySelector<HTMLElement>(activeBarSelector)!;
          expect(activeBar.offsetWidth).to.be.greaterThan(0);
          startLeft = activeBar.offsetLeft;
        });

        // Selecting the start date advances the picker to the end range position.
        await user.click(getPickerDay('3'));

        await waitFor(() => {
          expect(document.querySelector('[data-active-range-position]')).to.have.attribute(
            'data-active-range-position',
            'end',
          );
          // The bar now sits under the end date sections, well to the right of the start
          // sections (observed gap is ~100px; 40px keeps the assertion comfortably robust).
          const activeBar = document.querySelector<HTMLElement>(activeBarSelector)!;
          expect(activeBar.offsetLeft).to.be.greaterThan(startLeft + 40);
        });
      },
    );
  });
});
