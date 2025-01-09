import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { describeGregorianAdapter } from 'test/utils/pickers/describeGregorianAdapter';
import { fr } from 'date-fns/locale';

describe('<AdapterDateFnsV2 />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });
});
