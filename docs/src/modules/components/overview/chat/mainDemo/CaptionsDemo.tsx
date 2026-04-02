'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, keyframes } from '@mui/material/styles';
import CallEndIcon from '@mui/icons-material/CallEnd';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import PresentToAllOutlinedIcon from '@mui/icons-material/PresentToAllOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import {
  ChatConversation,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageList,
} from '@mui/x-chat';
import {
  ChatProvider,
  useMessageIds,
  type ChatAdapter,
  type ChatMessage as ChatMessageModel,
  type ChatUser,
} from '@mui/x-chat/headless';
import { ChatVariantProvider } from '@mui/x-chat/unstyled';
import { randomId } from '../../../../../../data/chat/material/examples/shared/demoUtils';

// --- Avatar helper -----------------------------------------------------------

function createAvatarDataUrl(label: string, background: string, foreground = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="${background}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="${foreground}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// --- Participants ------------------------------------------------------------

const parker: ChatUser = {
  id: 'parker',
  displayName: 'Parker Lee',
  avatarUrl: createAvatarDataUrl('PL', '#5c6bc0'),
  role: 'assistant',
};

const eric: ChatUser = {
  id: 'eric',
  displayName: 'Eric Kirkpatrick',
  avatarUrl: createAvatarDataUrl('EK', '#c62828'),
  role: 'assistant',
};

const fatima: ChatUser = {
  id: 'fatima',
  displayName: 'Fatima Khan',
  avatarUrl: createAvatarDataUrl('FK', '#00695c'),
  role: 'user',
};

const meetParticipants = [parker, eric, fatima];

// --- Caption data ------------------------------------------------------------

const CONVERSATION_ID = randomId();
const baseTime = new Date('2026-04-01T14:00:00.000Z').getTime();

interface CaptionEntry {
  author: ChatUser;
  text: string;
}

const allCaptions: CaptionEntry[] = [
  {
    author: parker,
    text: 'So where are we on the Q2 roadmap? I want to make sure we have the concept approved by the end of day on Friday. We cannot afford to slip on this one because the board presentation is the following Monday and I need final numbers.',
  },
  {
    author: eric,
    text: 'Yes, we will need them ordered by tomorrow to meet the deadline in June this year. Can we get that done? I already pinged the operations team and they said they can fast-track if we get the purchase order signed by end of business today.',
  },
  {
    author: fatima,
    text: 'I think so. I already spoke with the vendor and they confirmed availability for the timeline we need. They even offered a ten percent discount if we commit to the full quarter upfront, which could save us around twelve thousand on the total budget.',
  },
  {
    author: parker,
    text: 'That is great news. And the budget allocation? Did finance sign off on the revised numbers? Last time I checked they had some concerns about the contingency buffer being too thin for a project of this scope.',
  },
  {
    author: eric,
    text: 'They gave us preliminary approval. We are waiting on one more signature but it should come through today. I spoke with the CFO this morning and she was supportive. She just wanted to see the updated risk assessment before giving the final green light.',
  },
  {
    author: fatima,
    text: 'I can follow up with Sarah from finance right after this call to expedite. I also have the revised risk matrix ready to share, I updated it last night with the new vendor pricing and the adjusted timeline so everything should be aligned.',
  },
  {
    author: parker,
    text: 'Perfect. Let us move on to the design review. Eric, can you walk us through the latest mockups? I know the stakeholders had feedback about the navigation hierarchy and the onboarding flow so I want to make sure we addressed all of that.',
  },
  {
    author: eric,
    text: 'Sure. I shared the updated Figma link in the chat. The main changes are on the dashboard layout and the navigation flow. We moved the secondary actions into a collapsible sidebar and added breadcrumbs so users always know where they are in the app.',
  },
  {
    author: fatima,
    text: 'I reviewed them yesterday. The new navigation is much cleaner. I especially like the sidebar redesign. One thing I noticed is that the mobile breakpoint cuts off some of the action buttons, so we might need to move those into an overflow menu on smaller screens.',
  },
  {
    author: parker,
    text: 'Good catch. Have we tested the layout on smaller screens? Some of our users are on tablets and we have seen a twenty percent increase in mobile traffic over the last quarter. We need to make sure the experience is solid across all device sizes.',
  },
  {
    author: eric,
    text: 'Good point. I will schedule a responsive testing session this week and share results before the Friday deadline. I can also set up a BrowserStack session so we can test on actual devices instead of just relying on the Chrome emulator.',
  },
  {
    author: fatima,
    text: 'I can help with that. I have access to the device lab and can run through the test cases. I will prioritize the top five devices from our analytics data and make sure the critical user journeys work end to end on each one.',
  },
  {
    author: parker,
    text: 'Excellent. Now let us talk about the API integration timeline. The backend team mentioned they are behind on the authentication endpoints and that could block our frontend work next week. Do we have a contingency plan for that?',
  },
  {
    author: eric,
    text: 'I spoke with the backend lead yesterday. They are about two days behind but they plan to have the auth endpoints ready by Wednesday. In the meantime I set up mock endpoints so the frontend team can keep building without being blocked.',
  },
  {
    author: fatima,
    text: 'That is smart. I have been using the mock server for the profile and settings pages and it has been working well. We should document the mock setup in the wiki so anyone joining the project can get up to speed quickly without having to ask around.',
  },
  {
    author: parker,
    text: 'Agreed. Let us also make sure we have proper error handling in place for when the real API behaves differently from the mocks. I have seen that cause issues on past projects where the team only tested against happy path responses.',
  },
  {
    author: eric,
    text: 'I already added error boundary components and retry logic for the critical flows. We also have a Sentry integration set up so we will get real time alerts if anything goes wrong in staging or production. I can demo that in our next standup.',
  },
  {
    author: fatima,
    text: 'On the topic of monitoring, should we set up a performance dashboard before launch? I noticed the bundle size has grown by about fifteen percent since last sprint and I want to make sure we are not shipping unnecessary code to users.',
  },
  {
    author: parker,
    text: 'Great point. Let us add a bundle analysis step to the CI pipeline. We should set a budget of two hundred kilobytes for the initial JavaScript payload and flag any pull request that pushes us over that limit automatically.',
  },
  {
    author: eric,
    text: 'I can configure that with webpack bundle analyzer and add it to our GitHub Actions workflow. I will also look into lazy loading some of the heavier chart components since most users do not need them on the initial page load.',
  },
  {
    author: fatima,
    text: 'That reminds me, the accessibility audit results came in this morning. We passed most of the WCAG criteria but there are a few color contrast issues on the secondary buttons and the form validation messages need better screen reader announcements.',
  },
  {
    author: parker,
    text: 'Accessibility is non-negotiable for this release. Fatima, can you create tickets for each of the findings and tag them as high priority? I want those resolved before we go into the final QA cycle next Thursday.',
  },
  {
    author: eric,
    text: 'I will update the component library tokens to fix the contrast ratios. It should be a straightforward change in the design system. For the screen reader issues I think we need to add aria-live regions to the form components and improve the focus management.',
  },
  {
    author: fatima,
    text: 'Already on it. I will have the tickets created by end of day and I will pair with Eric tomorrow to tackle the most critical ones first. I also want to schedule a quick session with our accessibility consultant to validate the fixes before we merge them.',
  },
];

// --- Dark theme --------------------------------------------------------------

const darkTheme = createTheme({ palette: { mode: 'dark' } });

// --- No-op adapter -----------------------------------------------------------

const noOpAdapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

// --- Animations --------------------------------------------------------------

const captionFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Word-by-word streaming hook ---------------------------------------------

const INITIAL_CAPTION_COUNT = 2;

function createCompletedCaption(index: number): ChatMessageModel {
  const caption = allCaptions[index];
  return {
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: caption.author.id === 'fatima' ? 'user' : 'assistant',
    status: 'sent',
    createdAt: new Date(baseTime + index * 5000).toISOString(),
    author: caption.author,
    parts: [{ type: 'text', text: caption.text }],
  };
}

function useStreamingCaptions() {
  const [messages, setMessages] = React.useState<ChatMessageModel[]>(() =>
    allCaptions.slice(0, INITIAL_CAPTION_COUNT).map((_, i) => createCompletedCaption(i)),
  );
  const captionIndexRef = React.useRef(INITIAL_CAPTION_COUNT);
  const wordIndexRef = React.useRef(0);
  const currentMessageIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Start with a brief delay
    const startTimeout = setTimeout(() => {
      startNextCaption();
    }, 1200);

    function startNextCaption() {
      if (captionIndexRef.current >= allCaptions.length) {
        // Loop back to start after clearing
        captionIndexRef.current = 0;
        setMessages([]);
      }

      const caption = allCaptions[captionIndexRef.current];
      const msgId = randomId();
      currentMessageIdRef.current = msgId;
      wordIndexRef.current = 0;

      const words = caption.text.split(' ');

      // Create the message with the first word
      const newMsg: ChatMessageModel = {
        id: msgId,
        conversationId: CONVERSATION_ID,
        role: caption.author.id === 'fatima' ? 'user' : 'assistant',
        status: 'streaming',
        createdAt: new Date(baseTime + captionIndexRef.current * 5000).toISOString(),
        author: caption.author,
        parts: [{ type: 'text', text: words[0] }],
      };

      setMessages((prev) => [...prev, newMsg]);
      wordIndexRef.current = 1;

      // Stream remaining words
      const wordInterval = setInterval(
        () => {
          if (wordIndexRef.current >= words.length) {
            clearInterval(wordInterval);

            // Mark message as sent
            setMessages((prev) =>
              prev.map((m) => (m.id === msgId ? { ...m, status: 'sent' as const } : m)),
            );

            captionIndexRef.current += 1;

            // Start next caption after a pause
            setTimeout(startNextCaption, 800 + Math.random() * 600);
            return;
          }

          const currentWords = words.slice(0, wordIndexRef.current + 1).join(' ');
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId ? { ...m, parts: [{ type: 'text' as const, text: currentWords }] } : m,
            ),
          );
          wordIndexRef.current += 1;
        },
        60 + Math.random() * 40,
      );

      return () => clearInterval(wordInterval);
    }

    return () => clearTimeout(startTimeout);
  }, []);

  return messages;
}

// --- Caption list component --------------------------------------------------

function CaptionList() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    (item: { id: string; index: number }) => (
      <Box
        key={item.id}
        sx={{
          animation: `${captionFadeIn} 0.25s ease-out both`,
        }}
      >
        <ChatMessageGroup messageId={item.id}>
          <ChatMessage
            messageId={item.id}
            sx={{
              '& .MuiChatMessageContent-root': {
                bgcolor: 'transparent',
                color: '#e8eaed',
                p: 0,
                fontSize: 14,
                lineHeight: 1.5,
                '& p': { margin: 0 },
              },
              '& .MuiChatMessageAvatar-root': {
                width: 24,
                height: 24,
                fontSize: 10,
              },
            }}
          >
            <ChatMessageAvatar />
            <ChatMessageContent />
          </ChatMessage>
        </ChatMessageGroup>
      </Box>
    ),
    [],
  );

  return (
    <ChatConversation
      sx={{
        height: '100%',
        bgcolor: 'transparent',
        '& .MuiChatConversation-messageListContainer': {
          bgcolor: 'transparent',
        },
      }}
    >
      <ChatMessageList
        renderItem={renderItem}
        items={messageIds}
        slotProps={{
          messageListContent: {
            sx: {
              py: 0.5,
              px: 2,
              gap: 0.25,
              justifyContent: 'flex-end',
              '& .MuiChatMessageGroup-root': {
                gap: 0,
              },
            },
          },
        }}
      />
    </ChatConversation>
  );
}

// --- Participant tile --------------------------------------------------------

function ParticipantTile({ user }: { user: ChatUser }) {
  const initials = (user.displayName ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#3c4043',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      <Typography sx={{ color: '#e8eaed', fontSize: 48, fontWeight: 600, userSelect: 'none' }}>
        {initials}
      </Typography>
      <Typography
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 12,
          color: '#e8eaed',
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {user.displayName}
      </Typography>
    </Box>
  );
}

// --- Toolbar button ----------------------------------------------------------

function ToolbarButton({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'active' | 'end';
}) {
  const styles = {
    default: {
      color: '#e8eaed',
      bgcolor: '#3c4043',
      '&:hover': { bgcolor: '#4a4d51' },
    },
    active: {
      color: '#202124',
      bgcolor: '#8ab4f8',
      '&:hover': { bgcolor: '#aecbfa' },
    },
    end: {
      color: '#fff',
      bgcolor: '#ea4335',
      '&:hover': { bgcolor: '#d33828' },
      borderRadius: 5,
      px: 2.5,
    },
  };

  return (
    <IconButton size="small" sx={{ width: 40, height: 40, ...styles[variant] }}>
      {children}
    </IconButton>
  );
}

// --- Main component ----------------------------------------------------------

export default function CaptionsDemo() {
  const messages = useStreamingCaptions();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#202124',
          color: '#e8eaed',
        }}
      >
        {/* Top bar — meeting title + participants */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1, minHeight: 44 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Monthly Meeting</Typography>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: '#9aa0a6' }} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {meetParticipants.map((p) => (
              <Avatar
                key={p.id}
                src={p.avatarUrl}
                sx={{ width: 24, height: 24, fontSize: 10 }}
                alt={p.displayName}
              />
            ))}
            <Typography sx={{ color: '#9aa0a6', fontSize: 12, ml: 0.5 }}>+3</Typography>
          </Stack>
        </Stack>

        {/* Video area — 3 participants in a row */}
        <Box sx={{ flex: 1, minHeight: 0, px: 0.5, display: 'flex', gap: 0.5 }}>
          {meetParticipants.map((p) => (
            <Box key={p.id} sx={{ flex: 1, minWidth: 0 }}>
              <ParticipantTile user={p} />
            </Box>
          ))}
        </Box>

        {/* Caption area — below videos */}
        <Box sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
          {/* Language bar */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 0.5, minHeight: 28, flexShrink: 0 }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={{ color: '#9aa0a6', fontSize: 11 }}>Meeting language:</Typography>
              <Typography sx={{ color: '#8ab4f8', fontSize: 11, cursor: 'pointer' }}>
                English ▾
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={{ color: '#8ab4f8', fontSize: 11, cursor: 'pointer' }}>
                Translated captions ▾
              </Typography>
              <SettingsOutlinedIcon sx={{ fontSize: 14, color: '#9aa0a6', cursor: 'pointer' }} />
            </Stack>
          </Stack>

          {/* Streaming captions */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ChatProvider
              adapter={noOpAdapter}
              activeConversationId={CONVERSATION_ID}
              conversations={[
                {
                  id: CONVERSATION_ID,
                  title: 'Monthly Meeting',
                  participants: meetParticipants,
                  readState: 'read' as const,
                  unreadCount: 0,
                  lastMessageAt: new Date(baseTime).toISOString(),
                },
              ]}
              messages={messages}
              onMessagesChange={() => {}}
              currentUser={fatima}
            >
              <ChatVariantProvider variant="compact">
                <CaptionList />
              </ChatVariantProvider>
            </ChatProvider>
          </Box>
        </Box>

        {/* Bottom toolbar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1, minHeight: 52 }}
        >
          {/* Left: meeting time + info */}
          <Typography sx={{ color: '#9aa0a6', fontSize: 13, fontWeight: 500, minWidth: 80 }}>
            3:53 PM
          </Typography>

          {/* Center: meeting controls */}
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <ToolbarButton variant="active">
              <MicIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton variant="active">
              <VideocamIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton>
              <EmojiEmotionsOutlinedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton>
              <PresentToAllOutlinedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton>
              <PanToolOutlinedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton>
              <MoreVertIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton variant="end">
              <CallEndIcon fontSize="small" />
            </ToolbarButton>
          </Stack>

          {/* Right: grid view */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ minWidth: 80, justifyContent: 'flex-end' }}
          >
            <IconButton size="small" sx={{ color: '#9aa0a6', width: 32, height: 32 }}>
              <GridViewOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
