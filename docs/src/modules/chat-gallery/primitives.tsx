import * as React from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * Schematic thumbnail kit. Minimal silhouettes — every element earns its place.
 *
 * Layers:
 *  1. Layout components — Card, Sidebar, Thread, Header, Messages, Composer …
 *     Compose declaratively. Children read their bounds from `<LayoutCtx>`.
 *  2. Visual atoms — Avatar, Bar, etc. Solid shapes, no ornament.
 *
 * Canvas: 800 × 500. Outer padding 32. Themes flip via `<ThumbCanvas>`.
 */

// === Tokens =================================================================

interface Tokens {
  surface: string;
  muted: string;
  divider: string;
  text: string;
  accent: string;
  accentSoft: string;
  accentLight: string;
  bubble: string;
  outgoing: string;
  danger: string;
  dangerSoft: string;
  onAccent: string;
  iconMuted: string;
  success: string;
  codeBg: string;
  codeHead: string;
}

const LIGHT: Tokens = {
  surface: '#ffffff',
  muted: '#f6f7f9',
  divider: '#e5e7eb',
  text: '#d1d5db',
  accent: '#70a597',
  accentSoft: '#e3edea',
  accentLight: '#bcd5cd',
  bubble: '#eef0f2',
  outgoing: '#70a597',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
  onAccent: '#ffffff',
  iconMuted: '#9ca3af',
  success: '#22c55e',
  codeBg: '#1e293b',
  codeHead: '#0f172a',
};

const DARK: Tokens = {
  surface: '#171717',
  muted: '#0a0a0a',
  divider: '#262626',
  text: '#3f3f46',
  accent: '#70a597',
  accentSoft: '#1f3530',
  accentLight: '#3d5b54',
  bubble: '#262626',
  outgoing: '#70a597',
  danger: '#ef4444',
  dangerSoft: '#3f1d1d',
  onAccent: '#0a0a0a',
  iconMuted: '#737373',
  success: '#22c55e',
  codeBg: '#1e293b',
  codeHead: '#0f172a',
};

const TokenCtx = React.createContext<Tokens>(LIGHT);
const useTokens = () => React.useContext(TokenCtx);

// === Canvas =================================================================

export const W = 800;
export const H = 500;
export const PAD = 32;

interface Layout {
  w: number;
  h: number;
}

const LayoutCtx = React.createContext<Layout>({ w: W, h: H });
const useLayout = () => React.useContext(LayoutCtx);

const CardCtx = React.createContext<{ sidebarW: number }>({ sidebarW: 0 });
const useCard = () => React.useContext(CardCtx);

const CANVAS_LAYOUT = { w: W, h: H };

export function ThumbCanvas({ children }: { children: React.ReactNode }) {
  const tokens = useTheme().palette.mode === 'dark' ? DARK : LIGHT;
  return (
    <TokenCtx.Provider value={tokens}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden="true"
      >
        {/* Single background — same color as the outer card host so only one
            surface tone is visible behind the schematic. */}
        <rect width={W} height={H} fill={tokens.surface} />
        <LayoutCtx.Provider value={CANVAS_LAYOUT}>{children}</LayoutCtx.Provider>
      </svg>
    </TokenCtx.Provider>
  );
}

interface RegionProps {
  x?: number;
  y?: number;
  w: number;
  h: number;
  children?: React.ReactNode;
}

function Region({ x = 0, y = 0, w, h, children }: RegionProps) {
  const layout = React.useMemo(() => ({ w, h }), [w, h]);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <LayoutCtx.Provider value={layout}>{children}</LayoutCtx.Provider>
    </g>
  );
}

// === Layout =================================================================

export function Card({
  sidebarW = 0,
  children,
}: {
  sidebarW?: number;
  children?: React.ReactNode;
}) {
  // No visible frame — the outer host card already provides the boundary.
  // Card just establishes a padded region so schematics have breathing room.
  const w = W - PAD * 2;
  const h = H - PAD * 2;
  const cardValue = React.useMemo(() => ({ sidebarW }), [sidebarW]);
  return (
    <CardCtx.Provider value={cardValue}>
      <Region x={PAD} y={PAD} w={w} h={h}>
        {children}
      </Region>
    </CardCtx.Provider>
  );
}

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const t = useTokens();
  const layout = useLayout();
  const { sidebarW } = useCard();
  return (
    <React.Fragment>
      <rect
        width={sidebarW}
        height={layout.h}
        rx={16}
        fill={t.muted}
        stroke={t.divider}
        strokeWidth={1}
      />
      <line x1={sidebarW} y1={0} x2={sidebarW} y2={layout.h} stroke={t.divider} strokeWidth={1} />
      <Region w={sidebarW} h={layout.h}>
        {children}
      </Region>
    </React.Fragment>
  );
}

export function Thread({ children }: { children?: React.ReactNode }) {
  const layout = useLayout();
  const { sidebarW } = useCard();
  return (
    <Region x={sidebarW} y={0} w={layout.w - sidebarW} h={layout.h}>
      {children}
    </Region>
  );
}

// === Header =================================================================

type HeaderFocus = 'all' | 'avatar' | 'title' | 'subtitle' | 'info' | 'actions';

interface HeaderProps {
  h?: number;
  focus?: HeaderFocus;
}

export function Header({ h = 64, focus }: HeaderProps) {
  const t = useTokens();
  const layout = useLayout();
  const has = (k: HeaderFocus) =>
    focus === k || focus === 'all' || (focus === 'info' && (k === 'title' || k === 'subtitle'));
  const detailed = focus !== undefined;
  // Scale glyph sizes with header height for consistent visual weight
  const avatarR = Math.min(Math.max(16, h * 0.24), 32);
  const avatarCx = Math.max(32, avatarR + 16);
  const titleX = avatarCx + avatarR + 12;
  const titleH = Math.max(8, Math.round(h * 0.12));
  const titleW = Math.min(layout.w * 0.32, 220);
  const subtitleH = Math.max(6, Math.round(titleH * 0.7));
  const subtitleW = titleW * 0.65;
  return (
    <React.Fragment>
      {focus === 'all' && <rect width={layout.w} height={h} fill={t.accentSoft} />}
      <line x1={0} y1={h} x2={layout.w} y2={h} stroke={t.divider} strokeWidth={1} />
      <Avatar cx={avatarCx} cy={h / 2} r={avatarR} variant={has('avatar') ? 'accent' : 'soft'} />
      <Bar
        x={titleX}
        y={detailed ? h / 2 - titleH - 4 : h / 2 - titleH / 2}
        w={titleW}
        h={titleH}
        fill={has('title') ? t.accent : t.text}
      />
      {detailed && (
        <Bar
          x={titleX}
          y={h / 2 + 8}
          w={subtitleW}
          h={subtitleH}
          fill={has('subtitle') ? t.accent : t.text}
          opacity={has('subtitle') ? 1 : 0.6}
        />
      )}
      {detailed && (
        <ActionDots cx={layout.w - 36} cy={h / 2} fill={has('actions') ? t.accent : t.text} />
      )}
    </React.Fragment>
  );
}

function ActionDots({ cx, cy, fill }: { cx: number; cy: number; fill: string }) {
  return (
    <g>
      <circle cx={cx - 14} cy={cy} r={3} fill={fill} />
      <circle cx={cx} cy={cy} r={3} fill={fill} />
      <circle cx={cx + 14} cy={cy} r={3} fill={fill} />
    </g>
  );
}

// === Messages ===============================================================

export function Messages({
  y = 96,
  gap = 18,
  inset = 24,
  children,
}: {
  y?: number;
  gap?: number;
  inset?: number;
  children?: React.ReactNode;
}) {
  const layout = useLayout();
  const items = React.Children.toArray(children).filter(React.isValidElement);
  let cursor = y;
  return (
    <React.Fragment>
      {items.map((child) => {
        const props = child.props as { h?: number };
        const childH = props.h ?? 48;
        const node = (
          <Region
            key={child.key ?? cursor}
            x={inset}
            y={cursor}
            w={layout.w - inset * 2}
            h={childH}
          >
            {child}
          </Region>
        );
        cursor += childH + gap;
        return node;
      })}
    </React.Fragment>
  );
}

export function Msg({
  side = 'left',
  h = 48,
  width,
}: {
  side?: 'left' | 'right';
  h?: number;
  width?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const isLeft = side === 'left';
  const w = width ?? Math.min(layout.w * (isLeft ? 0.62 : 0.55), 360);
  const x = isLeft ? 0 : layout.w - w;
  const fill = isLeft ? t.bubble : t.accent;
  const stroke = isLeft ? t.divider : t.accent;
  return (
    <rect x={x} y={0} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={1} />
  );
}

// === Composer ===============================================================

export function Composer({
  inset = 24,
  bottom = 24,
  h = 48,
}: {
  inset?: number;
  bottom?: number;
  h?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const x = inset;
  const y = layout.h - h - bottom;
  const w = layout.w - inset * 2;
  return (
    <React.Fragment>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={t.surface} stroke={t.divider} />
      <circle cx={x + w - h / 2 - 4} cy={y + h / 2} r={h / 2 - 8} fill={t.accent} />
    </React.Fragment>
  );
}

// === Conversation list ======================================================

export function ConversationList({
  y = 80,
  gap = 14,
  rowH = 56,
  children,
}: {
  y?: number;
  gap?: number;
  rowH?: number;
  children?: React.ReactNode;
}) {
  const layout = useLayout();
  const items = React.Children.toArray(children).filter(React.isValidElement);
  return (
    <React.Fragment>
      {items.map((child, i) => (
        <Region key={child.key ?? i} x={0} y={y + i * (rowH + gap)} w={layout.w} h={rowH}>
          {child}
        </Region>
      ))}
    </React.Fragment>
  );
}

export function Conversation({
  active = false,
  unread = false,
}: {
  active?: boolean;
  unread?: boolean;
}) {
  const t = useTokens();
  const layout = useLayout();
  const fill = active ? t.accentSoft : t.surface;
  const stroke = active ? t.accent : t.divider;
  return (
    <React.Fragment>
      <rect
        x={12}
        y={0}
        width={layout.w - 24}
        height={layout.h}
        rx={12}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />
      <Avatar cx={32} cy={layout.h / 2} r={16} variant={active ? 'accent' : 'soft'} />
      <Bar x={56} y={layout.h / 2 - 4} w={layout.w - 96} h={8} />
      {unread && <circle cx={layout.w - 24} cy={layout.h / 2} r={4} fill={t.accent} />}
    </React.Fragment>
  );
}

export function SearchField({ y = 24, h = 32 }: { y?: number; h?: number }) {
  const t = useTokens();
  const layout = useLayout();
  return (
    <rect
      x={16}
      y={y}
      width={layout.w - 32}
      height={h}
      rx={h / 2}
      fill={t.surface}
      stroke={t.divider}
    />
  );
}

// === Single message row (for slot focus thumbs) =============================

type MessageRowFocus = 'all' | 'avatar' | 'content' | 'meta' | 'inline-meta' | 'actions' | 'author';

interface MessageRowProps {
  side?: 'left' | 'right';
  h?: number;
  focus?: MessageRowFocus;
  showAuthor?: boolean;
  showMeta?: boolean;
  showActions?: boolean;
  showInlineMeta?: boolean;
}

export function MessageRow({
  side = 'left',
  h = 56,
  focus,
  showAuthor = false,
  showMeta = false,
  showActions = false,
  showInlineMeta = false,
}: MessageRowProps) {
  const t = useTokens();
  const layout = useLayout();
  const has = (k: MessageRowFocus) => focus === k || focus === 'all';
  const isLeft = side === 'left';
  const avatarR = 18;
  const bubbleW = isLeft ? Math.min(layout.w * 0.62, 360) : Math.min(layout.w * 0.55, 320);
  const bubbleX = isLeft ? avatarR * 2 + 12 : layout.w - bubbleW;
  const isAccent = has('content') || (!focus && side === 'right');
  const bubbleFill = isAccent ? t.accent : t.bubble;
  let inlineMetaFill: string;
  if (has('inline-meta')) {
    inlineMetaFill = t.accent;
  } else {
    inlineMetaFill = isAccent ? t.onAccent : t.text;
  }
  return (
    <g>
      {/* Avatar */}
      {isLeft && (
        <Avatar cx={avatarR} cy={h / 2} r={avatarR} variant={has('avatar') ? 'accent' : 'soft'} />
      )}
      {/* Author label */}
      {showAuthor && (
        <Bar
          x={bubbleX}
          y={h / 2 - bubbleW * 0 - 28}
          w={120}
          h={8}
          fill={has('author') ? t.accent : t.text}
        />
      )}
      {/* Bubble */}
      <rect
        x={bubbleX}
        y={0}
        width={bubbleW}
        height={h}
        rx={12}
        fill={bubbleFill}
        stroke={isAccent ? t.accent : t.divider}
        strokeWidth={1}
      />
      {/* Inline meta inside bubble (bottom-right) */}
      {showInlineMeta && (
        <rect
          x={bubbleX + bubbleW - 50}
          y={h - 18}
          width={36}
          height={8}
          rx={4}
          fill={inlineMetaFill}
          opacity={has('inline-meta') ? 1 : 0.6}
        />
      )}
      {/* Meta line below */}
      {showMeta && (
        <rect
          x={bubbleX}
          y={h + 8}
          width={120}
          height={8}
          rx={4}
          fill={has('meta') ? t.accent : t.text}
        />
      )}
      {/* Action dots below */}
      {showActions && (
        <g transform={`translate(${bubbleX}, ${h + 14})`}>
          <ActionRow fill={has('actions') ? t.accent : t.text} count={4} />
        </g>
      )}
    </g>
  );
}

function ActionRow({ fill, count = 4 }: { fill: string; count?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={12 + i * 22} cy={6} r={6} fill={fill} />
      ))}
    </g>
  );
}

// === Group of bubbles =======================================================

export function MessageGroup({
  count = 3,
  side = 'left',
  gap = 8,
  h = 40,
}: {
  count?: number;
  side?: 'left' | 'right';
  gap?: number;
  h?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const isLeft = side === 'left';
  const avatarR = 18;
  const inset = isLeft ? avatarR * 2 + 12 : 0;
  const widths = [320, 280, 200];
  return (
    <g>
      {isLeft && <Avatar cx={avatarR} cy={h / 2} r={avatarR} />}
      {Array.from({ length: count }, (_, i) => {
        const w = widths[i % widths.length];
        const x = isLeft ? inset : layout.w - w;
        return (
          <rect
            key={i}
            x={x}
            y={i * (h + gap)}
            width={w}
            height={h}
            rx={12}
            fill={isLeft ? t.bubble : t.accent}
            stroke={isLeft ? t.divider : t.accent}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

// === Composer card (for slot focus thumbs) ==================================

type ComposerFocus =
  'all' | 'textarea' | 'toolbar' | 'send' | 'attach' | 'attachments' | 'helper' | 'label';

export function ComposerCard({ focus }: { focus?: ComposerFocus }) {
  const t = useTokens();
  const layout = useLayout();
  const has = (k: ComposerFocus) => focus === k || focus === 'all';
  // Stack: [label?] [card: attachments? + textarea + toolbar + helper?]
  const showLabel = focus === 'label';
  const showAttachments = focus === 'attachments';
  const showHelper = focus === 'helper';

  const topY = showLabel ? 64 : 32;
  const cardX = 32;
  const cardW = layout.w - 64;
  const attachH = showAttachments ? 64 : 0;
  const textareaH = 140;
  const toolbarH = 48;
  const helperH = showHelper ? 28 : 0;
  const cardH = attachH + textareaH + toolbarH + helperH + 24;

  return (
    <React.Fragment>
      {/* Label */}
      {showLabel && (
        <rect
          x={cardX}
          y={32}
          width={140}
          height={20}
          rx={6}
          fill={has('label') ? t.accent : t.text}
        />
      )}

      {/* Composer card */}
      <rect
        x={cardX}
        y={topY}
        width={cardW}
        height={cardH}
        rx={16}
        fill={t.surface}
        stroke={has('all') ? t.accent : t.divider}
        strokeWidth={has('all') ? 2 : 1}
      />

      {/* Attachments row */}
      {showAttachments && (
        <g>
          <rect
            x={cardX + 16}
            y={topY + 12}
            width={cardW - 32}
            height={48}
            rx={8}
            fill={t.accentSoft}
          />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={cardX + 28 + i * 110}
              y={topY + 22}
              width={92}
              height={28}
              rx={6}
              fill={t.accent}
              opacity={has('attachments') ? 1 : 0.5}
            />
          ))}
        </g>
      )}

      {/* Text area */}
      <rect
        x={cardX + 16}
        y={topY + attachH + 16}
        width={cardW - 32}
        height={textareaH - 16}
        rx={10}
        fill={has('textarea') ? t.accentSoft : t.muted}
        stroke={has('textarea') ? t.accent : 'none'}
        strokeWidth={has('textarea') ? 2 : 0}
      />
      {/* Fake text lines inside */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={cardX + 32}
          y={topY + attachH + 36 + i * 16}
          width={cardW - 64 - i * 80}
          height={6}
          rx={3}
          fill={has('textarea') ? t.accent : t.text}
          opacity={has('textarea') ? 0.7 : 1}
        />
      ))}

      {/* Toolbar */}
      <g transform={`translate(${cardX + 16}, ${topY + attachH + textareaH + 4})`}>
        <rect
          x={0}
          y={0}
          width={cardW - 32}
          height={toolbarH}
          rx={toolbarH / 2}
          fill={has('toolbar') ? t.accentSoft : 'transparent'}
          stroke={has('toolbar') ? t.accent : 'none'}
          strokeWidth={has('toolbar') ? 2 : 0}
        />
        {/* Attach button */}
        <circle
          cx={toolbarH / 2 + 4}
          cy={toolbarH / 2}
          r={toolbarH / 2 - 8}
          fill={has('attach') ? t.accent : t.bubble}
        />
        {/* Send button */}
        <circle
          cx={cardW - 32 - toolbarH / 2 - 4}
          cy={toolbarH / 2}
          r={toolbarH / 2 - 4}
          fill={has('send') ? t.accent : t.accent}
          opacity={has('send') ? 1 : 0.4}
        />
        {has('send') && (
          <circle
            cx={cardW - 32 - toolbarH / 2 - 4}
            cy={toolbarH / 2}
            r={toolbarH / 2 + 4}
            fill="none"
            stroke={t.accent}
            strokeWidth={2}
          />
        )}
      </g>

      {/* Helper text */}
      {showHelper && (
        <rect
          x={cardX + 16}
          y={topY + cardH - helperH - 4}
          width={cardW - 32}
          height={20}
          rx={4}
          fill={has('helper') ? t.accent : t.text}
          opacity={has('helper') ? 0.7 : 0.5}
        />
      )}
    </React.Fragment>
  );
}

// === States ================================================================

export function DateDivider({ y = H / 2 }: { y?: number }) {
  const t = useTokens();
  const layout = useLayout();
  const pillW = 80;
  const pillH = 24;
  return (
    <g>
      <rect
        x={32}
        y={y - 1.5}
        width={layout.w / 2 - pillW / 2 - 32 - 12}
        height={3}
        fill={t.accent}
        rx={1.5}
      />
      <rect
        x={layout.w / 2 - pillW / 2}
        y={y - pillH / 2}
        width={pillW}
        height={pillH}
        rx={pillH / 2}
        fill={t.accent}
      />
      <rect
        x={layout.w / 2 + pillW / 2 + 12}
        y={y - 1.5}
        width={layout.w / 2 - pillW / 2 - 32 - 12}
        height={3}
        fill={t.accent}
        rx={1.5}
      />
    </g>
  );
}

export function UnreadMarker({ y = H / 2 }: { y?: number }) {
  return <DateDivider y={y} />;
}

export function TypingBubble({
  x = 32,
  y,
  w = 96,
  h = 40,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const yy = y ?? layout.h / 2 - h / 2;
  return (
    <g>
      <rect
        x={x}
        y={yy}
        width={w}
        height={h}
        rx={h / 2}
        fill={t.accent}
        stroke={t.accent}
        strokeWidth={1}
      />
      <circle cx={x + w / 2 - 16} cy={yy + h / 2} r={5} fill={t.onAccent} />
      <circle cx={x + w / 2} cy={yy + h / 2} r={5} fill={t.onAccent} />
      <circle cx={x + w / 2 + 16} cy={yy + h / 2} r={5} fill={t.onAccent} />
    </g>
  );
}

export function SuggestionCards() {
  const t = useTokens();
  const layout = useLayout();
  // Vertical stack of 3 chip-like suggestions, each prefixed with a sparkle
  // icon — reads as "tappable AI prompts in an empty conversation".
  const w = Math.min(layout.w * 0.7, 520);
  const h = 56;
  const gap = 14;
  const total = 3 * h + 2 * gap;
  const x = (layout.w - w) / 2;
  const startY = (layout.h - total) / 2;
  const widths = [0.78, 0.62, 0.7];
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const y = startY + i * (h + gap);
        const cx = x + 30;
        const cy = y + h / 2;
        const textW = (w - 96) * widths[i];
        return (
          <g key={i}>
            {/* Suggestion chip */}
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={h / 2}
              fill={t.surface}
              stroke={t.accent}
              strokeWidth={1.5}
            />
            {/* Sparkle icon */}
            <Sparkle cx={cx} cy={cy} r={9} color={t.accent} />
            {/* Prompt label */}
            <rect
              x={x + 56}
              y={cy - 4}
              width={textW}
              height={8}
              rx={4}
              fill={t.accent}
              opacity={0.85}
            />
          </g>
        );
      })}
    </g>
  );
}

function Sparkle({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  // 4-point star: vertical + horizontal needles
  return (
    <g>
      <path
        d={`M ${cx} ${cy - r} L ${cx + r * 0.3} ${cy - r * 0.3} L ${cx + r} ${cy} L ${cx + r * 0.3} ${cy + r * 0.3} L ${cx} ${cy + r} L ${cx - r * 0.3} ${cy + r * 0.3} L ${cx - r} ${cy} L ${cx - r * 0.3} ${cy - r * 0.3} Z`}
        fill={color}
      />
    </g>
  );
}

export function SkeletonRows() {
  const t = useTokens();
  const layout = useLayout();
  const rowH = 56;
  const gap = 16;
  const rows = 4;
  const totalH = rows * rowH + (rows - 1) * gap;
  const startY = (layout.h - totalH) / 2;
  return (
    <g>
      {Array.from({ length: rows }, (_, i) => {
        const isLeft = i % 2 === 0;
        const w = [320, 240, 280, 200][i] ?? 240;
        const y = startY + i * (rowH + gap);
        return (
          <g key={i}>
            {isLeft && <circle cx={48} cy={y + rowH / 2} r={20} fill={t.bubble} />}
            <rect
              x={isLeft ? 80 : layout.w - w - 32}
              y={y}
              width={w}
              height={rowH}
              rx={12}
              fill={t.bubble}
            />
            {!isLeft && <circle cx={layout.w - 48} cy={y + rowH / 2} r={20} fill={t.bubble} />}
          </g>
        );
      })}
    </g>
  );
}

export function ScrollFab() {
  const t = useTokens();
  const layout = useLayout();
  const cx = layout.w - 56;
  const cy = layout.h - 56;
  return (
    <g>
      <circle cx={cx} cy={cy} r={28} fill={t.accent} />
      <path
        d={`M ${cx - 8} ${cy - 4} L ${cx} ${cy + 6} L ${cx + 8} ${cy - 4}`}
        stroke={t.onAccent}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx={cx + 16} cy={cy - 16} r={9} fill={t.danger} stroke={t.surface} strokeWidth={2} />
    </g>
  );
}

// === AI / rich content =====================================================

export function SourceList({ focusIndex }: { focusIndex?: number } = {}) {
  const t = useTokens();
  const layout = useLayout();
  const startY = 48;
  const cardH = 56;
  const gap = 12;
  return (
    <React.Fragment>
      <rect x={32} y={16} width={88} height={20} rx={6} fill={t.accent} />
      {[1, 2, 3].map((n, i) => {
        const y = startY + 16 + i * (cardH + gap);
        // When a source is focused, accent-stroke that card and dim the rest —
        // the same focus pattern the other gallery primitives use.
        const isFocused = focusIndex === i;
        const dimmed = focusIndex !== undefined && !isFocused;
        return (
          <g key={n} opacity={dimmed ? 0.4 : 1}>
            <rect
              x={32}
              y={y}
              width={layout.w - 64}
              height={cardH}
              rx={12}
              fill={t.surface}
              stroke={isFocused ? t.accent : t.accentLight}
              strokeWidth={isFocused ? 2 : 1}
            />
            <circle
              cx={48 + 16}
              cy={y + cardH / 2}
              r={14}
              fill={t.accent}
              stroke={t.accent}
              strokeWidth={1}
            />
            <rect
              x={48 + 16 - 3}
              y={y + cardH / 2 - 6}
              width={6}
              height={12}
              rx={1}
              fill={t.onAccent}
            />
            <rect
              x={48 + 40}
              y={y + 12}
              width={layout.w - 64 - 48 - 64}
              height={8}
              rx={4}
              fill={t.accent}
            />
            <rect
              x={48 + 40}
              y={y + 28}
              width={layout.w - 64 - 48 - 200}
              height={6}
              rx={3}
              fill={t.text}
            />
            <rect
              x={48 + 40}
              y={y + 40}
              width={layout.w - 64 - 48 - 280}
              height={6}
              rx={3}
              fill={t.text}
            />
          </g>
        );
      })}
    </React.Fragment>
  );
}

export function CodeBlock() {
  const t = useTokens();
  const layout = useLayout();
  const x = 32;
  const y = 32;
  const w = layout.w - 64;
  const h = layout.h - 64;
  const headH = 36;
  const lines = [
    [
      { w: 60, c: '#c084fc' },
      { w: 100, c: '#e2e8f0' },
      { w: 50, c: '#fbbf24' },
    ],
    [{ indent: 24 }, { w: 80, c: '#60a5fa' }, { w: 110, c: '#34d399' }],
    [{ indent: 24 }, { w: 60, c: '#60a5fa' }, { w: 90, c: '#fbbf24' }],
    [{ indent: 24 }, { w: 80, c: '#c084fc' }, { w: 70, c: '#34d399' }],
    [{ w: 30, c: '#94a3b8' }],
    [
      { w: 60, c: '#c084fc' },
      { w: 130, c: '#e2e8f0' },
    ],
  ];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={t.codeBg} />
      <rect x={x} y={y} width={w} height={headH} rx={12} fill={t.codeHead} />
      <rect x={x} y={y + headH - 12} width={w} height={12} fill={t.codeHead} />
      <rect x={x + 16} y={y + 10} width={56} height={16} rx={4} fill={t.accent} />
      <rect x={x + 88} y={y + 14} width={120} height={8} rx={4} fill="#94a3b8" />
      <rect x={x + w - 80} y={y + 8} width={64} height={20} rx={6} fill="#334155" />
      {lines.map((tokens, i) => {
        let cursor = x + 24;
        return (
          <g key={i}>
            {tokens.map((tok, j) => {
              if (tok.indent) {
                cursor += tok.indent;
                return null;
              }
              const node = (
                <rect
                  key={j}
                  x={cursor}
                  y={y + headH + 16 + i * 24}
                  width={tok.w!}
                  height={8}
                  rx={4}
                  fill={tok.c}
                />
              );
              cursor += tok.w! + 8;
              return node;
            })}
          </g>
        );
      })}
    </g>
  );
}

export function ConfirmationCard() {
  const t = useTokens();
  const layout = useLayout();
  const cardW = layout.w - 160;
  const cardH = layout.h - 120;
  const x = (layout.w - cardW) / 2;
  const y = (layout.h - cardH) / 2;
  return (
    <g>
      <rect x={x} y={y} width={cardW} height={cardH} rx={16} fill={t.surface} stroke={t.divider} />
      {/* Question icon */}
      <circle cx={x + 36} cy={y + 36} r={20} fill={t.accent} />
      <circle cx={x + 36} cy={y + 30} r={4} fill={t.onAccent} />
      <rect x={x + 33} y={y + 38} width={6} height={8} rx={2} fill={t.onAccent} />
      {/* Title + body */}
      <rect x={x + 72} y={y + 26} width={200} height={10} rx={5} fill={t.text} />
      <rect
        x={x + 24}
        y={y + 76}
        width={cardW - 48}
        height={6}
        rx={3}
        fill={t.text}
        opacity={0.7}
      />
      <rect
        x={x + 24}
        y={y + 92}
        width={cardW - 80}
        height={6}
        rx={3}
        fill={t.text}
        opacity={0.7}
      />
      {/* Action row */}
      <rect
        x={x + cardW - 220}
        y={y + cardH - 48}
        width={84}
        height={32}
        rx={16}
        fill={t.surface}
        stroke={t.divider}
      />
      <rect x={x + cardW - 200} y={y + cardH - 36} width={48} height={8} rx={4} fill={t.text} />
      <rect x={x + cardW - 124} y={y + cardH - 48} width={92} height={32} rx={16} fill={t.accent} />
      <rect x={x + cardW - 96} y={y + cardH - 36} width={50} height={8} rx={4} fill={t.onAccent} />
    </g>
  );
}

// === Atoms =================================================================

interface BarProps {
  x: number;
  y: number;
  w: number;
  h?: number;
  fill?: string;
  opacity?: number;
}

export function Bar({ x, y, w, h = 8, fill, opacity = 1 }: BarProps) {
  const t = useTokens();
  return (
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill ?? t.text} opacity={opacity} />
  );
}

interface AvatarProps {
  cx: number;
  cy: number;
  r?: number;
  variant?: 'accent' | 'soft' | 'muted';
}

export function Avatar({ cx, cy, r = 22, variant = 'soft' }: AvatarProps) {
  const t = useTokens();
  let fill: string;
  if (variant === 'soft') {
    fill = t.accentLight;
  } else if (variant === 'muted') {
    fill = t.bubble;
  } else {
    fill = t.accent;
  }
  return <circle cx={cx} cy={cy} r={r} fill={fill} />;
}

// === Error message =========================================================

export function ErrorMessage() {
  const t = useTokens();
  const layout = useLayout();
  const x = 24;
  const y = (layout.h - 96) / 2;
  const w = layout.w - 48;
  const h = 96;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill={t.dangerSoft}
        stroke={t.danger}
        strokeWidth={2}
      />
      {/* warning icon */}
      <circle cx={x + 28} cy={y + h / 2} r={14} fill={t.danger} />
      <rect x={x + 25} y={y + h / 2 - 6} width={6} height={8} rx={2} fill="#ffffff" />
      <circle cx={x + 28} cy={y + h / 2 + 4} r={2} fill="#ffffff" />
      {/* text + retry */}
      <rect x={x + 56} y={y + 24} width={180} height={8} rx={4} fill={t.danger} />
      <rect x={x + 56} y={y + 40} width={240} height={6} rx={3} fill={t.danger} opacity={0.6} />
      <rect x={x + 56} y={y + 52} width={140} height={6} rx={3} fill={t.danger} opacity={0.6} />
      <rect x={x + w - 96} y={y + h / 2 - 14} width={72} height={28} rx={14} fill={t.danger} />
      <rect x={x + w - 80} y={y + h / 2 - 4} width={40} height={8} rx={4} fill="#ffffff" />
    </g>
  );
}

// === Showcase helpers (single-component thumbs) ============================

/** Centers a fixed-height region vertically in its parent. */
export function Center({ children, h = 200 }: { children?: React.ReactNode; h?: number }) {
  const layout = useLayout();
  return (
    <Region y={(layout.h - h) / 2} w={layout.w} h={h}>
      {children}
    </Region>
  );
}

/** Large circular button centered — for SendButton/AttachButton thumbs. */
export function BigDisc({
  icon,
  variant = 'accent',
  size = 120,
}: {
  icon: 'send' | 'paperclip';
  variant?: 'accent' | 'soft';
  size?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const cx = layout.w / 2;
  const cy = layout.h / 2;
  const fill = variant === 'accent' ? t.accent : t.bubble;
  const glyphColor = variant === 'accent' ? t.onAccent : t.accent;
  return (
    <g>
      {/* Halo ring */}
      <circle cx={cx} cy={cy} r={size / 2 + 16} fill={t.accentSoft} />
      <circle cx={cx} cy={cy} r={size / 2} fill={fill} />
      {icon === 'send' && <SendGlyph cx={cx} cy={cy} size={size * 0.5} color={glyphColor} />}
      {icon === 'paperclip' && (
        <PaperclipGlyph cx={cx} cy={cy} size={size * 0.55} color={glyphColor} />
      )}
    </g>
  );
}

function SendGlyph({
  cx,
  cy,
  size,
  color,
}: {
  cx: number;
  cy: number;
  size: number;
  color: string;
}) {
  const s = size / 24;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
      <path
        d="M22 2L11 13"
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2l-7 20-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function PaperclipGlyph({
  cx,
  cy,
  size,
  color,
}: {
  cx: number;
  cy: number;
  size: number;
  color: string;
}) {
  const s = size / 24;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.42 17.41a2 2 0 01-2.83-2.83l8.49-8.48"
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Large avatar circle centered. */
export function BigAvatar({
  size = 140,
  variant = 'accent',
  online = false,
}: {
  size?: number;
  variant?: 'accent' | 'soft' | 'muted';
  online?: boolean;
}) {
  const t = useTokens();
  const layout = useLayout();
  const cx = layout.w / 2;
  const cy = layout.h / 2;
  let fill: string;
  if (variant === 'accent') {
    fill = t.accent;
  } else if (variant === 'soft') {
    fill = t.accentLight;
  } else {
    fill = t.bubble;
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={size / 2 + 16} fill={t.accentSoft} />
      <circle cx={cx} cy={cy} r={size / 2} fill={fill} />
      {online && (
        <circle
          cx={cx + size / 2 - 12}
          cy={cy + size / 2 - 12}
          r={14}
          fill={t.success ? '#22c55e' : '#22c55e'}
          stroke={t.surface}
          strokeWidth={3}
        />
      )}
    </g>
  );
}

/** Centered single bubble — for ChatMessage / ChatMessageContent thumbs. */
export function CenteredBubble({
  variant = 'incoming',
  text = 4,
  width,
  height = 180,
}: {
  variant?: 'incoming' | 'outgoing';
  text?: number;
  width?: number;
  height?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const w = width ?? Math.min(layout.w * 0.7, 540);
  const x = (layout.w - w) / 2;
  const y = (layout.h - height) / 2;
  const isOutgoing = variant === 'outgoing';
  const fill = isOutgoing ? t.accent : t.accentSoft;
  const lineColor = isOutgoing ? t.onAccent : t.accent;
  const ratios = [1, 0.85, 0.65, 0.45, 0.7];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={height}
        rx={16}
        fill={fill}
        stroke={isOutgoing ? t.accent : t.accentLight}
        strokeWidth={1}
      />
      {Array.from({ length: text }, (_, i) => (
        <rect
          key={i}
          x={x + 24}
          y={y + 28 + i * 22}
          width={(w - 48) * ratios[i % ratios.length]}
          height={10}
          rx={5}
          fill={lineColor}
          opacity={isOutgoing ? 0.7 : 1}
        />
      ))}
    </g>
  );
}

/** Centered prominent bar — for Title/Subtitle/Label/HelperText thumbs. */
export function CenteredBar({
  tone = 'accent',
  wRatio = 0.55,
  h = 18,
  caption,
}: {
  tone?: 'accent' | 'text' | 'soft';
  wRatio?: number;
  h?: number;
  caption?: 'title' | 'subtitle';
}) {
  const t = useTokens();
  const layout = useLayout();
  const w = layout.w * wRatio;
  const x = (layout.w - w) / 2;
  const y = (layout.h - h) / 2;
  let fill: string;
  if (tone === 'accent') {
    fill = t.accent;
  } else if (tone === 'soft') {
    fill = t.accentLight;
  } else {
    fill = t.text;
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
      {caption === 'subtitle' && (
        <rect
          x={x + 32}
          y={y + h + 14}
          width={w * 0.4}
          height={h * 0.6}
          rx={4}
          fill={t.text}
          opacity={0.5}
        />
      )}
      {caption === 'title' && (
        <rect
          x={x + 16}
          y={y - h - 14}
          width={w * 0.3}
          height={h * 0.5}
          rx={3}
          fill={t.text}
          opacity={0.4}
        />
      )}
    </g>
  );
}

/** A row of N action discs centered — for ToolbarThumb / HeaderActions thumbs. */
export function ActionDiscRow({
  count = 3,
  variant = 'accent',
  size = 56,
  gap = 24,
}: {
  count?: number;
  variant?: 'accent' | 'soft';
  size?: number;
  gap?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const totalW = count * size + (count - 1) * gap;
  const startX = (layout.w - totalW) / 2 + size / 2;
  const cy = layout.h / 2;
  const fill = variant === 'accent' ? t.accent : t.bubble;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={startX + i * (size + gap)} cy={cy} r={size / 2} fill={fill} />
      ))}
    </g>
  );
}

/** Row of attachment chips centered — for ChatComposerAttachmentList thumb. */
export function AttachmentRow({
  count = 3,
  chipW = 180,
  chipH = 64,
  gap = 18,
}: {
  count?: number;
  chipW?: number;
  chipH?: number;
  gap?: number;
}) {
  const t = useTokens();
  const layout = useLayout();
  const totalW = count * chipW + (count - 1) * gap;
  const startX = (layout.w - totalW) / 2;
  const y = (layout.h - chipH) / 2;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <rect
            x={startX + i * (chipW + gap)}
            y={y}
            width={chipW}
            height={chipH}
            rx={12}
            fill={t.accentSoft}
            stroke={t.accent}
            strokeWidth={1.5}
          />
          <rect
            x={startX + i * (chipW + gap) + 16}
            y={y + 16}
            width={32}
            height={32}
            rx={6}
            fill={t.accent}
          />
          <rect
            x={startX + i * (chipW + gap) + 60}
            y={y + 18}
            width={chipW - 76}
            height={8}
            rx={4}
            fill={t.accent}
            opacity={0.7}
          />
          <rect
            x={startX + i * (chipW + gap) + 60}
            y={y + 36}
            width={chipW - 100}
            height={6}
            rx={3}
            fill={t.accent}
            opacity={0.4}
          />
        </g>
      ))}
    </g>
  );
}

/** A single message row centered (avatar + bubble) — for ChatMessage thumb. */
export function CenteredMessageRow({
  side = 'left',
  showAuthor = false,
  showMeta = false,
  showActions = false,
  showInlineMeta = false,
  focus,
}: {
  side?: 'left' | 'right';
  showAuthor?: boolean;
  showMeta?: boolean;
  showActions?: boolean;
  showInlineMeta?: boolean;
  focus?: 'all' | 'avatar' | 'content' | 'meta' | 'inline-meta' | 'actions' | 'author';
}) {
  const layout = useLayout();
  const totalH = 56 + (showMeta ? 24 : 0) + (showActions ? 32 : 0) + (showAuthor ? 28 : 0);
  return (
    <Region y={(layout.h - totalH) / 2 - (showAuthor ? 14 : 0)} w={layout.w} h={totalH}>
      <Region x={48} w={layout.w - 96} h={totalH}>
        <MessageRow
          side={side}
          h={56}
          focus={focus}
          showAuthor={showAuthor}
          showMeta={showMeta}
          showActions={showActions}
          showInlineMeta={showInlineMeta}
        />
      </Region>
    </Region>
  );
}

/** Standalone header centered vertically — for header-family thumbs. */
export function StandaloneHeader({ focus, h = 100 }: { focus?: HeaderFocus; h?: number }) {
  const layout = useLayout();
  return (
    <Region y={(layout.h - h) / 2} w={layout.w} h={h}>
      <Header focus={focus} h={h} />
    </Region>
  );
}

// Re-exports for convenience
export { useTokens };
