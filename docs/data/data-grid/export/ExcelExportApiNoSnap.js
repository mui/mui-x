import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-excel-export-api.json';

export default function ExcelExportApiNoSnap() {
  return <ApiDocs api={api} />;
}
