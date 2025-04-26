import * as React from 'react';
import LocalizationTable from 'docsx/src/modules/components/LocalizationTable';
import data from './data.json';

export default function ChartsLocalizationTableNoSnap() {
  return <LocalizationTable data={data} />;
}
