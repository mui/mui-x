import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/chat/chat-message-sources/chat-message-sources.json';
import jsonPageContent from './chat-message-sources.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
