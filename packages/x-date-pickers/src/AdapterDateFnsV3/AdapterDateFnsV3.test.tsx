import { unstable_AdapterDateFnsV3 as AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { describeGregorianAdapter } from 'test/utils/pickers/describeGregorianAdapter';
import { fr } from 'date-fns/locale';

describe('<AdapterDateFnsV3 />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });
});
