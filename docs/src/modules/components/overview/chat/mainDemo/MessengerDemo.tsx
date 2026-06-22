'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { ChatBox, ChatConversationList } from '@mui/x-chat';
import type { ChatAdapter, ChatConversation, ChatMessage, ChatUser } from '@mui/x-chat/headless';
import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
  syncConversationPreview,
} from '../../../../../../data/chat/material/examples/shared/demoUtils';

// --- Avatar helper -----------------------------------------------------------

function createAvatarDataUrl(label: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// --- Users -------------------------------------------------------------------

const you: ChatUser = {
  id: 'you',
  displayName: 'You',
  avatarUrl: createAvatarDataUrl('Y', '#1976d2'),
  isOnline: true,
  role: 'user',
};

const alice: ChatUser = {
  id: 'alice',
  displayName: 'Alice Chen',
  avatarUrl: createAvatarDataUrl('A', '#0288d1'),
  isOnline: true,
  role: 'assistant',
};

const marco: ChatUser = {
  id: 'marco',
  displayName: 'Marco Diaz',
  avatarUrl: createAvatarDataUrl('M', '#388e3c'),
  isOnline: false,
  role: 'assistant',
};

const priya: ChatUser = {
  id: 'priya',
  displayName: 'Priya Singh',
  avatarUrl: createAvatarDataUrl('P', '#f57c00'),
  isOnline: true,
  role: 'assistant',
};

// --- Message factory ---------------------------------------------------------

function msg(
  conversationId: string,
  role: 'user' | 'assistant',
  author: ChatUser,
  text: string,
  createdAt: string,
): ChatMessage {
  return {
    id: randomId(),
    conversationId,
    role,
    status: 'sent',
    createdAt,
    author,
    parts: [{ type: 'text', text }],
  };
}

function msgWithFile(
  conversationId: string,
  role: 'user' | 'assistant',
  author: ChatUser,
  file: { url: string; mediaType: string; filename: string },
  caption: string | null,
  createdAt: string,
): ChatMessage {
  return {
    id: randomId(),
    conversationId,
    role,
    status: 'sent',
    createdAt,
    author,
    parts: [
      { type: 'file', mediaType: file.mediaType, url: file.url, filename: file.filename },
      ...(caption ? [{ type: 'text' as const, text: caption }] : []),
    ],
  };
}

// --- Conversation IDs --------------------------------------------------------

const aliceConvId = randomId();
const marcoConvId = randomId();
const groupConvId = randomId();
const MESSENGER_SIDEBAR_WIDTH = 320;

// --- Conversations -----------------------------------------------------------

const messengerConversations: ChatConversation[] = [
  {
    id: groupConvId,
    title: 'Weekend Hiking',
    subtitle: 'You: Yes! Charging it tonight 🔋',
    avatarUrl: createAvatarDataUrl('WH', '#2e7d32'),
    participants: [you, alice, marco, priya],
    readState: 'unread',
    unreadCount: 5,
    lastMessageAt: '2026-03-31T12:05:00.000Z',
  },
  {
    id: aliceConvId,
    title: 'Alice Chen',
    subtitle: 'Alice: See you Friday 🎶',
    participants: [you, alice],
    readState: 'unread',
    unreadCount: 3,
    lastMessageAt: '2026-03-31T10:02:00.000Z',
  },
  {
    id: marcoConvId,
    title: 'Marco Diaz',
    subtitle: 'Marco: Let me know when you start!',
    participants: [you, marco],
    readState: 'unread',
    unreadCount: 3,
    lastMessageAt: '2026-03-30T18:43:00.000Z',
  },
];

// --- Threads -----------------------------------------------------------------

const messengerThreads: Record<string, ChatMessage[]> = {
  // 1:1 with Alice — casual catch-up
  [aliceConvId]: [
    msg(
      aliceConvId,
      'assistant',
      alice,
      'Hey! Are you going to the concert on Friday?',
      '2026-03-31T09:10:00.000Z',
    ),
    msg(
      aliceConvId,
      'user',
      you,
      'Yes! I got tickets yesterday. Section B, row 12.',
      '2026-03-31T09:15:00.000Z',
    ),
    msg(
      aliceConvId,
      'assistant',
      alice,
      'Nice, we are in row 14! Want to grab dinner before?',
      '2026-03-31T09:20:00.000Z',
    ),
    msg(
      aliceConvId,
      'user',
      you,
      'Definitely. That Thai place near the venue?',
      '2026-03-31T09:30:00.000Z',
    ),
    msg(aliceConvId, 'assistant', alice, 'Sounds good, see you there!', '2026-03-31T09:45:00.000Z'),
    msgWithFile(
      aliceConvId,
      'assistant',
      alice,
      {
        url: 'https://picsum.photos/seed/concert-stage/800/500',
        mediaType: 'image/jpeg',
        filename: 'concert-stage.jpg',
      },
      'Look what the stage looked like last year 😍',
      '2026-03-31T09:50:00.000Z',
    ),
    msg(
      aliceConvId,
      'assistant',
      alice,
      'The light show was absolutely insane',
      '2026-03-31T09:51:00.000Z',
    ),
    msg(
      aliceConvId,
      'assistant',
      alice,
      'Front row energy the whole night',
      '2026-03-31T09:52:00.000Z',
    ),
    msg(aliceConvId, 'user', you, 'Wow, we are SO ready for this!', '2026-03-31T09:55:00.000Z'),
    msg(
      aliceConvId,
      'user',
      you,
      'Grabbing earplugs just in case haha',
      '2026-03-31T09:56:00.000Z',
    ),
    msg(aliceConvId, 'assistant', alice, 'See you Friday 🎶', '2026-03-31T10:02:00.000Z'),
  ],

  // 1:1 with Marco — book recommendation
  [marcoConvId]: [
    msg(
      marcoConvId,
      'user',
      you,
      'Any good book recs? I just finished Project Hail Mary.',
      '2026-03-30T17:00:00.000Z',
    ),
    msg(
      marcoConvId,
      'assistant',
      marco,
      "Oh nice, if you liked that you'd love Children of Time by Adrian Tchaikovsky.",
      '2026-03-30T17:15:00.000Z',
    ),
    msg(marcoConvId, 'user', you, "Added to my list! What's it about?", '2026-03-30T17:20:00.000Z'),
    msg(
      marcoConvId,
      'assistant',
      marco,
      "Humanity finds a terraformed planet, but evolution took an unexpected turn. It's wild.",
      '2026-03-30T18:30:00.000Z',
    ),
    msgWithFile(
      marcoConvId,
      'assistant',
      marco,
      {
        url: 'https://picsum.photos/seed/bookcover-cot/300/450',
        mediaType: 'image/jpeg',
        filename: 'children-of-time.jpg',
      },
      'Check out the cover art — won the Arthur C. Clarke Award',
      '2026-03-30T18:35:00.000Z',
    ),
    msg(
      marcoConvId,
      'assistant',
      marco,
      "There's also a sequel — Children of Memory",
      '2026-03-30T18:36:00.000Z',
    ),
    msg(
      marcoConvId,
      'assistant',
      marco,
      'Came out in 2023, just as good',
      '2026-03-30T18:37:00.000Z',
    ),
    msg(marcoConvId, 'user', you, 'Three books to read, haha', '2026-03-30T18:40:00.000Z'),
    msg(
      marcoConvId,
      'user',
      you,
      'Worth it though, adding them all to my list',
      '2026-03-30T18:41:00.000Z',
    ),
    msg(marcoConvId, 'assistant', marco, 'Worth every page, trust me!', '2026-03-30T18:42:00.000Z'),
    msg(marcoConvId, 'assistant', marco, 'Let me know when you start!', '2026-03-30T18:43:00.000Z'),
  ],

  // Group chat — planning a weekend hike
  [groupConvId]: [
    msg(
      groupConvId,
      'user',
      you,
      'Anyone up for a hike this Saturday?',
      '2026-03-31T10:00:00.000Z',
    ),
    msg(
      groupConvId,
      'assistant',
      alice,
      "I'm in! Where are you thinking?",
      '2026-03-31T10:05:00.000Z',
    ),
    msg(
      groupConvId,
      'user',
      you,
      'Eagle Creek trail — about 2 hours, nice waterfalls along the way.',
      '2026-03-31T10:10:00.000Z',
    ),
    msg(
      groupConvId,
      'assistant',
      marco,
      'Count me in. Should we carpool?',
      '2026-03-31T10:30:00.000Z',
    ),
    msg(
      groupConvId,
      'user',
      you,
      'Sure, I can drive. I have room for 3 more.',
      '2026-03-31T10:35:00.000Z',
    ),
    msg(
      groupConvId,
      'assistant',
      alice,
      'Perfect. 8 AM pickup works for everyone?',
      '2026-03-31T11:00:00.000Z',
    ),
    msg(groupConvId, 'assistant', marco, 'Works for me.', '2026-03-31T11:10:00.000Z'),
    msg(groupConvId, 'assistant', priya, 'I can bring snacks!', '2026-03-31T11:20:00.000Z'),
    msgWithFile(
      groupConvId,
      'user',
      you,
      {
        url: 'https://picsum.photos/seed/eagle-creek-trail/800/500',
        mediaType: 'image/jpeg',
        filename: 'trail-map.jpg',
      },
      'Found the trail map — waterfall lookout is about halfway through',
      '2026-03-31T11:25:00.000Z',
    ),
    msg(
      groupConvId,
      'assistant',
      alice,
      'Oh nice! That waterfall is gorgeous',
      '2026-03-31T11:28:00.000Z',
    ),
    msg(groupConvId, 'assistant', marco, 'How long is the full loop?', '2026-03-31T11:30:00.000Z'),
    msg(groupConvId, 'assistant', marco, 'Asking for my legs 😅', '2026-03-31T11:31:00.000Z'),
    msg(groupConvId, 'assistant', priya, 'Haha same question', '2026-03-31T11:32:00.000Z'),
    msg(
      groupConvId,
      'assistant',
      priya,
      "I'll bring extra trail mix just in case 😄",
      '2026-03-31T11:33:00.000Z',
    ),
    msg(
      groupConvId,
      'assistant',
      alice,
      'Should we bring a portable speaker?',
      '2026-03-31T11:45:00.000Z',
    ),
    msg(
      groupConvId,
      'user',
      you,
      'Yes! I have one — charging it tonight 🔋',
      '2026-03-31T12:05:00.000Z',
    ),
  ],
};

// --- Scripted replies per conversation ---------------------------------------

const replies: Record<string, string[]> = {
  [aliceConvId]: [
    'Haha, totally!',
    'Btw, did you see the new episode?',
    "Oh I'll send you the link later.",
  ],
  [marcoConvId]: [
    'Trust me, you wont be able to put it down.',
    'Also check out Piranesi if you want something shorter.',
    'Happy reading!',
  ],
  [groupConvId]: [
    "Don't forget sunscreen!",
    'Should we bring a portable speaker?',
    "I'll check the weather forecast tonight.",
    'This is going to be awesome!',
  ],
};

const replyCounters: Record<string, number> = {};

// --- Adapter -----------------------------------------------------------------

const respondents: Record<string, ChatUser> = {
  [aliceConvId]: alice,
  [marcoConvId]: marco,
  [groupConvId]: priya,
};

const adapter: ChatAdapter = {
  async sendMessage({ conversationId }) {
    const convId = conversationId ?? '';
    const pool = replies[convId] ?? ['Got it!'];
    const idx = replyCounters[convId] ?? 0;
    replyCounters[convId] = idx + 1;

    const text = pool[idx % pool.length];
    const author = respondents[convId] ?? alice;

    return createChunkStream(createTextResponseChunks(randomId(), text, { author }), {
      delayMs: 140,
    });
  },
};

// --- Component ---------------------------------------------------------------

type MessengerFilter = 'all' | 'unread' | 'groups';

function MessengerConversationSidebar(
  props: React.ComponentProps<typeof ChatConversationList> & {
    activeFilter: MessengerFilter;
    onFilterChange: (filter: MessengerFilter) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
  },
) {
  const { activeFilter, onFilterChange, searchValue, onSearchChange, ...conversationListProps } =
    props;

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 1.5 }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Messages</Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" sx={{ color: 'inherit' }}>
            <AddBoxOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: 'inherit' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ px: 2, pb: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: 999,
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          <SearchIcon sx={{ fontSize: 18 }} />
          <InputBase
            placeholder="Search or start a new chat"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            sx={{
              flex: 1,
              color: 'text.primary',
              '& input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      <Stack direction="row" spacing={1} sx={{ px: 2, pb: 1.5 }}>
        <Chip
          label="All"
          clickable
          color={activeFilter === 'all' ? 'primary' : 'default'}
          variant={activeFilter === 'all' ? 'filled' : 'outlined'}
          onClick={() => onFilterChange('all')}
          sx={{ borderRadius: 999 }}
        />
        <Chip
          label="Unread"
          clickable
          color={activeFilter === 'unread' ? 'primary' : 'default'}
          variant={activeFilter === 'unread' ? 'filled' : 'outlined'}
          onClick={() => onFilterChange('unread')}
          sx={{ borderRadius: 999 }}
        />
        <Chip
          label="Groups"
          clickable
          color={activeFilter === 'groups' ? 'primary' : 'default'}
          variant={activeFilter === 'groups' ? 'filled' : 'outlined'}
          onClick={() => onFilterChange('groups')}
          sx={{ borderRadius: 999 }}
        />
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ChatConversationList
          {...conversationListProps}
          slotProps={{
            ...conversationListProps.slotProps,
            scroller: {
              ...conversationListProps.slotProps?.scroller,
              sx: {
                width: '100%',
                borderRight: 'none',
                bgcolor: 'transparent',
                ...(conversationListProps.slotProps?.scroller as { sx?: object })?.sx,
              },
            } as any,
            viewport: {
              ...conversationListProps.slotProps?.viewport,
              sx: {
                px: 1,
                pb: 1,
                ...(conversationListProps.slotProps?.viewport as { sx?: object })?.sx,
              },
            } as any,
            item: {
              ...conversationListProps.slotProps?.item,
              sx: {
                borderRadius: 3,
                mx: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                '&[aria-selected="true"]': {
                  bgcolor: 'action.selected',
                },
                ...(conversationListProps.slotProps?.item as { sx?: object })?.sx,
              },
            } as any,
            title: {
              ...conversationListProps.slotProps?.title,
              sx: {
                color: 'text.primary',
                ...(conversationListProps.slotProps?.title as { sx?: object })?.sx,
              },
            } as any,
            preview: {
              ...conversationListProps.slotProps?.preview,
              sx: {
                color: 'text.secondary',
                ...(conversationListProps.slotProps?.preview as { sx?: object })?.sx,
              },
            } as any,
            timestamp: {
              ...conversationListProps.slotProps?.timestamp,
              sx: {
                color: 'text.disabled',
                ...(conversationListProps.slotProps?.timestamp as { sx?: object })?.sx,
              },
            } as any,
          }}
        />
      </Box>
    </Box>
  );
}

export default function MessengerDemo() {
  const chatBoxStyle = React.useMemo(
    () =>
      ({
        '--ChatBox-conversationListWidth': `${MESSENGER_SIDEBAR_WIDTH}px`,
      }) as React.CSSProperties,
    [],
  );
  const [activeFilter, setActiveFilter] = React.useState<MessengerFilter>('all');
  const [searchValue, setSearchValue] = React.useState('');
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => messengerConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    messengerConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(messengerThreads).map(([id, msgs]) => [id, msgs.map((m) => ({ ...m }))]),
    ),
  );

  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      (conversation.title ?? '').toLowerCase().includes(normalizedSearch) ||
      conversation.subtitle?.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    if (activeFilter === 'unread') {
      return (conversation.unreadCount ?? 0) > 0 || conversation.readState === 'unread';
    }

    if (activeFilter === 'groups') {
      return (conversation.participants?.length ?? 0) > 2;
    }

    return true;
  });

  React.useEffect(() => {
    if (filteredConversations.length === 0) {
      return;
    }

    const hasActiveConversation = filteredConversations.some(
      (conversation) => conversation.id === activeConversationId,
    );

    if (!hasActiveConversation) {
      setActiveConversationId(filteredConversations[0].id);
    }
  }, [activeConversationId, filteredConversations]);

  const messages = threads[activeConversationId] ?? [];

  return (
    <ChatBox
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={filteredConversations}
      messages={messages}
      features={{ conversationList: true }}
      style={chatBoxStyle}
      slots={{
        conversationList: MessengerConversationSidebar,
      }}
      slotProps={{
        conversationList: {
          activeFilter,
          onFilterChange: setActiveFilter,
          searchValue,
          onSearchChange: setSearchValue,
        } as React.ComponentProps<typeof MessengerConversationSidebar>,
        composerRoot: {
          variant: 'compact',
        },
      }}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
      sx={{ height: '100%' }}
    />
  );
}
