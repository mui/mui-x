import * as React from 'react';
import { GridSlotsComponent } from '../gridSlotsComponent';

export type ApiComponents = {
  [Property in keyof GridSlotsComponent]: React.ElementType;
};

export interface ComponentsApi {
  /**
   * The set of overridable components used in the grid.
   */
  components: ApiComponents;
}
