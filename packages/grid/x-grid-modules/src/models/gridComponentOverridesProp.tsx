import * as React from 'react';
import { ComponentParams } from './params';

export interface GridComponentOverridesProp {
  pagination?: React.ElementType<ComponentParams>;
  loadingOverlay?: React.ElementType<ComponentParams>;
  noRowsOverlay?: React.ElementType<ComponentParams>;
  footer?: React.ElementType<ComponentParams>;
  header?: React.ElementType<ComponentParams>;
}
