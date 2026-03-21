'use client';
import * as React from 'react';
import { normalizeMarkdownForRender } from '@mui/x-chat-unstyled';

// ---------------------------------------------------------------------------
// Inline parser — bold, italic, inline-code, links
// ---------------------------------------------------------------------------

type InlinePattern = {
  regex: RegExp;
  render: (match: RegExpExecArray, key: number) => React.ReactNode;
};

const INLINE_PATTERNS: InlinePattern[] = [
  {
    // Bold: **text** or __text__
    regex: /\*\*(.+?)\*\*|__(.+?)__/,
    render: (m, k) => <strong key={k}>{parseInline(m[1] ?? m[2])}</strong>,
  },
  {
    // Inline code: `text` — before italic so backtick content is not parsed further
    regex: /`([^`]+)`/,
    render: (m, k) => <code key={k}>{m[1]}</code>,
  },
  {
    // Italic: *text* or _text_ (not preceded/followed by same char)
    regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/,
    render: (m, k) => <em key={k}>{parseInline(m[1] ?? m[2])}</em>,
  },
  {
    // Link: [label](url)
    regex: /\[([^\]]+)\]\(([^)]+)\)/,
    render: (m, k) => (
      <a key={k} href={m[2]} target="_blank" rel="noopener noreferrer">
        {m[1]}
      </a>
    ),
  },
];

function parseInline(text: string): React.ReactNode {
  if (!text) {
    return null;
  }

  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let firstMatch: RegExpExecArray | null = null;
    let firstPattern: InlinePattern | null = null;

    for (const pattern of INLINE_PATTERNS) {
      const m = pattern.regex.exec(remaining);
      if (m && (firstMatch === null || m.index < firstMatch.index)) {
        firstMatch = m;
        firstPattern = pattern;
      }
    }

    if (!firstMatch || !firstPattern) {
      result.push(remaining);
      break;
    }

    if (firstMatch.index > 0) {
      result.push(remaining.slice(0, firstMatch.index));
    }
    result.push(firstPattern.render(firstMatch, key));
    key += 1;
    remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
  }

  if (result.length === 0) {
    return null;
  }
  if (result.length === 1) {
    return result[0];
  }
  return <React.Fragment>{result}</React.Fragment>;
}

// ---------------------------------------------------------------------------
// Block parser — code fences, headers, lists, paragraphs
// ---------------------------------------------------------------------------

function isStructuralLine(line: string): boolean {
  return (
    /^```/.test(line) ||
    /^#{1,6}\s/.test(line) ||
    /^[-*+]\s/.test(line) ||
    /^\d+\.\s/.test(line)
  );
}

function parseBlocks(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    const fenceMatch = /^```(\w*)/.exec(line);
    if (fenceMatch) {
      const lang = fenceMatch[1];
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      result.push(
        <pre key={key}>
          <code className={lang ? `language-${lang}` : undefined}>{codeLines.join('\n')}</code>
        </pre>,
      );
      key += 1;
      continue;
    }

    const headerMatch = /^(#{1,6})\s+(.+)/.exec(line);
    if (headerMatch) {
      const level = headerMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      result.push(<Tag key={key}>{parseInline(headerMatch[2])}</Tag>);
      key += 1;
      i += 1;
      continue;
    }

    if (/^[-*+]\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(
          <li key={key}>{parseInline(lines[i].replace(/^[-*+]\s+/, ''))}</li>,
        );
        key += 1;
        i += 1;
      }
      result.push(<ul key={key}>{items}</ul>);
      key += 1;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={key}>{parseInline(lines[i].replace(/^\d+\.\s+/, ''))}</li>,
        );
        key += 1;
        i += 1;
      }
      result.push(<ol key={key}>{items}</ol>);
      key += 1;
      continue;
    }

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !isStructuralLine(lines[i])) {
      paraLines.push(lines[i]);
      i += 1;
    }

    if (paraLines.length > 0) {
      result.push(<p key={key}>{parseInline(paraLines.join('\n'))}</p>);
      key += 1;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function renderMarkdown(text: string): React.ReactNode {
  const normalized = normalizeMarkdownForRender(text);
  const blocks = parseBlocks(normalized);
  return blocks.length === 1 ? blocks[0] : <React.Fragment>{blocks}</React.Fragment>;
}
