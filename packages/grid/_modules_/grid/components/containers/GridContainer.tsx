import * as React from 'react';
import { ApiContext } from '../api-context';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';

type GridContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function GridContainer(props: GridContainerProps) {
  const apiRef = React.useContext(ApiContext);
  const gridOptions = useGridSelector(apiRef, optionsSelector);

  const gridWrapperRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const gridWrapperDiv = gridWrapperRef.current;
    if (gridWrapperDiv && gridOptions.autoHeight) {
      const gridWrapperElement: HTMLDivElement = gridWrapperDiv.querySelector('div')!;
      gridWrapperElement.style.height = '';
    }
  }, [gridWrapperRef, gridOptions]);

  return gridOptions.autoHeight ? (
    <div ref={gridWrapperRef} {...props} />
  ) : (
    React.Children.only(props.children as React.ReactElement)
  );
}
