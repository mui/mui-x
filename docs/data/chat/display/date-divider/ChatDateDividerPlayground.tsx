import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatDateDivider } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import {
  ChoiceControl,
  DividerLabel,
  SelectControl,
} from '../../_playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from '../../_playground/useCustomizations';
import { users } from '../../_playground/data';

const conversation: ChatConversation = {
  id: 'date-playground',
  title: 'Date divider',
  participants: [users.me, users.assistant],
};

type Day = 'today' | 'yesterday' | 'lastWeek' | 'lastYear';

type FormatChoice = 'default' | 'iso' | 'relative';

const NOW = new Date('2026-05-03T09:00:00.000Z');

function makeMessage(id: string, day: Day): ChatMessage {
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

function relativeFormat(date: Date): React.ReactNode {
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

const FORMATTERS: Record<
  FormatChoice,
  ((date: Date) => React.ReactNode) | undefined
> = {
  default: undefined,
  iso: (date: Date) => date.toISOString().slice(0, 10),
  relative: relativeFormat,
};

type ClassKey = 'dateDivider';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
  {
    name: 'dateDivider',
    selector: '.MuiChatMessage-dateDivider',
    description: 'The date divider element.',
  },
];

export default function ChatDateDividerPlayground() {
  const [day, setDay] = React.useState<Day>('today');
  const [format, setFormat] = React.useState<FormatChoice>('default');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  // ChatDateDivider only renders at a calendar boundary, so we seed a prior
  // message with an old `createdAt` to guarantee the boundary regardless of
  // the selected `day`.
  const messages = React.useMemo<ChatMessage[]>(() => {
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
      previewMinHeight={140}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SelectControl<FormatChoice>
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
          <ChoiceControl<Day>
            label="day"
            value={day}
            options={['today', 'yesterday', 'lastWeek', 'lastYear'] as const}
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
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ChatDateDivider
              messageId="date-target"
              index={1}
              items={items}
              formatDate={FORMATTERS[format]}
              sx={dividerSx as any}
            />
          </Box>
        </ScopedChat>
      }
    />
  );
}
