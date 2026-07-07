import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/date-pickers/desktop-date-range-picker/desktop-date-range-picker.json';
import jsonPageContent from './desktop-date-range-picker.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
