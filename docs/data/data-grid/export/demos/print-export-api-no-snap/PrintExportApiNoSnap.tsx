import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-print-export-api.json';

export default function PrintExportApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
