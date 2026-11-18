import { describe, it, expect } from 'vitest';
import { esES } from './esES';
import { caES } from './caES';
import { itIT } from './itIT';
import { nlNL } from './nlNL';
import { frFR } from './frFR';
import { isIS } from './isIS';
import { roRO } from './roRO';
import { mk } from './mk';
import { beBY } from './beBY';
import { ruRU } from './ruRU';
import { ukUA } from './ukUA';
import { csCZ } from './csCZ';
import { skSK } from './skSK';
import { plPL } from './plPL';
import type { PickersLocaleText } from './utils/pickersLocaleTextApi';

// Each locale is tested with the same counts to cover the plural forms
// that only show up at specific boundaries: 0, teens (11-12) and 20+ (21-22).
const COUNTS = [0, 1, 2, 5, 11, 12, 21, 22];

const getLocaleText = (localization: {
  components: {
    MuiLocalizationProvider: { defaultProps: { localeText: Partial<PickersLocaleText> } };
  };
}) => localization.components.MuiLocalizationProvider.defaultProps.localeText;

interface LocaleCase {
  name: string;
  localeText: Partial<PickersLocaleText>;
  hours: Record<number, string>;
  minutes: Record<number, string>;
}

const cases: LocaleCase[] = [
  {
    name: 'esES',
    localeText: getLocaleText(esES),
    hours: {
      0: '0 horas',
      1: '1 hora',
      2: '2 horas',
      5: '5 horas',
      11: '11 horas',
      12: '12 horas',
      21: '21 horas',
      22: '22 horas',
    },
    minutes: {
      0: '0 minutos',
      1: '1 minuto',
      2: '2 minutos',
      5: '5 minutos',
      11: '11 minutos',
      12: '12 minutos',
      21: '21 minutos',
      22: '22 minutos',
    },
  },
  {
    name: 'caES',
    localeText: getLocaleText(caES),
    hours: {
      0: '0 hores',
      1: '1 hora',
      2: '2 hores',
      5: '5 hores',
      11: '11 hores',
      12: '12 hores',
      21: '21 hores',
      22: '22 hores',
    },
    minutes: {
      0: '0 minuts',
      1: '1 minut',
      2: '2 minuts',
      5: '5 minuts',
      11: '11 minuts',
      12: '12 minuts',
      21: '21 minuts',
      22: '22 minuts',
    },
  },
  {
    name: 'itIT',
    localeText: getLocaleText(itIT),
    hours: {
      0: '0 ore',
      1: '1 ora',
      2: '2 ore',
      5: '5 ore',
      11: '11 ore',
      12: '12 ore',
      21: '21 ore',
      22: '22 ore',
    },
    minutes: {
      0: '0 minuti',
      1: '1 minuto',
      2: '2 minuti',
      5: '5 minuti',
      11: '11 minuti',
      12: '12 minuti',
      21: '21 minuti',
      22: '22 minuti',
    },
  },
  {
    name: 'nlNL',
    localeText: getLocaleText(nlNL),
    hours: {
      0: '0 uren',
      1: '1 uur',
      2: '2 uren',
      5: '5 uren',
      11: '11 uren',
      12: '12 uren',
      21: '21 uren',
      22: '22 uren',
    },
    minutes: {
      0: '0 minuten',
      1: '1 minuut',
      2: '2 minuten',
      5: '5 minuten',
      11: '11 minuten',
      12: '12 minuten',
      21: '21 minuten',
      22: '22 minuten',
    },
  },
  {
    // French treats 0 as singular, unlike the other Romance locales above.
    name: 'frFR',
    localeText: getLocaleText(frFR),
    hours: {
      0: '0 heure',
      1: '1 heure',
      2: '2 heures',
      5: '5 heures',
      11: '11 heures',
      12: '12 heures',
      21: '21 heures',
      22: '22 heures',
    },
    minutes: {
      0: '0 minute',
      1: '1 minute',
      2: '2 minutes',
      5: '5 minutes',
      11: '11 minutes',
      12: '12 minutes',
      21: '21 minutes',
      22: '22 minutes',
    },
  },
  {
    // Icelandic uses the singular for counts ending in 1, except those ending in 11.
    name: 'isIS',
    localeText: getLocaleText(isIS),
    hours: {
      0: '0 klukkustundir',
      1: '1 klukkustund',
      2: '2 klukkustundir',
      5: '5 klukkustundir',
      11: '11 klukkustundir',
      12: '12 klukkustundir',
      21: '21 klukkustund',
      22: '22 klukkustundir',
    },
    minutes: {
      0: '0 mínútur',
      1: '1 mínúta',
      2: '2 mínútur',
      5: '5 mínútur',
      11: '11 mínútur',
      12: '12 mínútur',
      21: '21 mínúta',
      22: '22 mínútur',
    },
  },
  {
    // Romanian inserts "de" before the plural noun for counts of 20 and above.
    name: 'roRO',
    localeText: getLocaleText(roRO),
    hours: {
      0: '0 Ore',
      1: '1 Oră',
      2: '2 Ore',
      5: '5 Ore',
      11: '11 Ore',
      12: '12 Ore',
      21: '21 de Ore',
      22: '22 de Ore',
    },
    minutes: {
      0: '0 Minute',
      1: '1 Minut',
      2: '2 Minute',
      5: '5 Minute',
      11: '11 Minute',
      12: '12 Minute',
      21: '21 de Minute',
      22: '22 de Minute',
    },
  },
  {
    // Macedonian uses the same "ends in 1, except 11" exception as Icelandic.
    name: 'mk',
    localeText: getLocaleText(mk),
    hours: {
      0: '0 часа',
      1: '1 час',
      2: '2 часа',
      5: '5 часа',
      11: '11 часа',
      12: '12 часа',
      21: '21 час',
      22: '22 часа',
    },
    minutes: {
      0: '0 минути',
      1: '1 минута',
      2: '2 минути',
      5: '5 минути',
      11: '11 минути',
      12: '12 минути',
      21: '21 минута',
      22: '22 минути',
    },
  },
  {
    // East Slavic locales (beBY, ruRU, ukUA) share the one/few/many pattern below,
    // selected by the last digit and last two digits of the count.
    name: 'beBY',
    localeText: getLocaleText(beBY),
    hours: {
      0: '0 гадзін',
      1: '1 гадзіна',
      2: '2 гадзіны',
      5: '5 гадзін',
      11: '11 гадзін',
      12: '12 гадзін',
      21: '21 гадзіна',
      22: '22 гадзіны',
    },
    minutes: {
      0: '0 хвілін',
      1: '1 хвіліна',
      2: '2 хвіліны',
      5: '5 хвілін',
      11: '11 хвілін',
      12: '12 хвілін',
      21: '21 хвіліна',
      22: '22 хвіліны',
    },
  },
  {
    name: 'ruRU',
    localeText: getLocaleText(ruRU),
    hours: {
      0: '0 часов',
      1: '1 час',
      2: '2 часа',
      5: '5 часов',
      11: '11 часов',
      12: '12 часов',
      21: '21 час',
      22: '22 часа',
    },
    minutes: {
      0: '0 минут',
      1: '1 минута',
      2: '2 минуты',
      5: '5 минут',
      11: '11 минут',
      12: '12 минут',
      21: '21 минута',
      22: '22 минуты',
    },
  },
  {
    name: 'ukUA',
    localeText: getLocaleText(ukUA),
    hours: {
      0: '0 годин',
      1: '1 година',
      2: '2 години',
      5: '5 годин',
      11: '11 годин',
      12: '12 годин',
      21: '21 година',
      22: '22 години',
    },
    minutes: {
      0: '0 хвилин',
      1: '1 хвилина',
      2: '2 хвилини',
      5: '5 хвилин',
      11: '11 хвилин',
      12: '12 хвилин',
      21: '21 хвилина',
      22: '22 хвилини',
    },
  },
  {
    // Czech and Slovak share a simpler 1 / 2-4 / 5+ pattern, with no exception for the teens.
    name: 'csCZ',
    localeText: getLocaleText(csCZ),
    hours: {
      0: '0 hodin',
      1: '1 hodina',
      2: '2 hodiny',
      5: '5 hodin',
      11: '11 hodin',
      12: '12 hodin',
      21: '21 hodin',
      22: '22 hodin',
    },
    minutes: {
      0: '0 minut',
      1: '1 minuta',
      2: '2 minuty',
      5: '5 minut',
      11: '11 minut',
      12: '12 minut',
      21: '21 minut',
      22: '22 minut',
    },
  },
  {
    name: 'skSK',
    localeText: getLocaleText(skSK),
    hours: {
      0: '0 hodín',
      1: '1 hodina',
      2: '2 hodiny',
      5: '5 hodín',
      11: '11 hodín',
      12: '12 hodín',
      21: '21 hodín',
      22: '22 hodín',
    },
    minutes: {
      0: '0 minút',
      1: '1 minúta',
      2: '2 minúty',
      5: '5 minút',
      11: '11 minút',
      12: '12 minút',
      21: '21 minút',
      22: '22 minút',
    },
  },
  {
    // Polish excludes the teens (12-14) from the "few" form.
    name: 'plPL',
    localeText: getLocaleText(plPL),
    hours: {
      0: '0 godzin',
      1: '1 godzina',
      2: '2 godziny',
      5: '5 godzin',
      11: '11 godzin',
      12: '12 godzin',
      21: '21 godzin',
      22: '22 godziny',
    },
    minutes: {
      0: '0 minut',
      1: '1 minuta',
      2: '2 minuty',
      5: '5 minut',
      11: '11 minut',
      12: '12 minut',
      21: '21 minut',
      22: '22 minuty',
    },
  },
];

describe('locales: clock number pluralization', () => {
  cases.forEach(({ name, localeText, hours, minutes }) => {
    describe(`${name}`, () => {
      COUNTS.forEach((count) => {
        it(`hoursClockNumberText(${count})`, () => {
          expect(localeText.hoursClockNumberText!(String(count))).to.equal(hours[count]);
        });

        it(`minutesClockNumberText(${count})`, () => {
          expect(localeText.minutesClockNumberText!(String(count))).to.equal(minutes[count]);
        });
      });
    });
  });
});
