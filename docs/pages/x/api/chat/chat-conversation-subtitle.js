import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/chat/chat-conversation-subtitle/chat-conversation-subtitle.json';
import jsonPageContent from './chat-conversation-subtitle.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
