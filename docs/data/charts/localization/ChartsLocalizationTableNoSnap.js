import * as React from 'react';
import LocalisationTable from 'docsx/src/modules/components/LocalizationTable';
import data from './data.json';

export default function ChartsLocalizationTableNoSnap() {
  return <LocalisationTable data={data} />;
}
