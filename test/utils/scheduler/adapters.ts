import { fr } from 'date-fns/locale/fr';
import { pl } from 'date-fns/locale/pl';
import { cs } from 'date-fns/locale/cs';
import { UnstableTemporalAdapterDateFns } from '@mui/x-scheduler-internals/base-ui-copy/temporal-adapter-date-fns';
import type { DateLocale } from '@mui/x-scheduler-internals/use-adapter';

// TODO: Replace with Base UI adapter when available.
export const adapter = new UnstableTemporalAdapterDateFns();

export const adapterFr = new UnstableTemporalAdapterDateFns({ locale: fr });

export const adapterPl = new UnstableTemporalAdapterDateFns({ locale: pl });

export const adapterCs = new UnstableTemporalAdapterDateFns({ locale: cs });

export const dateLocaleFr: DateLocale = fr;

export const dateLocalePl: DateLocale = pl;
