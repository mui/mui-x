import React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/api-docs/data-grid/grid-grouping-columns-api.json';

export default function GroupingColumnsApiNoSnap() {
  return <ApiDocs api={api} />;
}
