import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-column-pinning-api.json';

export default function ColumnPinningApiNoSnap() {
  return <ApiDocs proApi={api} />;
}
