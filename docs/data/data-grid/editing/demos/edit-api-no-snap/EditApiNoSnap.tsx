import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-editing-api.json';

export default function EditApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
