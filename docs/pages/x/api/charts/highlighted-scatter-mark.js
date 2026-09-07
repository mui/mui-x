import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/charts/highlighted-scatter-mark/highlighted-scatter-mark.json';
import jsonPageContent from './highlighted-scatter-mark.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
