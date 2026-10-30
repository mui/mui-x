import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-excel-export-api.json';

export default function ExcelExportApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs premiumApi={api} />
  );
}
