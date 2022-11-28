import * as React from 'react';
import LocalisationTable from 'docsx/src/modules/components/LocalizationTable';
import data from './data.json';

function DataGridLocalisationTableNoSnap() {
  return <LocalisationTable data={data} />;
}

export default DataGridLocalisationTableNoSnap;
