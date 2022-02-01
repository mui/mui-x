import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-edit-row-api.json';

export default function EditApiNoSnap() {
  return <ApiDocs api={api} />;
}
