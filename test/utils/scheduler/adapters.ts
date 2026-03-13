import { fr } from 'date-fns/locale/fr';
import { UnstableTemporalAdapterDateFns } from '@mui/x-scheduler-headless/base-ui-copy/temporal-adapter-date-fns';
import type { DateLocale } from '@mui/x-scheduler-headless/use-adapter';

// TODO: Replace with Base UI adapter when available.
export const adapter = new UnstableTemporalAdapterDateFns();

export const adapterFr = new UnstableTemporalAdapterDateFns({ locale: fr });

export const dateLocaleFr: DateLocale = fr;
