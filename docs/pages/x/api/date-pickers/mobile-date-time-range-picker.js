import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/date-pickers/mobile-date-time-range-picker/mobile-date-time-range-picker.json';
import jsonPageContent from './mobile-date-time-range-picker.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
