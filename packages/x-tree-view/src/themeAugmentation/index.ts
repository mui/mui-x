import type {
  TreeViewComponentNameToClassKey,
  TreeViewComponentsPropsList,
  TreeViewComponents,
} from '../internals/models/themeAugmentation';

export type * from '../internals/models/themeAugmentation';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends TreeViewComponentNameToClassKey {}
  interface ComponentsPropsList extends TreeViewComponentsPropsList {}
  interface Components<Theme = unknown> extends TreeViewComponents<Theme> {}
}
