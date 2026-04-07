import { fr } from 'date-fns/locale/fr';
import { TemporalAdapterDateFns } from '@base-ui/react/internals/temporal-adapter-date-fns';
import type { DateLocale } from '@mui/x-scheduler-headless/use-adapter';

export const adapter = new TemporalAdapterDateFns();

export const adapterFr = new TemporalAdapterDateFns({ locale: fr });

export const dateLocaleFr: DateLocale = fr;
