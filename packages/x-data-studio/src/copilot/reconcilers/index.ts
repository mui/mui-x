import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';
import { activeReconciler } from './active';
import { viewLabelReconciler } from './viewLabel';
import { viewMetaReconciler } from './viewMeta';
import { viewInitialStateReconciler } from './viewInitialState';
import { sheetParamsReconciler } from './sheetParams';

export {
  activeReconciler,
  viewLabelReconciler,
  viewMetaReconciler,
  viewInitialStateReconciler,
  sheetParamsReconciler,
};

/**
 * Sheet CRUD (add/delete/move) lives in commands — not patches. Sheet state is
 * keyed by id in the state document, so patches like `/sheets/<id>/label`
 * resolve via plain JSON Patch object access; array-level inserts/removes
 * would also need to update `sheetOrder`, which the commands handle cleanly.
 */
export const ALL_STUDIO_PATCH_HANDLERS: ReadonlyArray<
  PatchHandler<StudioHostAdapter, StudioStateDocument>
> = [
  activeReconciler,
  viewLabelReconciler,
  viewMetaReconciler,
  viewInitialStateReconciler,
  sheetParamsReconciler,
];
