import * as React from 'react';

export function formatStructuredValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function shouldCollapsePayload(text: string): boolean {
  return text.length > 320 || text.split('\n').length > 8;
}

export function safeUri(uri: string | null | undefined): string {
  if (uri == null || uri === '') {
    return '';
  }

  try {
    const trimmed = uri.trim();

    if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
      return trimmed;
    }

    const parsed = new URL(trimmed, 'https://mui.com');
    const protocol = parsed.protocol.toLowerCase();

    if (
      protocol === 'http:' ||
      protocol === 'https:' ||
      protocol === 'mailto:' ||
      protocol === 'tel:'
    ) {
      return trimmed;
    }

    return '';
  } catch {
    return '';
  }
}

export function normalizeMarkdownForRender(markdown: string): string {
  const fenceMatches = markdown.match(/```/g);

  if ((fenceMatches?.length ?? 0) % 2 === 1) {
    return `${markdown}\n\`\`\``;
  }

  return markdown;
}

export function extractLanguage(className: string | undefined): string {
  const match = /language-([^\s]+)/.exec(className ?? '');

  return match?.[1]?.trim().toLowerCase() ?? '';
}

export function normalizeCodeContent(value: React.ReactNode): string {
  const text = React.Children.toArray(value).join('');

  return text.replace(/\n$/, '');
}
