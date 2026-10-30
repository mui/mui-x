import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-scroll-api.json';

export default function ScrollApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs api={api} />
  );
}
