import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/tree-view/tree-item-drag-and-drop-overlay/tree-item-drag-and-drop-overlay.json';
import jsonPageContent from './tree-item-drag-and-drop-overlay.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
