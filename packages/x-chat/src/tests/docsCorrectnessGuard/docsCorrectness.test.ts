import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  ALLOWED_SPECIFIERS,
  CHAT_DOCS_DIR,
  ENTRY_POINTS,
  workspaceRoot,
} from './entryPoints';
import { type ExportSurface, getExportSurfaces } from './exportSurface';
import {
  extractCodeFences,
  extractFrontmatter,
  isTsLikeLang,
  type Frontmatter,
} from './extractMarkdown';
import { extractChatImports, type ChatImport } from './extractImports';

interface Violation {
  /** Workspace-relative file path. */
  file: string;
  /** Where the violation was found, for the runtime report. */
  where: string;
  /** The formatted, multi-line message. */
  message: string;
}

let surfaces: Map<string, ExportSurface>;

function relative(absolutePath: string): string {
  return path.relative(workspaceRoot, absolutePath);
}

// Recursively collect files under `dir` matching `predicate`.
function collectFiles(dir: string, predicate: (file: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectFiles(full, predicate));
    } else if (entry.isFile() && predicate(full)) {
      out.push(full);
    }
  }
  return out.sort();
}

const markdownFiles = (): string[] =>
  collectFiles(CHAT_DOCS_DIR, (file) => file.endsWith('.md'));

const demoTsxFiles = (): string[] =>
  // `.js` twins are generated from these `.tsx` by `pnpm docs:typescript:formatted`,
  // so they are skipped here to avoid double-reporting.
  collectFiles(CHAT_DOCS_DIR, (file) => file.endsWith('.tsx'));

/**
 * Probe the other allowed entry points for `name`, to power the "did you mean"
 * hint. Returns the specifiers that DO export `name`.
 */
function entryPointsThatExport(name: string, exclude: string): string[] {
  const hits: string[] = [];
  for (const specifier of ALLOWED_SPECIFIERS) {
    if (specifier === exclude) {
      continue;
    }
    if (surfaces.get(specifier)?.has(name)) {
      hits.push(specifier);
    }
  }
  return hits;
}

function didYouMeanHint(name: string, statedSpecifier: string): string {
  const hits = entryPointsThatExport(name, statedSpecifier);
  if (hits.length === 0) {
    return '';
  }
  return `\n  Did you mean ${hits.map((s) => `'${s}'`).join(' or ')}? (exported there)`;
}

// Validate one chat import declaration, pushing any violations.
function validateImport(
  chatImport: ChatImport,
  file: string,
  whereLabel: (line: number) => string,
  violations: Violation[],
): void {
  const { specifier } = chatImport;

  // Entry point must be on the docs allowlist.
  if (!(specifier in ENTRY_POINTS)) {
    violations.push({
      file,
      where: whereLabel(chatImport.line),
      message:
        `Import from '${specifier}' is not allowed in docs ` +
        `(allowlist: ${ALLOWED_SPECIFIERS.map((s) => `'${s}'`).join(', ')}).`,
    });
    return;
  }

  // Default imports always fail — none of these packages has a default export.
  if (chatImport.hasDefault) {
    violations.push({
      file,
      where: whereLabel(chatImport.line),
      message: `Default import from '${specifier}' is invalid — it has no default export.`,
    });
  }

  // Namespace imports and bare side-effect imports always pass.
  const surface = surfaces.get(specifier)!;
  for (const named of chatImport.names) {
    if (!surface.has(named.imported)) {
      violations.push({
        file,
        where: whereLabel(named.line),
        message: `'${named.imported}' is not exported from '${specifier}'.${didYouMeanHint(
          named.imported,
          specifier,
        )}`,
      });
    }
  }
}

function formatReport(violations: Violation[]): string {
  const lines = violations.map((v) => `${v.file} (${v.where})\n  ${v.message}`);
  return (
    `MUI X Chat docs-correctness guard found ${violations.length} problem(s):\n\n` +
    `${lines.join('\n\n')}\n`
  );
}

beforeAll(() => {
  surfaces = getExportSurfaces();
});

describe('x-chat docs correctness', () => {
  it('every @mui/x-chat* import in a markdown code fence resolves to a real export', () => {
    const violations: Violation[] = [];

    for (const absFile of markdownFiles()) {
      const file = relative(absFile);
      const content = fs.readFileSync(absFile, 'utf8');
      for (const fence of extractCodeFences(content)) {
        if (!isTsLikeLang(fence.lang)) {
          continue;
        }
        const imports = extractChatImports(fence.code, fence.startLine - 1);
        for (const chatImport of imports) {
          validateImport(
            chatImport,
            file,
            (line) => `code block, line ${line}`,
            violations,
          );
        }
      }
    }

    expect(violations.length, violations.length ? formatReport(violations) : '').toBe(0);
  });

  it('every @mui/x-chat* import in a colocated demo .tsx resolves to a real export', () => {
    const violations: Violation[] = [];

    for (const absFile of demoTsxFiles()) {
      const file = relative(absFile);
      const content = fs.readFileSync(absFile, 'utf8');
      const imports = extractChatImports(content, 0);
      for (const chatImport of imports) {
        validateImport(chatImport, file, (line) => `line ${line}`, violations);
      }
    }

    expect(violations.length, violations.length ? formatReport(violations) : '').toBe(0);
  });

  it('every frontmatter components:/hooks: entry is a value export of the page packageName', () => {
    const violations: Violation[] = [];

    for (const absFile of markdownFiles()) {
      const file = relative(absFile);
      const content = fs.readFileSync(absFile, 'utf8');
      const frontmatter = extractFrontmatter(content);
      if (!frontmatter) {
        continue;
      }
      validateFrontmatter(frontmatter, file, violations);
    }

    expect(violations.length, violations.length ? formatReport(violations) : '').toBe(0);
  });
});

function validateFrontmatter(
  frontmatter: Frontmatter,
  file: string,
  violations: Violation[],
): void {
  const specifier = frontmatter.packageName ?? '@mui/x-chat';

  if (!(specifier in ENTRY_POINTS)) {
    if (frontmatter.components.length > 0 || frontmatter.hooks.length > 0) {
      violations.push({
        file,
        where: 'frontmatter',
        message:
          `packageName '${specifier}' is not allowed in docs ` +
          `(allowlist: ${ALLOWED_SPECIFIERS.map((s) => `'${s}'`).join(', ')}).`,
      });
    }
    return;
  }

  const surface = surfaces.get(specifier)!;

  const checkEntries = (entries: string[], header: 'components' | 'hooks', line?: number) => {
    for (const name of entries) {
      const info = surface.get(name);
      // The header must be a *value* export: a type-only match (interface) does
      // not satisfy a `components:`/`hooks:` entry, which renders an API link.
      if (!info || !info.isValue) {
        violations.push({
          file,
          where: `frontmatter${line ? `, line ${line}` : ''}`,
          message: `${header}: '${name}' is not exported from '${specifier}' (packageName).${didYouMeanHint(
            name,
            specifier,
          )}\n  Either change the frontmatter packageName or remove the entry.`,
        });
      }
    }
  };

  checkEntries(frontmatter.components, 'components', frontmatter.componentsLine);
  checkEntries(frontmatter.hooks, 'hooks', frontmatter.hooksLine);
}
