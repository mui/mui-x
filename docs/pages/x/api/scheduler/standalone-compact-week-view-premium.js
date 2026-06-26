import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/scheduler/standalone-compact-week-view-premium/standalone-compact-week-view-premium.json';
import jsonPageContent from './standalone-compact-week-view-premium.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
