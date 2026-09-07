import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/chat/conversation-list-unread-badge/conversation-list-unread-badge.json';
import jsonPageContent from './conversation-list-unread-badge.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
