import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import premiumApi from 'docsx/pages/x/api/data-grid/grid-cell-selection-api.json';

export default function CellSelectionApiNoSnap() {
  return <ApiDocs premiumApi={premiumApi} />;
}
