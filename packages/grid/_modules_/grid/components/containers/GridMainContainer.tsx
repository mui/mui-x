import * as React from 'react';
import clsx from 'clsx';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridMainContainer(props: React.PropsWithChildren<{}>) {
  const rootProps = useGridRootProps();
  return <div className={clsx(gridClasses.main, rootProps.classes?.main)}>{props.children}</div>;
}
