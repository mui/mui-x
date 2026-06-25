import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/date-pickers/time-range-picker-toolbar/time-range-picker-toolbar.json';
import jsonPageContent from './time-range-picker-toolbar.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
