import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-detail-panel-api.json';

export default function DetailPanelApiNoSnap() {
  return <ApiDocs api={api} />;
}
