import LocalisationTable from 'docs/src/modules/components/LocalizationTable';
import data from '../../data.json';

export default function DataGridLocalisationTableNoSnap() {
  return (
    // @focus @padding 2
    <LocalisationTable data={data} />
  );
}
