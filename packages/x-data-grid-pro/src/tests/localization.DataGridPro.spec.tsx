import type { ukUA } from '@mui/x-data-grid-pro/locales';
// @ts-expect-error Locales must be imported from the locales entry point, not the package root.
import { enUS } from '@mui/x-data-grid-pro';
import type { Expect, Equal } from 'test/utils/typeUtils';
import type { Localization } from '@mui/x-data-grid/internals';

type Tests = [Expect<Equal<typeof ukUA, Localization>>];
