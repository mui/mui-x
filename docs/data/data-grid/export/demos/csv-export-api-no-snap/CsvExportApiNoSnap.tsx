import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-csv-export-api.json';

export default function CsvExportApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
