import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-column-pinning-api.json';

export default function ColumnPinningApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs proApi={api} />
  );
}
