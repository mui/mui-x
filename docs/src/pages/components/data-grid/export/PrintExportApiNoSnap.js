import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-print-export-api.json';

export default function PrintExportApiNoSnap() {
  return <ApiDocs api={api} />;
}
