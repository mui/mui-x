import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/charts/radial-line-highlight-plot/radial-line-highlight-plot.json';
import jsonPageContent from './radial-line-highlight-plot.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
