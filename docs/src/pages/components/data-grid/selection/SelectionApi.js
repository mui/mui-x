import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from '../../../../../pages/api-docs/data-grid/grid-selection-api.json';

export default function SelectionApi() {
  return <ApiDocs api={api} />;
}
