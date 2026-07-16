'use client';
import * as React from 'react';
import Markdown, { RuleType } from 'markdown-to-jsx';
import type { MarkdownToJSX } from 'markdown-to-jsx';
import { useMessageContentTabIndex } from '@mui/x-chat-headless';
import { normalizeMarkdownForRender } from '@mui/x-chat-headless/internals';
import { ChatCodeBlock } from '../ChatCodeBlock';
import { useStreamingMarkdownRepair } from '../internals/streamingMarkdownRepair';

// Kept in sync with the headless `safeUri` allow-list so links behave the same
// across markdown and source/file parts.
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

// Applied by markdown-to-jsx to every link `href` / image `src`. Returns the value
// when safe, or `null` to drop the attribute — so a `javascript:`/`data:`/
// protocol-relative URL (or remend's `streamdown:incomplete-link` placeholder for a
// half-streamed link) renders as inert text rather than a navigable target.
const sanitizer: NonNullable<MarkdownToJSX.Options['sanitizer']> = (value) => {
  try {
    const parsed = new URL(value);
    return SAFE_URL_PROTOCOLS.includes(parsed.protocol) ? value : null;
  } catch {
    // Relative URLs (no scheme) are allowed; reject protocol-relative `//host`,
    // which resolves to an external origin despite carrying no explicit scheme.
    if (!value.includes(':') && !/^[/\\]{2}/.test(value)) {
      return value;
    }
    return null;
  }
};

// Markdown links open in a new tab (the sanitizer above already neutralised the
// href) and participate in the message list's drill-in model: inside a roving
// list they stay out of the tab order until the user drills into the message
// with Enter, keeping the whole list a single Tab stop. Mouse clicks work
// throughout, and outside a roving list the tab order is untouched.
function MarkdownLink({ children, ...other }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const contentTabIndex = useMessageContentTabIndex();
  return (
    <a target="_blank" rel="noopener noreferrer" tabIndex={contentTabIndex} {...other}>
      {children}
    </a>
  );
}

const markdownOptions: MarkdownToJSX.Options = {
  // Always emit block-level wrappers (so a lone line becomes a `<p>`, matching the
  // chat bubble's `& p`/`& pre` styling), but use a Fragment wrapper so no extra
  // DOM node is introduced around multi-block content.
  forceBlock: true,
  wrapper: React.Fragment,
  // Untrusted model output: never transcribe raw HTML into JSX.
  disableParsingRawHTML: true,
  sanitizer,
  overrides: {
    a: { component: MarkdownLink },
  },
  // Route fenced code blocks to the themed ChatCodeBlock, which owns the copy
  // button, language label, and optional highlighter slot.
  renderRule(next, node, _renderChildren, state) {
    if (node.type === RuleType.codeBlock) {
      return (
        <ChatCodeBlock key={state.key} language={node.lang || undefined}>
          {node.text}
        </ChatCodeBlock>
      );
    }
    return next();
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Renders a markdown string to React elements via `markdown-to-jsx`. Output stays
 * XSS-safe by construction (React elements, no `dangerouslySetInnerHTML`); only
 * link/image URLs are guarded, by {@link sanitizer}.
 */
export function renderMarkdown(text: string): React.ReactNode {
  return <Markdown options={markdownOptions}>{normalizeMarkdownForRender(text)}</Markdown>;
}

/**
 * Streaming-aware markdown text part used as the default `renderText`. Repairs
 * incomplete markdown before rendering — via `remend` once it has lazily loaded,
 * and the dep-free fallback (unbalanced-fence completion) until then — so partial
 * syntax arriving mid-stream renders cleanly instead of leaking raw markers.
 */
function StreamingMarkdownText({ text }: { text: string }): React.ReactElement {
  const repair = useStreamingMarkdownRepair();
  const source = React.useMemo(() => repair(text), [repair, text]);
  return <Markdown options={markdownOptions}>{source}</Markdown>;
}

/**
 * Default `renderText` for the `text` part. Stable module-level identity so it does
 * not churn the headless `TextPart` `useMemo`.
 */
export const renderStreamingMarkdown = (text: string): React.ReactNode => (
  <StreamingMarkdownText text={text} />
);
