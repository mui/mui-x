import * as React from 'react';
import InterfaceApiPage from 'docs/src/modules/components/InterfaceApiPage';
import layoutConfig from 'docs/src/modules/utils/dataGridLayoutConfig';
import descriptions from 'docs/translations/api-docs/data-grid/grid-filter-operator.json';
import jsonPageContent from './grid-filter-operator.json';

export default function Page() {
  return (
    <InterfaceApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />
  );
}
