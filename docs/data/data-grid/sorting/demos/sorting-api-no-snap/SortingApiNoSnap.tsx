import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-sort-api.json';

export default function SortingApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
