import ApiDocs from 'docs/src/modules/components/ApiDocs';
import premiumApi from 'docs/pages/x/api/data-grid/grid-computed-columns-api.json';

export default function ComputedColumnsApiNoSnap() {
  return <ApiDocs premiumApi={premiumApi} />;
}
