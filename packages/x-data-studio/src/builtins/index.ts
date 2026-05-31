import type {
  DataStudioOverridable,
  DataStudioPlan,
  DataStudioSheetTemplate,
} from '../DataStudio/DataStudio.types';
import type { DataStudioViewType } from '../viewRegistry';
import { spreadsheetViewType } from '../viewRegistry/spreadsheetViewType';
import { pivotViewType } from '../viewRegistry/pivotViewType';
import { chartViewType } from '../viewRegistry/chartViewType';
import { dashboardViewType } from '../viewRegistry/dashboardViewType';
import { spreadsheetTemplate } from '../templates/spreadsheet';
import { pivotTemplate } from '../templates/pivot';
import { chartTemplate } from '../templates/chart';
import { dashboardTemplate } from '../templates/dashboard';

/**
 * The view types Data Studio ships with, active by default. The set is
 * plan-gated: Spreadsheet renders on the community `DataGrid` so it's always
 * available; Pivot and Chart need DataGridPremium / `@mui/x-charts-premium`
 * and are therefore only included on `plan === 'premium'`.
 *
 * Consumers extend, replace, or trim this set via the `viewTypes` prop — see
 * [[resolveOverridable]].
 * @param {DataStudioPlan} plan The studio's licensing tier.
 * @returns {DataStudioViewType[]} The plan-appropriate built-in view types.
 */
export function getBuiltinViewTypes(plan: DataStudioPlan): DataStudioViewType[] {
  // Each built-in is parameterized by its own params type; the registry is
  // heterogeneous, so they're widened to the registry's default param shape.
  const viewTypes: DataStudioViewType[] = [spreadsheetViewType as DataStudioViewType];
  if (plan === 'premium') {
    viewTypes.push(
      pivotViewType as DataStudioViewType,
      chartViewType as DataStudioViewType,
      dashboardViewType as DataStudioViewType,
    );
  }
  return viewTypes;
}

/**
 * The Composer templates Data Studio ships with, active by default. Same
 * plan-gating as [[getBuiltinViewTypes]]: Spreadsheet everywhere, Pivot + Chart
 * premium-only.
 *
 * Consumers extend, replace, or trim this set via the `sheetTemplates` prop —
 * see [[resolveOverridable]].
 * @param {DataStudioPlan} plan The studio's licensing tier.
 * @returns {DataStudioSheetTemplate[]} The plan-appropriate built-in templates.
 */
export function getBuiltinSheetTemplates(plan: DataStudioPlan): DataStudioSheetTemplate[] {
  const templates: DataStudioSheetTemplate[] = [spreadsheetTemplate];
  if (plan === 'premium') {
    templates.push(pivotTemplate, chartTemplate, dashboardTemplate);
  }
  return templates;
}

/**
 * Merge a consumer override on top of a set of built-in defaults.
 *
 * - `undefined` ⇒ defaults are used untouched (the default-on path).
 * - a function ⇒ called with the defaults; its return is used verbatim, so the
 *   consumer has full add / remove / reorder control.
 * - an array ⇒ appended over the defaults, with an entry replacing any default
 *   that shares its key (so a consumer can override a built-in in place).
 *
 * @param {T[]} defaults The built-in set for the active plan.
 * @param {DataStudioOverridable<T> | undefined} override The consumer's prop value.
 * @param {(item: T) => string} getKey Identity used for array override-by-key.
 * @returns {T[]} The resolved set fed to the Composer / view resolver.
 */
export function resolveOverridable<T>(
  defaults: T[],
  override: DataStudioOverridable<T> | undefined,
  getKey: (item: T) => string,
): T[] {
  if (override === undefined) {
    return defaults;
  }
  if (typeof override === 'function') {
    return [...override(defaults)];
  }
  const byKey = new Map<string, T>();
  for (const item of defaults) {
    byKey.set(getKey(item), item);
  }
  for (const item of override) {
    byKey.set(getKey(item), item);
  }
  return [...byKey.values()];
}
