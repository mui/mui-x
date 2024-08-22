import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { createPickerRenderer, AdapterName } from 'test/utils/pickers';
import { he } from 'date-fns/locale';
import 'dayjs/locale/he';
import 'moment/locale/he';

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
    });
  });
});
