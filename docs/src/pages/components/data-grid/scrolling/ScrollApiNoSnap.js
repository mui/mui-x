import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-scroll-api.json';

export default function ScrollApiNoSnap() {
  return <ApiDocs api={api} />;
}
