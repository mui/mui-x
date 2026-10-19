import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-filter-api.json';

export default function FilterApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
