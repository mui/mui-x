import ApiDocs from 'docs/src/modules/components/ApiDocs';
import premiumApi from 'docs/pages/x/api/data-grid/grid-cell-selection-api.json';

export default function CellSelectionApiNoSnap() {
  return (
    // @focus @padding 2
    <ApiDocs premiumApi={premiumApi} />
  );
}
