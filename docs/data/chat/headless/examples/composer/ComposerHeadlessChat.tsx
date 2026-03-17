import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatComposer,
  useChatStore,
  type ChatAdapter,
} from '@mui/x-chat-headless';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import {
  DemoButton,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
  DemoTextarea,
} from '../shared/DemoPrimitives';

const adapter: ChatAdapter = {
  async sendMessage({ message: _message }) {
    return createChunkStream(
      createTextResponseChunks(
        `composer-${Date.now()}`,
        'The composer demo covers attachments, preview URLs, and IME-safe submit behavior.',
      ),
      { delayMs: 180 },
    );
  },
};

function ComposerInner() {
  const { messages } = useChat();
  const composer = useChatComposer();
  const store = useChatStore();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Composer recipe</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              This uses <code>useChatComposer()</code> with plain DOM controls.
            </p>
            <DemoButton onClick={() => inputRef.current?.click()}>
              Attach files
            </DemoButton>
            <input
              hidden
              multiple
              ref={inputRef}
              type="file"
              onChange={(event) => {
                Array.from(event.target.files ?? []).forEach((file) =>
                  composer.addAttachment(file),
                );
                event.target.value = '';
              }}
            />
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Composer with attachments"
          description="Press Enter to submit, Shift+Enter for a newline, and use composition events to guard IME input."
          actions={
            <span>
              {composer.isSubmitting
                ? 'Submitting…'
                : `${composer.attachments.length} attachment(s)`}
            </span>
          }
        />
        <DemoMessageList
          messages={messages}
          emptyLabel="Use the composer to create the first message."
        />
        {composer.attachments.length > 0 ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {composer.attachments.map((attachment) => (
              <div
                key={attachment.localId}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  border: '1px solid #d7dee7',
                  borderRadius: 12,
                  padding: 10,
                  background: '#fff',
                }}
              >
                {attachment.previewUrl ? (
                  <img
                    src={attachment.previewUrl}
                    alt={attachment.file.name}
                    style={{
                      width: 44,
                      height: 44,
                      objectFit: 'cover',
                      borderRadius: 10,
                    }}
                  />
                ) : null}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{attachment.file.name}</div>
                  <div style={{ fontSize: 12, color: '#5c6b7c' }}>
                    {attachment.status}
                  </div>
                </div>
                <DemoButton
                  onClick={() => composer.removeAttachment(attachment.localId)}
                >
                  Remove
                </DemoButton>
              </div>
            ))}
          </div>
        ) : null}
        <DemoTextarea
          aria-label="Draft message"
          placeholder="Write a message. Use an IME or add images to see the completed composer behaviors."
          value={composer.value}
          onChange={(event) => composer.setValue(event.target.value)}
          onCompositionStart={() => store.setComposerIsComposing(true)}
          onCompositionEnd={() => store.setComposerIsComposing(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void composer.submit();
            }
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <DemoButton
            onClick={() => composer.clear()}
            disabled={composer.value === '' && composer.attachments.length === 0}
          >
            Clear
          </DemoButton>
          <DemoButton
            disabled={composer.isSubmitting || composer.value.trim() === ''}
            onClick={() => void composer.submit()}
          >
            Submit
          </DemoButton>
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function ComposerHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} defaultActiveConversationId="support">
      <ComposerInner />
    </ChatProvider>
  );
}
