export interface CodeFence {
  /** The code inside the fence (without the fence lines). */
  code: string;
  /** The fence's info-string language (`ts`, `tsx`, `js`, `jsx`, …). */
  lang: string;
  /** 1-based line number of the first line of code inside the fence. */
  startLine: number;
}

export interface Frontmatter {
  /** The `packageName:` value, or `undefined` when absent. */
  packageName?: string;
  /** Parsed `components:` entries. */
  components: string[];
  /** Parsed `hooks:` entries. */
  hooks: string[];
  /** 1-based line of the `components:` header (for runtime output). */
  componentsLine?: number;
  /** 1-based line of the `hooks:` header (for runtime output). */
  hooksLine?: number;
}

const TS_LIKE_LANGS = new Set(['ts', 'tsx', 'js', 'jsx', 'typescript', 'javascript']);

/** Languages this guard inspects (the rest — bash, json, css, yaml, … — are skipped). */
export function isTsLikeLang(lang: string): boolean {
  return TS_LIKE_LANGS.has(lang.trim().toLowerCase());
}

/**
 * Line-based fenced-code-block scanner. Tracks the opening line so violations can
 * be reported against the source file, and supports both ``` and ~~~ fences of
 * arbitrary length (so nested four-backtick wrappers in our docs don't confuse
 * the scanner). Only the language from the opening info string is reported; the
 * caller decides which languages to inspect.
 */
export function extractCodeFences(content: string): CodeFence[] {
  const lines = content.split('\n');
  const fences: CodeFence[] = [];

  let inFence = false;
  let fenceChar = '';
  let fenceLen = 0;
  let lang = '';
  let codeLines: string[] = [];
  let startLine = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);

    if (!inFence) {
      if (fenceMatch) {
        inFence = true;
        fenceChar = fenceMatch[2][0];
        fenceLen = fenceMatch[2].length;
        // The info string's first token is the language.
        lang = fenceMatch[3].trim().split(/\s+/)[0] ?? '';
        codeLines = [];
        startLine = i + 2; // first code line is the next source line (1-based)
      }
      continue;
    }

    // Inside a fence: a closing fence is the same char, at least as long, with nothing else.
    const closeMatch = line.match(/^(\s*)(`{3,}|~{3,})\s*$/);
    if (closeMatch && closeMatch[2][0] === fenceChar && closeMatch[2].length >= fenceLen) {
      fences.push({ code: codeLines.join('\n'), lang, startLine });
      inFence = false;
      lang = '';
      continue;
    }
    codeLines.push(line);
  }

  return fences;
}

function parseScalarList(value: string): string[] {
  return value
    .replace(/['"]/g, '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Extract the frontmatter `packageName` / `components` / `hooks` headers from a
 * markdown file. These headers are flat `key: value` scalar lines, so a minimal
 * line parser is sufficient (no YAML dependency). Returns `undefined` when the
 * file has no `---` frontmatter block.
 */
export function extractFrontmatter(content: string): Frontmatter | undefined {
  const lines = content.split('\n');
  if (lines[0]?.trim() !== '---') {
    return undefined;
  }

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return undefined;
  }

  const result: Frontmatter = { components: [], hooks: [] };

  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    const match = line.match(/^(packageName|components|hooks):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    if (key === 'packageName') {
      result.packageName = value.replace(/['"]/g, '').trim();
    } else if (key === 'components') {
      result.components = parseScalarList(value);
      result.componentsLine = i + 1;
    } else if (key === 'hooks') {
      result.hooks = parseScalarList(value);
      result.hooksLine = i + 1;
    }
  }

  return result;
}
