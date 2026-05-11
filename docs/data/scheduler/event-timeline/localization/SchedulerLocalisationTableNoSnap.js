import LocalisationTable from 'docs/src/modules/components/LocalizationTable';
import data from '../../localization/data.json';

export default function SchedulerLocalisationTableNoSnap() {
  return <LocalisationTable data={data} />;
}
