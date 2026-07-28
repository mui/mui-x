import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import descriptions from 'docs/translations/api-docs/data-grid/toolbar-button/toolbar-button.json';
import jsonPageContent from './toolbar-button.json';

export default function Page() {
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}
