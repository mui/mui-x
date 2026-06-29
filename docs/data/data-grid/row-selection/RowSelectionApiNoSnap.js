import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-row-selection-api.json';
import proApi from 'docs/pages/x/api/data-grid/grid-row-multi-selection-api.json';

export default function RowSelectionApiNoSnap() {
  return <ApiDocs api={api} proApi={proApi} />;
}
