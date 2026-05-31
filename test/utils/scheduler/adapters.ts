import { arSA } from 'date-fns/locale/ar-SA';
import { faIR } from 'date-fns/locale/fa-IR';
import { fr } from 'date-fns/locale/fr';
import { he } from 'date-fns/locale/he';
import { enUS } from 'date-fns/locale/en-US';
import { UnstableTemporalAdapterDateFns } from '@mui/x-scheduler-internals/base-ui-copy/temporal-adapter-date-fns';
import type { DateLocale } from '@mui/x-scheduler-internals/use-adapter';

// TODO: Replace with Base UI adapter when available.
export const adapter = new UnstableTemporalAdapterDateFns();

export const adapterFr = new UnstableTemporalAdapterDateFns({ locale: fr });

export const adapterArSA = new UnstableTemporalAdapterDateFns({ locale: arSA });

export const adapterFaIR = new UnstableTemporalAdapterDateFns({ locale: faIR });

export const adapterHe = new UnstableTemporalAdapterDateFns({ locale: he });

export const adapterUnknownLocale = new UnstableTemporalAdapterDateFns({
  locale: { ...enUS, code: undefined } as any,
});

export const dateLocaleFr: DateLocale = fr;
