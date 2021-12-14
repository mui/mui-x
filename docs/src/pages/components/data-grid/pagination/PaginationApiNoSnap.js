import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-pagination-api.json';

export default function PaginationApiNoSnap() {
  return <ApiDocs api={api} />;
}
