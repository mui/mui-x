import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/charts/charts-zoom-slider/charts-zoom-slider.json';
import jsonPageContent from './charts-zoom-slider.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
