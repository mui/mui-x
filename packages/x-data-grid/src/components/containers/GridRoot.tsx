import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_useForkRef as useForkRef,
  unstable_capitalize as capitalize,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridRootStyles } from './GridRootStyles';
import { useCSSVariablesContext } from '../../utils/css/context';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import { gridDensitySelector } from '../../hooks/features/density/densitySelector';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridDensity } from '../../models/gridDensity';
import { useIsSSR } from '../../hooks/utils/useIsSSR';
import { GridHeader } from '../GridHeader';
import { GridBody, GridFooterPlaceholder } from '../base';

export interface GridRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  sidePanel?: React.ReactNode;
}

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState, density: GridDensity) => {
  const { autoHeight, classes, showCellVerticalBorder } = ownerState;

  const slots = {
    root: [
      'root',
      autoHeight && 'autoHeight',
      `root--density${capitalize(density)}`,
      ownerState.slots.toolbar === null && 'root--noToolbar',
      'withBorderColor',
      showCellVerticalBorder && 'withVerticalBorder',
    ],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridRoot = forwardRef<HTMLDivElement, GridRootProps>(function GridRoot(props, ref) {
  const rootProps = useGridRootProps();
  const { className, children, sidePanel, ...other } = props;
  const apiRef = useGridPrivateApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const rootElementRef = apiRef.current.rootElementRef;

  const rootMountCallback = React.useCallback(
    (node: HTMLElement | null) => {
      if (node === null) {
        return;
      }
      apiRef.current.publishEvent('rootMount', node);
    },
    [apiRef],
  );

  const handleRef = useForkRef(rootElementRef, ref, rootMountCallback);

  const ownerState = rootProps;

  const classes = useUtilityClasses(ownerState, density);
  const cssVariables = useCSSVariablesContext();

  const isSSR = useIsSSR();

  if (isSSR) {
    return null;
  }

  return (
    <GridRootStyles
      className={clsx(
        classes.root,
        className,
        cssVariables.className,
        sidePanel && gridClasses.withSidePanel,
      )}
      ownerState={ownerState}
      {...other}
      ref={handleRef}
    >
      <div className={gridClasses.mainContent} role="presentation">
        <GridHeader />
        <GridBody>{children}</GridBody>
        <GridFooterPlaceholder />
      </div>
      {sidePanel}
      {cssVariables.tag}
    </GridRootStyles>
  );
});

GridRoot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sidePanel: PropTypes.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

const MemoizedGridRoot = fastMemo(GridRoot);
export { MemoizedGridRoot as GridRoot };
