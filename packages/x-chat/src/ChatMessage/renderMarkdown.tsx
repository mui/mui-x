'use client';
import * as React from 'react';
import { normalizeMarkdownForRender } from '@mui/x-chat-headless/internals';
import { ChatCodeBlock } from '../ChatCodeBlock';

// ---------------------------------------------------------------------------
// Inline parser — bold, italic, inline-code, links
// ---------------------------------------------------------------------------

const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:'];

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (SAFE_URL_PROTOCOLS.includes(parsed.protocol)) {
      return url;
    }
  } catch {
    // Relative URLs (no protocol) are allowed through as-is
    if (!url.includes(':')) {
      return url;
    }
  }
  return '#';
}

type InlinePattern = {
  find: (text: string) => InlineMatch | null;
};

type InlineMatch = {
  index: number;
  length: number;
  render: (key: number) => React.ReactNode;
};

function createRegexInlinePattern(
  regex: RegExp,
  render: (match: RegExpExecArray, key: number) => React.ReactNode,
): InlinePattern {
  return {
    find(text) {
      const match = regex.exec(text);

      if (!match) {
        return null;
      }

      return {
        index: match.index,
        length: match[0].length,
        render: (key) => render(match, key),
      };
    },
  };
}

function findBalancedParenthesisEnd(text: string, start: number) {
  let depth = 0;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      if (depth === 0) {
        return i;
      }
      depth -= 1;
    }
  }

  return -1;
}

function createLinkInlinePattern({ image }: { image: boolean }): InlinePattern {
  return {
    find(text) {
      let startIndex = image ? text.indexOf('![') : text.indexOf('[');

      while (startIndex !== -1) {
        if (!image && text[startIndex - 1] === '!') {
          startIndex = text.indexOf('[', startIndex + 1);
          continue;
        }

        const labelStart = startIndex + (image ? 2 : 1);
        const labelEnd = text.indexOf(']', labelStart);

        if (labelEnd === -1 || text[labelEnd + 1] !== '(') {
          startIndex = text.indexOf(image ? '![' : '[', startIndex + 1);
          continue;
        }

        const urlStart = labelEnd + 2;
        const urlEnd = findBalancedParenthesisEnd(text, urlStart);

        if (urlEnd === -1) {
          startIndex = text.indexOf(image ? '![' : '[', startIndex + 1);
          continue;
        }

        const label = text.slice(labelStart, labelEnd);
        const url = text.slice(urlStart, urlEnd);

        return {
          index: startIndex,
          length: urlEnd + 1 - startIndex,
          render: (key) =>
            image ? (
              <img key={key} src={sanitizeUrl(url)} alt={label} />
            ) : (
              <a key={key} href={sanitizeUrl(url)} target="_blank" rel="noopener noreferrer">
                {parseInline(label)}
              </a>
            ),
        };
      }

      return null;
    },
  };
}

const INLINE_PATTERNS: InlinePattern[] = [
  createLinkInlinePattern({ image: true }),
  createLinkInlinePattern({ image: false }),
  {
    // Bold: **text** or __text__
    ...createRegexInlinePattern(/\*\*(.+?)\*\*|__(.+?)__/, (m, k) => (
      <strong key={k}>{parseInline(m[1] ?? m[2])}</strong>
    )),
  },
  createRegexInlinePattern(
    // Inline code: `text` — before italic so backtick content is not parsed further
    /`([^`]+)`/,
    (m, k) => <code key={k}>{m[1]}</code>,
  ),
  {
    // Italic: *text* or _text_ (not preceded/followed by same char)
    ...createRegexInlinePattern(
      /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/,
      (m, k) => <em key={k}>{parseInline(m[1] ?? m[2])}</em>,
    ),
  },
  createRegexInlinePattern(
    // Footnote citation: [^1] → superscript marker
    /\[\^(\d+)\]/,
    (m, k) => <sup key={k}>[{m[1]}]</sup>,
  ),
];

function parseInline(text: string): React.ReactNode {
  if (!text) {
    return null;
  }

  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let firstMatch: InlineMatch | null = null;

    for (const pattern of INLINE_PATTERNS) {
      const m = pattern.find(remaining);
      if (m && (firstMatch === null || m.index < firstMatch.index)) {
        firstMatch = m;
      }
    }

    if (!firstMatch) {
      result.push(remaining);
      break;
    }

    if (firstMatch.index > 0) {
      result.push(remaining.slice(0, firstMatch.index));
    }
    result.push(firstMatch.render(key));
    key += 1;
    remaining = remaining.slice(firstMatch.index + firstMatch.length);
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
    /^```/.test(line) || /^#{1,6}\s/.test(line) || /^[-*+]\s/.test(line) || /^\d+\.\s/.test(line)
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
        <ChatCodeBlock key={key} language={lang || undefined}>
          {codeLines.join('\n')}
        </ChatCodeBlock>,
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
        items.push(<li key={key}>{parseInline(lines[i].replace(/^[-*+]\s+/, ''))}</li>);
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
        items.push(<li key={key}>{parseInline(lines[i].replace(/^\d+\.\s+/, ''))}</li>);
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
