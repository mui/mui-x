import * as React from 'react';
import { ApiPage } from '@mui/internal-core-docs/ApiPage';
import descriptions from 'docs/translations/api-docs/chat/chat-composer-helper-text/chat-composer-helper-text.json';
import jsonPageContent from './chat-composer-helper-text.json';

export default function Page() {
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}
