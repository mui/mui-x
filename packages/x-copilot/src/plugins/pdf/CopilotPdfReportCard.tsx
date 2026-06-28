'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useMessage } from '@mui/x-chat-headless';
import { findToolPartByCallId, useCopilotPluginRenderContext } from '../core';
import { buildPdfReportState } from './buildState';
import {
  countPdfReportPages,
  extractPdfReportTitle,
  type PdfReportSpec,
  type PdfReportSpecElement,
  type PdfReportToolInput,
} from './spec';

interface CopilotPdfReportCardOwnerState {
  messageId: string;
  toolName: string;
  toolCallId: string;
  state: string;
}

interface CopilotPdfReportCardProps {
  className?: string;
  ownerState?: CopilotPdfReportCardOwnerState;
}

const CardRoot = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Root',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1.25, 1.5),
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  background: (theme.vars || theme).palette.background.paper,
  minWidth: 0,
}));

const CardBody = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Body',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
});

const Title = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Title',
})(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
}));

const Meta = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Meta',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  wordBreak: 'normal',
  overflowWrap: 'break-word',
}));

const Actions = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Actions',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(0.5),
  flexWrap: 'wrap',
}));

const ActionButton = styled('button', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Action',
})(({ theme }) => ({
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.25),
  borderRadius: theme.shape.borderRadius,
  textDecoration: 'none',
  ...theme.typography.body2,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.primary.main,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  background: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    background: (theme.vars || theme).palette.action.hover,
  },
  '&:disabled': {
    color: (theme.vars || theme).palette.text.disabled,
    cursor: 'not-allowed',
  },
}));

const SubtleButton = styled('button', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Regenerate',
})(({ theme }) => ({
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
  border: 'none',
  background: 'transparent',
  '&:hover': {
    background: (theme.vars || theme).palette.action.hover,
  },
  '&:disabled': {
    color: (theme.vars || theme).palette.text.disabled,
    cursor: 'not-allowed',
  },
}));

const Pending = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Pending',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  fontStyle: 'italic',
}));

const ErrorText = styled('div', {
  name: 'MuiCopilotPdfReportCard',
  slot: 'Error',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.error.main,
}));

interface PdfReportOutputMeta {
  title?: string;
  pageCount?: number;
  generatedAt?: string;
}

function formatTimestamp(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface BrowserRenderer {
  jsonRender: typeof import('@json-render/react-pdf');
  jsonRenderCore: typeof import('@json-render/core');
  reactPdf: typeof import('@react-pdf/renderer');
}

let cachedRenderer: Promise<BrowserRenderer> | undefined;
function loadBrowserRenderer(): Promise<BrowserRenderer> {
  if (!cachedRenderer) {
    cachedRenderer = Promise.all([
      import('@json-render/react-pdf'),
      import('@json-render/core'),
      import('@react-pdf/renderer'),
    ]).then(([jsonRender, jsonRenderCore, reactPdf]) => ({ jsonRender, jsonRenderCore, reactPdf }));
  }
  return cachedRenderer;
}

/**
 * The model can emit two shapes for `tree`:
 *   - Flat: `{ root: 'doc', elements: { … } }` (production default)
 *   - Nested: `{ type: 'Document', children: [{ type: 'Page', … }] }` (opt-in)
 *
 * Nested specs are flattened via `@json-render/core`'s `nestedToFlat()`,
 * which generates synthetic keys (`el-0`, `el-1`, …) and preserves
 * `repeat` / `$item` / `$state` / `$template` on the right element. From
 * there the rest of the pipeline is identical (normalize → diagnose →
 * render).
 */
function isNestedTree(input: unknown): boolean {
  if (!input || typeof input !== 'object') {
    return false;
  }
  const obj = input as Record<string, unknown>;
  return typeof obj.type === 'string' && !('elements' in obj) && !('root' in obj);
}

// Props that flow through json-render's `stripEmoji(text.replace(...))` and
// will throw `TypeError: text.replace is not a function` if the model emits
// anything other than a string OR a string-resolving expression (`$state`,
// `$template`, `$item`, `$cond`, `$computed`, `$bindState`, `$bindItem`).
//
// The classic AI mistake is `List.items: [{$item: "name"}]` — after `repeat`
// expansion, each item is the row OBJECT, which crashes. The right pattern
// is a `View` parent with `repeat` and `Text` children using `{$item}`.
//
// NOTE: the json-render catalog declares only `text` for `Text`/`Heading`
// (no `content`). If we see `content` on a `Text`/`Heading`, `normalizeSpec`
// migrates it to `text` before this validator runs, so we don't list it here.
const STRING_PROPS_BY_TYPE: Record<string, readonly string[]> = {
  Heading: ['text'],
  Text: ['text'],
  Link: ['text', 'href'],
};

const EXPRESSION_KEYS = new Set([
  '$state',
  '$template',
  '$item',
  '$cond',
  '$computed',
  '$bindState',
  '$bindItem',
]);

function isStringOrExpression(value: unknown): boolean {
  if (typeof value === 'string') {
    return true;
  }
  if (value && typeof value === 'object') {
    for (const key of EXPRESSION_KEYS) {
      if (key in (value as Record<string, unknown>)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Repairs the two AI mistakes that crash json-render hard:
 *
 *  1. Element with no `props`. The renderer calls
 *     `Object.entries(element.props)` in `resolveElementProps` — `undefined`
 *     throws `Cannot convert undefined or null to object` and the error
 *     boundary renders the whole element (often the root `Page`) to `null`,
 *     so the PDF opens blank with no on-screen signal.
 *
 *  2. `Text` / `Heading` carrying `content` instead of `text`. The
 *     json-render catalog only declares `text`; `content` is dropped and
 *     `stripEmoji(p.text)` then crashes on `undefined`. The bug is sticky
 *     because the prompt examples used to teach `content` — model copies
 *     them verbatim. We migrate to keep older specs working.
 *
 * Returns the repaired spec + a human-readable list of migrations applied.
 */
function normalizeSpec(spec: PdfReportSpec): {
  spec: PdfReportSpec;
  migrations: string[];
} {
  const migrations: string[] = [];
  const elements: Record<string, PdfReportSpecElement> = {};
  for (const [key, original] of Object.entries(spec.elements)) {
    let el = original;
    if (!el.props || typeof el.props !== 'object') {
      el = { ...el, props: {} };
      migrations.push(`element "${key}" (${el.type}): added missing \`props: {}\``);
    }
    if ((el.type === 'Text' || el.type === 'Heading') && el.props) {
      const props = el.props as Record<string, unknown>;
      const hasContent = 'content' in props;
      const hasText = 'text' in props && props.text !== undefined && props.text !== null;
      if (hasContent && !hasText) {
        const { content, ...rest } = props;
        el = { ...el, props: { ...rest, text: content } };
        migrations.push(`element "${key}" (${el.type}): migrated \`content\` → \`text\``);
      } else if (hasContent && hasText) {
        // Both set — `text` wins (matches the renderer); drop `content` to
        // avoid downstream confusion. Don't surface as a migration.
        const { content, ...rest } = props;
        el = { ...el, props: rest };
      }
    }
    elements[key] = el;
  }
  return { spec: { ...spec, elements }, migrations };
}

/**
 * Walks an AI-emitted spec and flags structural issues that would render an
 * empty (or crashing) PDF. Lightweight in-house replacement for `validateSpec`
 * from `@json-render/core` (not re-exported by `@json-render/react-pdf`, so
 * we keep validation here to avoid adding another peer dep).
 *
 * Catches:
 *  - missing/empty root
 *  - root key not in elements
 *  - children referencing non-existent keys
 *  - element with no `type`
 *  - **string-typed props** receiving non-string non-expression values (would
 *    crash json-render's `stripEmoji` inside the boundary, silently rendering
 *    the element to `null`).
 *  - **`List.items`** containing non-string non-`$template` entries (the
 *    most common AI miswiring: `{$item: "name"}` inside `items[]`).
 */
function diagnoseSpec(spec: PdfReportSpec): string[] {
  const issues: string[] = [];
  if (!spec.root) {
    issues.push('spec.root is empty.');
    return issues;
  }
  if (!spec.elements || typeof spec.elements !== 'object') {
    issues.push('spec.elements is missing.');
    return issues;
  }
  if (!spec.elements[spec.root]) {
    issues.push(`spec.root "${spec.root}" does not exist in spec.elements.`);
  }
  for (const [key, el] of Object.entries(spec.elements)) {
    if (!el?.type) {
      issues.push(`element "${key}" has no type.`);
      continue;
    }

    // Validate string-typed props for known element types.
    const stringProps = STRING_PROPS_BY_TYPE[el.type];
    if (stringProps && el.props) {
      for (const propName of stringProps) {
        const value = el.props[propName];
        if (value !== undefined && !isStringOrExpression(value)) {
          issues.push(
            `element "${key}" (${el.type}.${propName}) must be a string or an expression — got ${typeof value}.`,
          );
        }
      }
    }

    // `List.items` is the classic crash site for AI-generated specs.
    if (el.type === 'List' && el.props && Array.isArray(el.props.items)) {
      const items = el.props.items as unknown[];
      items.forEach((item, idx) => {
        // `$state` is allowed at top-level (resolves to string); `$item`
        // inside an `items[]` returns the row OBJECT post-`repeat` expansion,
        // which crashes `stripEmoji`. Reject `$item` here.
        if (typeof item === 'string') {
          return;
        }
        if (item && typeof item === 'object') {
          if ('$item' in (item as Record<string, unknown>)) {
            issues.push(
              `element "${key}" (List.items[${idx}]) uses $item — List.items must be literal strings or $template. Use a View+repeat with Text children for per-row data.`,
            );
            return;
          }
          if ('$template' in (item as Record<string, unknown>) || '$state' in (item as Record<string, unknown>) || '$cond' in (item as Record<string, unknown>) || '$computed' in (item as Record<string, unknown>)) {
            return;
          }
        }
        issues.push(
          `element "${key}" (List.items[${idx}]) must be a string or $template — got ${typeof item}.`,
        );
      });
    }

    if (!el.children) {
      continue;
    }
    if (!Array.isArray(el.children)) {
      issues.push(`element "${key}" has non-array children.`);
      continue;
    }
    for (const childKey of el.children) {
      if (typeof childKey !== 'string') {
        issues.push(`element "${key}" child "${String(childKey)}" is not a string key.`);
      } else if (!spec.elements[childKey]) {
        issues.push(`element "${key}" references missing child "${childKey}".`);
      }
    }
  }
  return issues;
}

function CopilotPdfReportCard(props: CopilotPdfReportCardProps) {
  const { className, ownerState } = props;
  const messageId = ownerState?.messageId;
  const toolCallId = ownerState?.toolCallId ?? '';
  const message = useMessage(messageId ?? '');
  const toolPart = findToolPartByCallId(message?.parts, toolCallId);
  const invocationState = toolPart?.toolInvocation?.state ?? ownerState?.state;
  const inputTree = (toolPart?.toolInvocation?.input as PdfReportToolInput | undefined)?.tree;
  const outputMeta = toolPart?.toolInvocation?.output as PdfReportOutputMeta | undefined;

  const renderCtx = useCopilotPluginRenderContext();

  const [renderedUrl, setRenderedUrl] = React.useState<string | null>(null);
  const [renderError, setRenderError] = React.useState<string | null>(null);
  const [isRendering, setIsRendering] = React.useState(false);
  // Per-call token so a slower in-flight render can't overwrite a fresher one
  // (rapid Regenerate clicks): the resolver checks the token before swapping
  // state and revokes its own URL when it's stale.
  const renderTokenRef = React.useRef(0);

  React.useEffect(() => {
    return () => {
      if (renderedUrl) {
        URL.revokeObjectURL(renderedUrl);
      }
    };
  }, [renderedUrl]);

  // A new spec invalidates any cached URL. Comparing identities is enough —
  // chat-headless preserves the message-parts reference unless the tree
  // genuinely changes.
  const lastTreeRef = React.useRef<PdfReportSpec | undefined>(undefined);
  if (inputTree && lastTreeRef.current && lastTreeRef.current !== inputTree && renderedUrl) {
    setRenderedUrl(null);
    lastTreeRef.current = inputTree;
  } else if (inputTree && !lastTreeRef.current) {
    lastTreeRef.current = inputTree;
  }

  const renderPdf = React.useCallback(async (): Promise<{
    url: string;
    token: number;
  } | null> => {
    if (!inputTree) {
      return null;
    }
    renderTokenRef.current += 1;
    const token = renderTokenRef.current;
    setIsRendering(true);
    setRenderError(null);
    try {
      const { jsonRender, jsonRenderCore, reactPdf } = await loadBrowserRenderer();
      // Host may pass either a RefObject (`{current}`) or a bare API object as
      // `renderCtx.api`. Unwrap the ref shape when present so `buildPdfReportState`
      // can duck-type the methods it needs.
      const resolvedGridApi =
        renderCtx.api && typeof renderCtx.api === 'object' && 'current' in renderCtx.api
          ? (renderCtx.api as { current: unknown }).current
          : renderCtx.api;
      const state = buildPdfReportState({
        queryResults: renderCtx.queryResults as ReadonlyMap<string, any>,
        gridApi: resolvedGridApi,
        reportTitle: extractPdfReportTitle(inputTree),
      });

      // If the model emitted a nested tree (opt-in via metadata.pdfFormat:
      // 'nested'), flatten it to the json-render flat Spec first. The
      // flattener preserves repeat / $item / $state / $template and assigns
      // synthetic element keys (el-0, el-1, ...).
      let workingTree: PdfReportSpec;
      if (isNestedTree(inputTree)) {
        workingTree = jsonRenderCore.nestedToFlat(
          inputTree as unknown as Parameters<typeof jsonRenderCore.nestedToFlat>[0],
        ) as unknown as PdfReportSpec;
      } else {
        workingTree = inputTree;
      }

      // Repair the two AI mistakes that crash json-render hard (missing
      // `props`, `Text.content` instead of `Text.text`) before validation.
      // Hard crashes from missing props would surface as <Page> rendering
      // to null — the user sees an empty PDF with no error.
      const { spec: normalizedSpec, migrations } = normalizeSpec(workingTree);
      if (migrations.length > 0 && typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.debug('[CopilotPdfReport] Spec migrations applied:', migrations);
      }

      // Surface common AI-generation errors (missing root, children
      // referencing non-existent elements) before we hand the spec to
      // react-pdf — a malformed spec silently renders to an empty document.
      const issues = diagnoseSpec(normalizedSpec);
      if (issues.length > 0) {
         
        console.warn('[CopilotPdfReport] Spec issues:', issues, 'tree:', normalizedSpec);
        if (token === renderTokenRef.current) {
          setRenderError(`Spec issues: ${issues.join(' · ')}`);
        }
      }

      // Pre-render diagnostic. Logs at debug-info volume so devs can copy
      // the spec + state straight from the browser console.
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.debug('[CopilotPdfReport] Rendering with spec + state:', {
          spec: normalizedSpec,
          originalSpec: migrations.length > 0 ? inputTree : undefined,
          state,
          queryResultIds: Array.from(renderCtx.queryResults.keys()),
        });
      }

      // `renderToBuffer` is Node-only. In the browser we hand the json-render
      // `<Renderer>` wrapped in `JSONUIProvider` to `pdf()` from
      // `@react-pdf/renderer`, which resolves the React tree against the web
      // bundle and produces a Blob.
      // `pdf()` is typed for `<Document>` but the `JSONUIProvider` passes its
      // single Document child through at runtime (that's how state binding
      // works during render). One cast at the boundary tells TS to trust the
      // json-render contract.
      const JSONUIProvider = jsonRender.JSONUIProvider;
      const Renderer = jsonRender.Renderer;
      const rendererSpec = normalizedSpec as unknown as Parameters<typeof Renderer>[0]['spec'];
      const element = (
        <JSONUIProvider initialState={state}>
          <Renderer spec={rendererSpec} />
        </JSONUIProvider>
      );

      // json-render's internal `ElementErrorBoundary` catches per-element
      // render errors and logs `console.error('[json-render/react-pdf]
      // Rendering error in <Foo>:', err)`, then renders the failing element
      // as `null`. Our outer try/catch never sees these — they'd produce a
      // valid-but-empty PDF with no UI signal. Patch console.error for the
      // render's duration to capture those messages and surface them.
      const capturedRenderErrors: string[] = [];
      const originalConsoleError = console.error;
      console.error = (...args: unknown[]) => {
        try {
          const head = typeof args[0] === 'string' ? args[0] : '';
          if (/\[json-render\/react-pdf\][^]*Rendering error/.test(head)) {
            // args[1] is typically the Error; prefer its message + element tag.
            const err = args[1] as Error | undefined;
            const message = err?.message ?? head;
            // Trim element tag out of the head string for cleaner display.
            const tagMatch = head.match(/Rendering error in <([^>]+)>/);
            const tag = tagMatch ? tagMatch[1] : 'element';
            capturedRenderErrors.push(`<${tag}> ${message}`);
          }
        } catch {
          // ignore — never let our instrumentation block the real log
        }
        originalConsoleError(...(args as unknown as []));
      };

      let blob: Blob;
      try {
        blob = await reactPdf.pdf(element as Parameters<typeof reactPdf.pdf>[0]).toBlob();
      } finally {
        console.error = originalConsoleError;
      }

      const url = URL.createObjectURL(blob);
      if (token !== renderTokenRef.current) {
        URL.revokeObjectURL(url);
        return null;
      }
      if (capturedRenderErrors.length > 0 && token === renderTokenRef.current) {
        // Surface alongside any pre-render `diagnoseSpec` issues; we still
        // hand back the URL so the user can open whatever DID render.
        setRenderError(
          (prev) =>
            `${prev ? `${prev}\n` : ''}Render issues: ${capturedRenderErrors.join(' · ')}`,
        );
      }
      return { url, token };
    } catch (err) {
      if (token === renderTokenRef.current) {
        setRenderError((err as Error)?.message ?? String(err));
      }
      return null;
    } finally {
      if (token === renderTokenRef.current) {
        setIsRendering(false);
      }
    }
  }, [inputTree, renderCtx.queryResults, renderCtx.api]);

  const handleOpen = React.useCallback(async () => {
    if (renderedUrl) {
      window.open(renderedUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const result = await renderPdf();
    if (result) {
      setRenderedUrl(result.url);
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
  }, [renderPdf, renderedUrl]);

  const handleRegenerate = React.useCallback(async () => {
    setRenderedUrl(null);
    const result = await renderPdf();
    if (result) {
      setRenderedUrl(result.url);
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
  }, [renderPdf]);

  if (invocationState !== 'output-available' || !inputTree) {
    return (
      <CardRoot className={className}>
        <CardBody>
          <Title>Generating PDF report…</Title>
          <Pending>The report will appear here when it is ready.</Pending>
        </CardBody>
      </CardRoot>
    );
  }

  const title = outputMeta?.title || extractPdfReportTitle(inputTree) || 'Report';
  const pageCount = outputMeta?.pageCount ?? countPdfReportPages(inputTree);
  const subtitle: string[] = [];
  if (pageCount > 0) {
    subtitle.push(`${pageCount} page${pageCount === 1 ? '' : 's'}`);
  }
  const generatedAt = formatTimestamp(outputMeta?.generatedAt);
  if (generatedAt) {
    subtitle.push(`Generated ${generatedAt}`);
  }

  return (
    <CardRoot className={className}>
      <CardBody>
        <Title>{title}</Title>
        {subtitle.length > 0 ? <Meta>{subtitle.join(' · ')}</Meta> : null}
        {renderError ? <ErrorText>Failed to render PDF: {renderError}</ErrorText> : null}
      </CardBody>
      <Actions>
        <SubtleButton
          type="button"
          onClick={() => {
            void handleRegenerate();
          }}
          disabled={isRendering}
          title="Re-render with the latest grid data"
        >
          Regenerate
        </SubtleButton>
        <ActionButton
          type="button"
          onClick={() => {
            void handleOpen();
          }}
          disabled={isRendering}
        >
          {isRendering ? 'Rendering…' : 'Open report'}
        </ActionButton>
      </Actions>
    </CardRoot>
  );
}

export { CopilotPdfReportCard, normalizeSpec, diagnoseSpec };
