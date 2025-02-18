import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import Paper from '@mui/material/Paper';
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
  ref?: React.Ref<HTMLElement>;
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<GridPanelClasses>;
  open: boolean;
}

export const gridPanelClasses = generateUtilityClasses<keyof GridPanelClasses>('MuiDataGrid', [
  'panel',
  'paper',
]);

const GridPanelRoot = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'Panel',
})<{ ownerState: OwnerState }>({
  zIndex: vars.zIndex.panel,
});

const GridPaperRoot = styled(Paper, {
  name: 'MuiDataGrid',
  slot: 'Paper',
})<{ ownerState: OwnerState }>({
  backgroundColor: vars.colors.background.overlay,
  minWidth: 300,
  maxHeight: 450,
  display: 'flex',
  maxWidth: `calc(100vw - ${vars.spacing(0.5)})`,
  overflow: 'auto',
});

const GridPanel = forwardRef<HTMLElement, GridPanelProps>((props, ref) => {
  const { children, className, classes: classesProp, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = gridPanelClasses;
  const [isPlaced, setIsPlaced] = React.useState(false);
  const variablesClass = useCSSVariablesClass();

  const onDidShow = useEventCallback(() => setIsPlaced(true));
  const onDidHide = useEventCallback(() => setIsPlaced(false));

  const handleClickAway = useEventCallback(() => {
    apiRef.current.hidePreferences();
  });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      apiRef.current.hidePreferences();
    }
  });

  const [target, setTarget] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const panelAnchor = apiRef.current.rootElementRef?.current?.querySelector(
      '[data-id="gridPanelAnchor"]',
    );

    if (panelAnchor) {
      setTarget(panelAnchor);
    }
  }, [apiRef]);

  if (!target) {
    return null;
  }

  return (
    <GridPanelRoot
      as={rootProps.slots.basePopper}
      ownerState={rootProps}
      placement="bottom-start"
      className={clsx(classes.panel, className, variablesClass)}
      target={target}
      flip
      onDidShow={onDidShow}
      onDidHide={onDidHide}
      onClickAway={handleClickAway}
      clickAwayMouseEvent="onPointerUp"
      clickAwayTouchEvent={false}
      focusTrap
      focusTrapEnabled
      {...other}
      {...rootProps.slotProps?.basePopper}
      ref={ref}
    >
      <GridPaperRoot
        className={classes.paper}
        ownerState={rootProps}
        elevation={8}
        onKeyDown={handleKeyDown}
      >
        {isPlaced && children}
      </GridPaperRoot>
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
  open: PropTypes.bool.isRequired,
  target: PropTypes /* @typescript-to-proptypes-ignore */.any,
} as any;

export { GridPanel };
