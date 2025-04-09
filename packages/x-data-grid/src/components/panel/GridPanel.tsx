import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { vars } from '../../constants/cssVariables';
import { useCSSVariablesClass } from '../../utils/css/context';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { NotRendered } from '../../utils/assert';

type OwnerState = DataGridProcessedProps;

export interface GridPanelClasses {
  /** Styles applied to the root element. */
  panel: string;
  /** Styles applied to the paper element. */
  paper: string;
}

export interface GridPanelProps
  extends Pick<GridSlotProps['basePopper'], 'id' | 'className' | 'target' | 'flip'> {
  ref?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<GridPanelClasses>;
  open: boolean;
  onClose?: () => void;
}

export const gridPanelClasses = generateUtilityClasses<keyof GridPanelClasses>('MuiDataGrid', [
  'panel',
  'paper',
]);

const GridPanelRoot = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'panel',
})<{ ownerState: OwnerState }>({
  zIndex: vars.zIndex.panel,
});

const GridPanelContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'panelContent',
})<{ ownerState: OwnerState }>({
  backgroundColor: vars.colors.background.overlay,
  borderRadius: vars.radius.base,
  boxShadow: vars.shadows.overlay,
  display: 'flex',
  maxWidth: `calc(100vw - ${vars.spacing(2)})`,
  margin: vars.spacing(1),
  overflow: 'auto',
});

const GridPanel = forwardRef<HTMLDivElement, GridPanelProps>((props, ref) => {
  const { children, className, classes: classesProp, onClose, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = gridPanelClasses;
  const [isPlaced, setIsPlaced] = React.useState(false);
  const variablesClass = useCSSVariablesClass();

  const onDidShow = useEventCallback(() => setIsPlaced(true));
  const onDidHide = useEventCallback(() => setIsPlaced(false));

  const handleClickAway = useEventCallback(() => {
    onClose?.();
  });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose?.();
    }
  });

  const [fallbackTarget, setFallbackTarget] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const panelAnchor = apiRef.current.rootElementRef?.current?.querySelector(
      '[data-id="gridPanelAnchor"]',
    );

    if (panelAnchor) {
      setFallbackTarget(panelAnchor);
    }
  }, [apiRef]);

  if (!fallbackTarget) {
    return null;
  }

  return (
    <GridPanelRoot
      as={rootProps.slots.basePopper}
      ownerState={rootProps}
      placement="bottom-end"
      className={clsx(classes.panel, className, variablesClass)}
      flip
      onDidShow={onDidShow}
      onDidHide={onDidHide}
      onClickAway={handleClickAway}
      clickAwayMouseEvent="onPointerUp"
      clickAwayTouchEvent={false}
      focusTrap
      {...other}
      {...rootProps.slotProps?.basePopper}
      target={props.target ?? fallbackTarget}
      ref={ref}
    >
      <GridPanelContent className={classes.paper} ownerState={rootProps} onKeyDown={handleKeyDown}>
        {isPlaced && children}
      </GridPanelContent>
    </GridPanelRoot>
  );
});

GridPanel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  flip: PropTypes.bool,
  id: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  target: PropTypes /* @typescript-to-proptypes-ignore */.any,
} as any;

export { GridPanel };
