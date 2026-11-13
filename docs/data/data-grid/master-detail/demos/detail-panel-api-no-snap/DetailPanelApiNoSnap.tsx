import ApiDocs from 'docs/src/modules/components/ApiDocs';
import api from 'docs/pages/x/api/data-grid/grid-detail-panel-api.json';

export default function DetailPanelApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs proApi={api} />
  );
}
