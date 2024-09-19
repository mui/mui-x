import { fireEvent } from '@mui/internal-test-utils';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import {
  createPickerRenderer,
  buildFieldInteractions,
  getTextbox,
  expectFieldValueV7,
  expectFieldValueV6,
  expectFieldPlaceholderV6,
  adapterToUse,
  describeAdapters,
} from 'test/utils/pickers';

describe('<DesktopDatePicker /> - Field', () => {
  describe('Basic behaviors', () => {
    const { render, clock } = createPickerRenderer({
      clock: 'fake',
      clockConfig: new Date('2018-01-01T10:05:05.000'),
    });
    const { renderWithProps } = buildFieldInteractions({
      clock,
      render,
      Component: DesktopDatePicker,
    });

    it('should be able to reset a single section', () => {
      // Test with v7 input
      let view = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true as const,
          format: `${adapterToUse.formats.month} ${adapterToUse.formats.dayOfMonth}`,
        },
        { componentFamily: 'picker' },
      );

      view.selectSection('month');
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM DD');

      view.pressKey(0, 'N');
      expectFieldValueV7(view.getSectionsContainer(), 'November DD');

      view.pressKey(1, '4');
      expectFieldValueV7(view.getSectionsContainer(), 'November 04');

      view.pressKey(1, '');
      expectFieldValueV7(view.getSectionsContainer(), 'November DD');

      view.unmount();

      // Test with v6 input
      view = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: false as const,
          format: `${adapterToUse.formats.month} ${adapterToUse.formats.dayOfMonth}`,
        },
        { componentFamily: 'picker' },
      );

      const input = getTextbox();
      view.selectSection('month');
      expectFieldPlaceholderV6(input, 'MMMM DD');

      fireEvent.change(input, { target: { value: 'N DD' } }); // Press "N"
      expectFieldValueV6(input, 'November DD');

      fireEvent.change(input, { target: { value: 'November 4' } }); // Press "4"
      expectFieldValueV6(input, 'November 04');

      fireEvent.change(input, { target: { value: 'November ' } });
      expectFieldValueV6(input, 'November DD');
    });

    it('should adapt the default field format based on the props of the picker', () => {
      const testFormat = (props: DesktopDatePickerProps<any, any>, expectedFormat: string) => {
        // Test with v7 input
        let view = renderWithProps(
          { ...props, enableAccessibleFieldDOMStructure: true as const },
          { componentFamily: 'picker' },
        );
        expectFieldValueV7(view.getSectionsContainer(), expectedFormat);
        view.unmount();

        // Test with v6 input
        view = renderWithProps(
          { ...props, enableAccessibleFieldDOMStructure: false as const },
          { componentFamily: 'picker' },
        );
        const input = getTextbox();
        expectFieldPlaceholderV6(input, expectedFormat);
        view.unmount();
      };

      testFormat({ views: ['year'] }, 'YYYY');
      testFormat({ views: ['month'] }, 'MMMM');
      testFormat({ views: ['day'] }, 'DD');
      testFormat({ views: ['month', 'day'] }, 'MMMM DD');
      testFormat({ views: ['year', 'month'] }, 'MMMM YYYY');
      testFormat({ views: ['year', 'month', 'day'] }, 'MM/DD/YYYY');
      testFormat({ views: ['year', 'day'] }, 'MM/DD/YYYY');
    });
  });

  describe('slots: field', () => {
    const { render, clock } = createPickerRenderer({
      clock: 'fake',
      clockConfig: new Date('2018-01-01T10:05:05.000'),
    });
    const { renderWithProps } = buildFieldInteractions({
      clock,
      render,
      Component: DesktopDatePicker,
    });

    it('should allow to override the placeholder (v6 only)', () => {
      renderWithProps({
        enableAccessibleFieldDOMStructure: false,
        slotProps: {
          field: {
            // @ts-ignore
            placeholder: 'Custom placeholder',
          },
        },
      });

      const input = getTextbox();
      expectFieldPlaceholderV6(input, 'Custom placeholder');
    });
  });

  describe('slots: textField', () => {
    const { render, clock } = createPickerRenderer({
      clock: 'fake',
      clockConfig: new Date('2018-01-01T10:05:05.000'),
    });
    const { renderWithProps } = buildFieldInteractions({
      clock,
      render,
      Component: DesktopDatePicker,
    });

    describe('placeholder override (v6 only)', () => {
      it('should allow to override the placeholder', () => {
        renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          slotProps: {
            textField: {
              placeholder: 'Custom placeholder',
            },
          },
        });

        const input = getTextbox();
        expectFieldPlaceholderV6(input, 'Custom placeholder');
      });

      it('should render blank placeholder when prop is an empty string', () => {
        renderWithProps({
          enableAccessibleFieldDOMStructure: false,
          slotProps: {
            textField: {
              placeholder: '',
            },
          },
        });

        const input = getTextbox();
        expectFieldPlaceholderV6(input, '');
      });
    });
  });

  describeAdapters('Timezone', DesktopDatePicker, ({ adapter, renderWithProps }) => {
    it('should clear the selected section when all sections are completed when using timezones', () => {
      const view = renderWithProps(
        {
          enableAccessibleFieldDOMStructure: true as const,
          value: adapter.date()!,
          format: `${adapter.formats.month} ${adapter.formats.year}`,
          timezone: 'America/Chicago',
        },
        { componentFamily: 'picker' },
      );

      expectFieldValueV7(view.getSectionsContainer(), 'June 2022');
      view.selectSection('month');

      view.pressKey(0, '');
      expectFieldValueV7(view.getSectionsContainer(), 'MMMM 2022');
    });
  });
});
