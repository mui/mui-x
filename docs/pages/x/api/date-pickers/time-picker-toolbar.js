import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/date-pickers/time-picker-toolbar/time-picker-toolbar.json';
import jsonPageContent from './time-picker-toolbar.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
