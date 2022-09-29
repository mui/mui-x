import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-csv-export-api.json';

export default function CsvExportApiNoSnap() {
  return <ApiDocs api={api} />;
}
