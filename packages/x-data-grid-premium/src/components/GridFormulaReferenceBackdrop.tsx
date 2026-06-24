'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { gridEditCellStateSelector, useGridSelector } from '@mui/x-data-grid-pro';
import type { GridRowId } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import {
  getFormulaReferenceColorVar,
  getFormulaReferencePaletteStyles,
  useGridFormulaReferenceModel,
} from '../hooks/features/formula/gridFormulaReferenceHighlights';
import type { FormulaReference } from '../hooks/features/formula/gridFormulaReferenceHighlights';

// Wraps the real formula input. Its text is made transparent (the caret stays
// visible) so the colored mirror behind it shows through. The descendant `input`
// selector reaches the input whether it is rendered by the autocomplete or by
// the plain `GridEditInputCell` fallback. Forced-colors mode restores the input
// text and hides the mirror (color is decorative — the token text is enough).
const GridFormulaReferenceLayer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  '& input': {
    color: 'transparent',
    caretColor: (theme.vars || theme).palette.text.primary,
    // Pin the input to the same deterministic text metrics as the mirror below.
    // The input otherwise inherits MUI's body `letter-spacing` (~0.13px/char)
    // while the mirror has `normal`, so the colored glyphs drift from the caret
    // by ~0.13px per character — visible as the caret separating from the colors
    // toward the end of a long formula. Ligatures are pinned for the same reason.
    letterSpacing: 'normal',
    fontVariantLigatures: 'none',
  },
  // The input text is transparent so the colored mirror shows through, but that
  // also makes the native selection invisible (and the colored mirror ghost
  // through a translucent highlight). Restore a readable, opaque selection on the
  // input: it occludes the mirror in the selected range and shows the text in one
  // legible color (per-reference colors resume once the selection is cleared).
  '& input::selection': {
    color: (theme.vars || theme).palette.primary.contrastText,
    // `-webkit-text-fill-color` wins over `color` for the glyph fill, so set it
    // too — keeps the selection legible if the transparent-text rule above ever
    // moves to `-webkit-text-fill-color` (the cross-browser way to hide it).
    WebkitTextFillColor: (theme.vars || theme).palette.primary.contrastText,
    backgroundColor: (theme.vars || theme).palette.primary.main,
  },
  '@media (forced-colors: active)': {
    '& input': { color: 'CanvasText', caretColor: 'CanvasText' },
    '& input::selection': {
      color: 'HighlightText',
      WebkitTextFillColor: 'HighlightText',
      backgroundColor: 'Highlight',
    },
  },
}));

// The colored mirror. Mirrors every text metric of the input wrapper
// (`GridEditInputCell`/`GridFormulaAutocomplete`: `font: body`, `padding: 1px 0`,
// inner input `padding: 0 16px`) so the colored runs sit exactly over the
// characters they color.
const GridFormulaReferenceBackdropRoot = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  font: vars.typography.font.body,
  padding: '1px 0',
  color: (theme.vars || theme).palette.text.primary,
  ...getFormulaReferencePaletteStyles(theme),
  '@media (forced-colors: active)': { display: 'none' },
}));

const GridFormulaReferenceBackdropText = styled('div')({
  width: '100%',
  padding: '0 16px',
  whiteSpace: 'pre',
  overflow: 'hidden',
  boxSizing: 'border-box',
  // Pinned to match the input metrics (see the `& input` rule above) so every
  // glyph sits exactly over the one the caret moves through — no drift.
  fontVariantLigatures: 'none',
  letterSpacing: 'normal',
  // Match the input's own alignment (`start`). A right-aligned column
  // (`type: 'number'`) sets `text-align: right` on the editing cell; the input
  // resets it but this mirror would otherwise inherit it and render the colored
  // text at the opposite edge from the caret.
  textAlign: 'start',
});

interface FormulaTextSegment {
  text: string;
  colorIndex: number | null;
}

/**
 * Splits the editor text into colored reference runs and plain gaps. References
 * are non-overlapping distinct tokens; an out-of-order or overlapping span is
 * skipped defensively so the mirror text always reconstructs the value exactly.
 */
export function buildFormulaTextSegments(
  value: string,
  references: FormulaReference[],
): FormulaTextSegment[] {
  const colored = references
    .filter((reference) => reference.colorIndex !== null)
    .flatMap((reference) =>
      reference.spans.map((span) => ({
        start: span.start,
        end: span.end,
        colorIndex: reference.colorIndex,
      })),
    )
    .sort((a, b) => a.start - b.start);

  const segments: FormulaTextSegment[] = [];
  let cursor = 0;
  for (const span of colored) {
    if (span.start < cursor || span.end > value.length) {
      continue;
    }
    if (span.start > cursor) {
      segments.push({ text: value.slice(cursor, span.start), colorIndex: null });
    }
    segments.push({ text: value.slice(span.start, span.end), colorIndex: span.colorIndex });
    cursor = span.end;
  }
  if (cursor < value.length) {
    segments.push({ text: value.slice(cursor), colorIndex: null });
  }
  return segments;
}

export interface GridFormulaReferenceBackdropProps {
  ownerCell: { id: GridRowId; field: string };
  a1Notation: boolean;
  children: React.ReactNode;
}

/**
 * Half A of the reference highlighting: a colored backdrop mirroring the formula
 * editor text. Keeps the native `<input>` (so caret/selection/IME/a11y are
 * untouched) and paints the per-reference colors behind it, scrolled in lockstep.
 */
function GridFormulaReferenceBackdrop(props: GridFormulaReferenceBackdropProps) {
  const { ownerCell, a1Notation, children } = props;
  const apiRef = useGridPrivateApiContext();
  const editCellState = useGridSelector(apiRef, gridEditCellStateSelector, {
    rowId: ownerCell.id,
    field: ownerCell.field,
  });
  const value = typeof editCellState?.value === 'string' ? editCellState.value : '';
  const model = useGridFormulaReferenceModel(apiRef, ownerCell, a1Notation);

  const layerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  const segments = React.useMemo(
    () => buildFormulaTextSegments(value, model.references),
    [value, model.references],
  );

  // Keep the mirror aligned with the input. Re-run on value change to re-sync
  // after the input auto-scrolls to the caret; the listener covers
  // manual/programmatic scrolls.
  useEnhancedEffect(() => {
    const text = textRef.current;
    const input = layerRef.current?.querySelector('input');
    if (!text || !input) {
      return undefined;
    }
    const syncScroll = () => {
      text.scrollLeft = input.scrollLeft;
    };
    // The mirror is absolutely positioned and flex-centered; the real input is
    // in-flow and the browser centers its text. Those two paths round ~0.5px
    // apart — a full device pixel on a Retina display, where the colored text
    // visibly sits above/below the caret. Measure the input's actual text
    // line-box top and translate the mirror onto it, so it is exact on any
    // display/engine rather than relying on the two centerings matching.
    const alignVertically = () => {
      text.style.transform = '';
      const lineHeight = parseFloat(getComputedStyle(input).lineHeight);
      if (Number.isNaN(lineHeight)) {
        return;
      }
      const inputRect = input.getBoundingClientRect();
      const inputTextTop = inputRect.top + (inputRect.height - lineHeight) / 2;
      const delta = inputTextTop - text.getBoundingClientRect().top;
      text.style.transform = `translateY(${delta}px)`;
    };
    syncScroll();
    alignVertically();
    input.addEventListener('scroll', syncScroll);
    return () => input.removeEventListener('scroll', syncScroll);
  }, [value]);

  return (
    <GridFormulaReferenceLayer ref={layerRef}>
      <GridFormulaReferenceBackdropRoot
        aria-hidden
        className="MuiDataGrid-formulaReferenceBackdrop"
      >
        <GridFormulaReferenceBackdropText ref={textRef}>
          {segments.map((segment, index) =>
            segment.colorIndex === null ? (
              <React.Fragment key={index}>{segment.text}</React.Fragment>
            ) : (
              <span
                key={index}
                className="MuiDataGrid-formulaReferenceToken"
                style={{ color: getFormulaReferenceColorVar(segment.colorIndex) }}
              >
                {segment.text}
              </span>
            ),
          )}
        </GridFormulaReferenceBackdropText>
      </GridFormulaReferenceBackdropRoot>
      {children}
    </GridFormulaReferenceLayer>
  );
}

export { GridFormulaReferenceBackdrop };
