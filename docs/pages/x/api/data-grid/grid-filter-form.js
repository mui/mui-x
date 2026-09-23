import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import descriptions from 'docs/translations/api-docs/data-grid/grid-filter-form/grid-filter-form.json';
import jsonPageContent from './grid-filter-form.json';

export default function Page() {
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}
