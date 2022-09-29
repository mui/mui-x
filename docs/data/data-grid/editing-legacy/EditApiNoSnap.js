import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-old-editing-api.json';

export default function EditApiNoSnap() {
  return <ApiDocs api={api} />;
}
