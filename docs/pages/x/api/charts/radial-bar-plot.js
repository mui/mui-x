import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/charts/radial-bar-plot/radial-bar-plot.json';
import jsonPageContent from './radial-bar-plot.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
