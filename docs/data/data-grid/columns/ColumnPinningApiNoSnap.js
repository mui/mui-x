import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-column-pinning-api.json';

export default function ColumnPinningApiNoSnap() {
  return <ApiDocs api={api} />;
}
