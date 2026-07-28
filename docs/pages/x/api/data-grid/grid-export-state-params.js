import * as React from 'react';
import InterfaceApiPage from 'docs/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import descriptions from 'docs/translations/api-docs/data-grid/grid-export-state-params.json';
import jsonPageContent from './grid-export-state-params.json';

export default function Page() {
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />
  );
}
