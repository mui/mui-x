import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatDateDivider, ChatMessage } from '@mui/x-chat';

import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import {
  ChoiceControl,
  DividerLabel,
  SelectControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';
import { users } from 'docs/src/modules/components/chat-playground/data';

const conversation = {
  id: 'date-playground',
  title: 'Date divider',
  participants: [users.me, users.assistant],
};

const NOW = new Date('2026-05-03T09:00:00.000Z');

function makeMessage(id, day) {
  const created = new Date(NOW);
  if (day === 'yesterday') {
    created.setUTCDate(NOW.getUTCDate() - 1);
  }
  if (day === 'lastWeek') {
    created.setUTCDate(NOW.getUTCDate() - 7);
  }
  if (day === 'lastYear') {
    created.setUTCFullYear(NOW.getUTCFullYear() - 1);
  }
  return {
    id,
    conversationId: conversation.id,
    role: 'assistant',
    author: users.assistant,
    createdAt: created.toISOString(),
    status: 'read',
    parts: [{ type: 'text', text: `Sent ${day}` }],
  };
}

function relativeFormat(date) {
  const diffMs =
    Date.UTC(NOW.getUTCFullYear(), NOW.getUTCMonth(), NOW.getUTCDate()) -
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days === 0) {
    return 'today';
  }
  if (days === 1) {
    return 'yesterday';
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  if (days < 365) {
    return `${Math.floor(days / 7)} weeks ago`;
  }
  return `${Math.floor(days / 365)} year(s) ago`;
}

const FORMATTERS = {
  default: undefined,
  iso: (date) => date.toISOString().slice(0, 10),
  relative: relativeFormat,
};

const CLASS_DEFS = [
  {
    name: 'dateDivider',
    selector: '.MuiChatMessage-dateDivider',
    description: 'The date divider element.',
  },
  {
    name: 'dateDividerLine',
    selector: '.MuiChatMessage-dateDividerLine',
    description: 'The horizontal rule on each side of the label.',
  },
  {
    name: 'dateDividerLabel',
    selector: '.MuiChatMessage-dateDividerLabel',
    description: 'The formatted day label.',
  },
];

export default function ChatDateDividerPlayground() {
  const [day, setDay] = React.useState('today');
  const [format, setFormat] = React.useState('default');
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  // ChatDateDivider only renders at a calendar boundary, so we seed a prior
  // message with an old `createdAt` to guarantee the boundary regardless of
  // the selected `day`.
  const messages = React.useMemo(() => {
    const prior = makeMessage('date-prior', 'lastYear');
    // For `lastYear`, pull the prior even further back so the boundary still triggers.
    if (day === 'lastYear') {
      prior.createdAt = new Date(
        Date.UTC(NOW.getUTCFullYear() - 2, NOW.getUTCMonth(), NOW.getUTCDate()),
      ).toISOString();
    }
    return [prior, makeMessage('date-target', day)];
  }, [day]);
  const items = React.useMemo(() => messages.map((m) => m.id), [messages]);

  const dividerSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatDateDivider"
      description="Day separator between message clusters — uses caption + divider tokens."
      previewMinHeight={220}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SelectControl
            label="formatDate"
            value={format}
            options={[
              { value: 'default', label: 'default (locale)' },
              { value: 'iso', label: 'ISO (YYYY-MM-DD)' },
              { value: 'relative', label: 'relative (n days ago)' },
            ]}
            onChange={setFormat}
            helperText="Custom formatter for the divider label."
          />
          <DividerLabel>fixture (message data)</DividerLabel>
          <ChoiceControl
            label="day"
            value={day}
            options={['today', 'yesterday', 'lastWeek', 'lastYear']}
            onChange={setDay}
            helperText="createdAt of the second message — drives the boundary."
          />
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 420,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <ChatMessage messageId="date-prior" />
            <ChatDateDivider
              messageId="date-target"
              index={1}
              items={items}
              formatDate={FORMATTERS[format]}
              sx={dividerSx}
            />
            <ChatMessage messageId="date-target" />
          </Box>
        </ScopedChat>
      }
    />
  );
}
