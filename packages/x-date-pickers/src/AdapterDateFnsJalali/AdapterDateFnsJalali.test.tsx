import { expect } from 'chai';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeJalaliAdapter,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { enUS } from 'date-fns/locale';
import faIR from 'date-fns-jalali/locale/fa-IR';
import faJalaliIR from 'date-fns-jalali/locale/fa-jalali-IR';
import { AdapterFormats } from '@mui/x-date-pickers/models';

describe('<AdapterDateFnsJalali />', () => {
  describeJalaliAdapter(AdapterDateFnsJalali, {});

  describe('Adapter localization', () => {
    it('getCurrentLocaleCode: should return locale code', () => {
      const adapter = new AdapterDateFnsJalali({ locale: enUS });

      expect(adapter.getCurrentLocaleCode()).to.equal('en-US');
    });

    it('Formatting', () => {
      const adapter = new AdapterDateFnsJalali();

      const expectDate = (format: keyof AdapterFormats, expectedWithFaIR: string) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z') as Date;

        expect(adapter.format(date, format)).to.equal(expectedWithFaIR);
      };

      expectDate('fullDate', '12-ام بهمن 1398');
      expectDate('keyboardDate', '1398/11/12');
      expectDate('keyboardDateTime', '1398/11/12 11:44 ب.ظ.');
      expectDate('keyboardDateTime12h', '1398/11/12 11:44 ب.ظ.');
      expectDate('keyboardDateTime24h', '1398/11/12 23:44');
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      enUS: {
        placeholder: 'MM/DD/YYYY hh:mm aa',
        value: '02/25/1397 09:35 AM',
      },
      faIR: {
        placeholder: 'YYYY/MM/DD hh:mm aa',
        value: '1397/02/25 09:35 ق.ظ.',
      },
      faJalaliIR: {
        // Not sure about what's the difference between this and fa-IR
        placeholder: 'YYYY/MM/DD hh:mm aa',
        value: '1397/02/25 09:35 ق.ظ.',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = {
        faIR,
        faJalaliIR,
        enUS,
      }[localeKey];

      describe(`test with the "${localeKey}" locale`, () => {
        const { render, adapter, clock } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'date-fns-jalali',
          locale: localeObject,
        });

        const { renderWithProps } = buildFieldInteractions({
          render,
          clock,
          Component: DateTimeField,
        });

        it('should have correct placeholder', () => {
          const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

          expectFieldValueV7(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
        });

        it('should have well formatted value', () => {
          const view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            value: adapter.date(testDate),
          });

          expectFieldValueV7(view.getSectionsContainer(), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
