import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/charts/charts-geo-data-provider-premium/charts-geo-data-provider-premium.json';
import jsonPageContent from './charts-geo-data-provider-premium.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
