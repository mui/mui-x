import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import selectionApi from 'docsx/pages/x/api/data-grid/grid-selection-api.json';
import multiSelectionApi from 'docsx/pages/x/api/data-grid/grid-multi-selection-api.json';

export default function SelectionApiNoSnap() {
  return <ApiDocs api={selectionApi} proApi={multiSelectionApi} />;
}
