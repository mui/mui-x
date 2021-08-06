import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-virtualization-api.json';

export default function VirtualizationApiNoSnap() {
  return <ApiDocs api={api} />;
}
