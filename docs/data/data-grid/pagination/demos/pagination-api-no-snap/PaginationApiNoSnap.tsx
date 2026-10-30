import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-pagination-api.json';

export default function PaginationApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
