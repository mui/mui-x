import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-sort-api.json';

export default function SortingApiNoSnap() {
  return <ApiDocs api={api} />;
}
