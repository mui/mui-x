import * as React from 'react';
import LocalisationTable from 'docsx/src/modules/components/LocalizationTable';
import data from './data.json';

function DataGridLocalisationTable() {
  return <LocalisationTable data={data} />;
}

export default DataGridLocalisationTable;
