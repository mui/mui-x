import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-row-grouping-api.json';

export default function RowGroupingApiNoSnap() {
  return <ApiDocs api={api} />;
}
