import * as React from 'react';
import { gridClasses } from '../../gridClasses';

export function GridMainContainer(props: React.PropsWithChildren<{}>) {
  return <div className={gridClasses.main}>{props.children}</div>;
}
