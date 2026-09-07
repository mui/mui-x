import * as React from 'react';
import { Card, ThumbCanvas, useTokens } from './primitives';

/**
 * Composer family — every thumb shows ONLY its slot, on a single surface.
 * No nested card-in-card chrome.
 */

const W = 736;
const H = 436;

// === ChatComposer — full composer surface ====================================

export function ChatComposerThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <ComposerSurface />
      </Card>
    </ThumbCanvas>
  );
}

function ComposerSurface() {
  const t = useTokens();
  const cardW = W - 64;
  const cardH = 260;
  const cardX = 32;
  const cardY = (H - cardH) / 2;
  const padding = 20;
  const toolbarH = 56;
  const buttonR = (toolbarH - 16) / 2;

  return (
    <g>
      {/* Composer card */}
      <rect
        x={cardX}
        y={cardY}
        width={cardW}
        height={cardH}
        rx={20}
        fill={t.surface}
        stroke={t.divider}
        strokeWidth={1}
      />

      {/* Textarea region (text lines + cursor) */}
      {[0, 1, 2].map((i) => {
        const widths = [cardW - padding * 2 - 40, cardW - padding * 2 - 140, 200];
        return (
          <rect
            key={i}
            x={cardX + padding}
            y={cardY + padding + i * 20}
            width={widths[i]}
            height={8}
            rx={4}
            fill={t.text}
          />
        );
      })}
      {/* Cursor */}
      <rect
        x={cardX + padding + 200 + 8}
        y={cardY + padding + 2 * 20 - 4}
        width={2}
        height={16}
        fill={t.accent}
      />

      {/* Toolbar row */}
      {/* Attach button (left) */}
      <circle
        cx={cardX + padding + buttonR}
        cy={cardY + cardH - padding - buttonR}
        r={buttonR}
        fill={t.muted}
        stroke={t.divider}
        strokeWidth={1}
      />
      <PaperclipMini
        cx={cardX + padding + buttonR}
        cy={cardY + cardH - padding - buttonR}
        color={t.iconMuted ?? '#9ca3af'}
      />

      {/* Send button (right) */}
      <circle
        cx={cardX + cardW - padding - buttonR}
        cy={cardY + cardH - padding - buttonR}
        r={buttonR}
        fill={t.accent}
      />
      <SendMini
        cx={cardX + cardW - padding - buttonR}
        cy={cardY + cardH - padding - buttonR}
        color={t.onAccent}
      />
    </g>
  );
}

// === ChatComposerToolbar — standalone toolbar pill ===========================

export function ChatComposerToolbarThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <StandaloneToolbar />
      </Card>
    </ThumbCanvas>
  );
}

function StandaloneToolbar() {
  const t = useTokens();
  const w = W - 96;
  const h = 80;
  const x = (W - w) / 2;
  const y = (H - h) / 2;
  const buttonR = 22;
  const padding = 16;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        fill={t.surface}
        stroke={t.divider}
        strokeWidth={1}
      />
      {/* Left actions */}
      <circle
        cx={x + padding + buttonR}
        cy={y + h / 2}
        r={buttonR}
        fill={t.muted}
        stroke={t.divider}
        strokeWidth={1}
      />
      <PaperclipMini cx={x + padding + buttonR} cy={y + h / 2} color={t.iconMuted ?? '#9ca3af'} />
      <circle
        cx={x + padding + buttonR + 56}
        cy={y + h / 2}
        r={buttonR}
        fill={t.muted}
        stroke={t.divider}
        strokeWidth={1}
      />
      <PlusMini cx={x + padding + buttonR + 56} cy={y + h / 2} color={t.iconMuted ?? '#9ca3af'} />
      {/* Send (right) */}
      <circle cx={x + w - padding - buttonR} cy={y + h / 2} r={buttonR} fill={t.accent} />
      <SendMini cx={x + w - padding - buttonR} cy={y + h / 2} color={t.onAccent} />
    </g>
  );
}

// === ChatComposerAttachmentList — file chips ===============================

export function ChatComposerAttachmentListThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <AttachmentChips />
      </Card>
    </ThumbCanvas>
  );
}

function AttachmentChips() {
  const t = useTokens();
  const chipW = 280;
  const chipH = 64;
  const gap = 16;
  const total = 3 * chipH + 2 * gap;
  const x = (W - chipW) / 2;
  const startY = (H - total) / 2;
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const y = startY + i * (chipH + gap);
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={chipW}
              height={chipH}
              rx={12}
              fill={t.surface}
              stroke={t.divider}
              strokeWidth={1}
            />
            {/* File icon */}
            <rect x={x + 16} y={y + 14} width={36} height={36} rx={6} fill={t.accent} />
            {/* Name + size */}
            <rect x={x + 64} y={y + 18} width={chipW - 96} height={8} rx={4} fill={t.text} />
            <rect
              x={x + 64}
              y={y + 36}
              width={chipW - 160}
              height={6}
              rx={3}
              fill={t.text}
              opacity={0.6}
            />
          </g>
        );
      })}
    </g>
  );
}

// === Mini icons (rendered at button-scale) ==================================

function SendMini({
  cx,
  cy,
  color,
  size = 18,
}: {
  cx: number;
  cy: number;
  color: string;
  size?: number;
}) {
  const s = size / 24;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
      <path
        d="M22 2L11 13"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2l-7 20-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function PaperclipMini({
  cx,
  cy,
  color,
  size = 18,
}: {
  cx: number;
  cy: number;
  color: string;
  size?: number;
}) {
  const s = size / 24;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.42 17.41a2 2 0 01-2.83-2.83l8.49-8.48"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function PlusMini({
  cx,
  cy,
  color,
  size = 18,
}: {
  cx: number;
  cy: number;
  color: string;
  size?: number;
}) {
  const s = size / 24;
  return (
    <g transform={`translate(${cx - 12 * s}, ${cy - 12 * s}) scale(${s})`}>
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}
