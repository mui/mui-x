import * as React from 'react';
import { expect } from 'chai';
import { screen, createRenderer } from '@mui/internal-test-utils';
import { DateCalendar, dayCalendarClasses } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createPickerRenderer, AdapterName, availableAdapters } from 'test/utils/pickers';
import { he, fr } from 'date-fns/locale';
import 'dayjs/locale/he';
import 'dayjs/locale/fr';
import 'moment/locale/he';
import 'moment/locale/fr';

const ADAPTERS_TO_USE: AdapterName[] = ['date-fns', 'dayjs', 'luxon', 'moment'];

describe('<DateCalendar /> - localization', () => {
  ADAPTERS_TO_USE.forEach((adapterName) => {
    describe(`with '${adapterName}'`, () => {
      const { render } = createPickerRenderer({
        locale: adapterName === 'date-fns' ? he : { code: 'he' },
        adapterName,
      });

      it('should display correct week day labels in Hebrew locale ', () => {
        render(<DateCalendar />);

        expect(screen.getByText('א')).toBeVisible();
      });

      describe('without wrapper', () => {
        const { render: renderWithoutWrapper } = createRenderer();

        it('should correctly switch between locale with week starting in Monday and week starting in Sunday', () => {
          const { setProps } = renderWithoutWrapper(
            <LocalizationProvider dateAdapter={availableAdapters[adapterName]}>
              <DateCalendar reduceAnimations />
            </LocalizationProvider>,
          );

          expect(document.querySelector(`.${dayCalendarClasses.weekDayLabel}`)!.ariaLabel).to.equal(
            'Sunday',
          );

          setProps({
            adapterLocale: adapterName === 'date-fns' ? fr : 'fr',
          });

          expect(document.querySelector(`.${dayCalendarClasses.weekDayLabel}`)!.ariaLabel).to.equal(
            'lundi',
          );
        });
      });
    });
  });
});
