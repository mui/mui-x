import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-column-pinning-api.json';

export default function ColumnPinningApiNoSnap() {
  return <ApiDocs api={api} />;
}
