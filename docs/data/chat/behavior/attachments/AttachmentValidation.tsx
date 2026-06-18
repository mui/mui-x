'use client';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import { ChatBox } from '@mui/x-chat';
import type { ChatAttachmentRejection } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const REASON_LABELS: Record<ChatAttachmentRejection['reason'], string> = {
  'mime-type': 'file type not accepted (images and PDF only)',
  'file-size': 'larger than 500 KB',
  'file-count': 'more than 3 files per message',
};

export default function AttachmentValidation() {
  const [rejections, setRejections] = React.useState<ChatAttachmentRejection[]>([]);

  return (
    <div style={{ width: '100%' }}>
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        features={{
          attachments: {
            acceptedMimeTypes: ['image/*', 'application/pdf'],
            maxFileCount: 3,
            maxFileSize: 500 * 1024,
            onAttachmentReject: setRejections,
          },
        }}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      {rejections.length > 0 && (
        <Alert severity="error" onClose={() => setRejections([])} sx={{ mt: 1 }}>
          {rejections.map(({ file, reason }) => (
            <div key={`${file.name}-${reason}`}>
              {file.name} — {REASON_LABELS[reason]}
            </div>
          ))}
        </Alert>
      )}
    </div>
  );
}
