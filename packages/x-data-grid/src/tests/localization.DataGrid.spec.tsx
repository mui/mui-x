import { ukUA } from '@mui/x-data-grid/locales';
// @ts-expect-error
import { enUS } from '@mui/x-data-grid';
import type { Expect, Equal } from 'test/utils/typeUtils';
import type { Localization } from '@mui/x-data-grid/internals';

type Tests = [Expect<Equal<typeof ukUA, Localization>>];
