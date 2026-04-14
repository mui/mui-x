import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesLocalizationProvider = createTypes(import.meta.url, LocalizationProvider);
