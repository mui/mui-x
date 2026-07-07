import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/chat/chat-composer-attachment-list/chat-composer-attachment-list.json';
import jsonPageContent from './chat-composer-attachment-list.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
