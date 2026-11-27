import type { GridValidRowModel } from '@mui/x-data-grid-pro';
import type { GridCellCondition } from '../cellCondition/gridCellConditionInterfaces';

/**
 * The style applied to the matching cells.
 * Colors are hex strings (`#rgb` or `#rrggbb`), so they also export to Excel.
 */
export interface GridConditionalFormattingStyle {
  color?: string;
  backgroundColor?: string;
  fontWeight?: 'bold';
  fontStyle?: 'italic';
  textDecoration?: 'underline' | 'line-through';
}

/**
 * Applies `style` to the cells of `fields` that match `condition`.
 */
export interface GridConditionalFormattingHighlightRule {
  type: 'highlight';
  /**
   * The fields of the columns the rule applies to.
   */
  fields: string[];
  condition: GridCellCondition;
  style: GridConditionalFormattingStyle;
}

/**
 * A conditional formatting rule. `type` tells the kinds of rules apart.
 * Rules of an unknown `type` are ignored.
 */
export type GridConditionalFormattingRule = GridConditionalFormattingHighlightRule;

/**
 * The conditional formatting rules, in priority order: when several rules
 * match a cell and set the same style property, the first one wins.
 */
export type GridConditionalFormattingModel = GridConditionalFormattingRule[];

export interface GridConditionalFormattingState {
  model: GridConditionalFormattingModel;
}

export interface GridConditionalFormattingInitialState {
  model?: GridConditionalFormattingModel;
}

export interface GridConditionalFormattingApi {
  /**
   * Sets the conditional formatting rules.
   * @param {GridConditionalFormattingModel} model The new rules.
   */
  setConditionalFormatting: (model: GridConditionalFormattingModel) => void;
}

export interface GridConditionalFormattingInternalCache {
  /**
   * The class names of each cell, by row object then field. Dropped when the
   * rules, the formula results, the computed columns or the columns change.
   */
  classNames: WeakMap<GridValidRowModel, Map<string, string[]>>;
  /**
   * What `classNames` was computed from.
   */
  inputs: unknown[];
}
