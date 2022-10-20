import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-row-selection-api.json';
import proApi from 'docsx/pages/x/api/data-grid/grid-multi-selection-api.json';

export default function SelectionApiNoSnap() {
  return <ApiDocs api={api} proApi={proApi} />;
}
