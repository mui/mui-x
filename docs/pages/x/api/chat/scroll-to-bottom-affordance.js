import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/chat/scroll-to-bottom-affordance/scroll-to-bottom-affordance.json';
import jsonPageContent from './scroll-to-bottom-affordance.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
