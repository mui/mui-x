import { Dayjs } from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDayjsBuddhist } from '@mui/x-date-pickers/AdapterDayjsBuddhist';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeBuddhistAdapter,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import 'dayjs/locale/th';

describe('<AdapterDayjsBuddhist />', () => {
  describeBuddhistAdapter(AdapterDayjsBuddhist, {});

  describe('Adapter localization', () => {
    it('Formatting', () => {
      const adapter = new AdapterDayjsBuddhist();

      const expectDate = (format: keyof AdapterFormats, expected: string) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z') as Dayjs;

        expect(adapter.format(date, format)).to.equal(expected);
      };

      // 2020 + 543 = 2563
      expectDate('fullDate', '1 Feb 2563');
      expectDate('keyboardDate', '01/02/2563');
      expectDate('keyboardDateTime12h', '01/02/2563 11:44 PM');
      expectDate('keyboardDateTime24h', '01/02/2563 23:44');
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';

    describe('with Thai locale', () => {
      const { render, adapter } = createPickerRenderer({
        adapterName: 'dayjs-buddhist',
        locale: { code: 'th' },
      });

      const { renderWithProps } = buildFieldInteractions({
        render,
        Component: DateTimeField,
      });

      it('should have well formatted value', () => {
        const view = renderWithProps({
          enableAccessibleFieldDOMStructure: true,
          value: adapter.date(testDate),
        });

        // Thai locale uses 24h format (no meridiem)
        expectFieldValueV7(view.getSectionsContainer(), '15/05/2561 09:35');
      });
    });
  });
});
