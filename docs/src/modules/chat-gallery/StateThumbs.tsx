import * as React from 'react';
import {
  Card,
  DateDivider,
  SkeletonRows,
  SuggestionCards,
  ThumbCanvas,
  TypingBubble,
  UnreadMarker,
  W,
  H,
  PAD,
  useTokens,
} from './primitives';

export function ChatSuggestionsThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <SuggestionCards />
      </Card>
    </ThumbCanvas>
  );
}

// Big typing bubble centered with no surrounding messages.
export function ChatTypingIndicatorThumb() {
  const cw = W - PAD * 2;
  const ch = H - PAD * 2;
  const w = 180;
  const h = 80;
  return (
    <ThumbCanvas>
      <Card>
        <TypingBubble x={(cw - w) / 2} y={(ch - h) / 2} w={w} h={h} />
      </Card>
    </ThumbCanvas>
  );
}

// Just the unread marker line + pill, centered.
export function ChatUnreadMarkerThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <UnreadMarker y={(H - PAD * 2) / 2} />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatMessageSkeletonThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <SkeletonRows />
      </Card>
    </ThumbCanvas>
  );
}

// Big floating action button — focused on the affordance itself.
export function ChatScrollToBottomAffordanceThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <CenteredScrollFab />
      </Card>
    </ThumbCanvas>
  );
}

function CenteredScrollFab() {
  const t = useTokens();
  const cw = W - PAD * 2;
  const ch = H - PAD * 2;
  const cx = cw / 2;
  const cy = ch / 2;
  return (
    <g>
      {/* Halo ring */}
      <circle cx={cx} cy={cy} r={84} fill={t.accentSoft} />
      <circle cx={cx} cy={cy} r={64} fill={t.accent} />
      <path
        d={`M ${cx - 18} ${cy - 8} L ${cx} ${cy + 14} L ${cx + 18} ${cy - 8}`}
        stroke={t.onAccent}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Unread badge */}
      <circle cx={cx + 48} cy={cy - 48} r={20} fill={t.danger} />
      <rect x={cx + 38} y={cy - 52} width={20} height={8} rx={4} fill="#ffffff" />
    </g>
  );
}

// Just the date divider, centered.
export function ChatDateDividerThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <DateDivider y={(H - PAD * 2) / 2} />
      </Card>
    </ThumbCanvas>
  );
}
