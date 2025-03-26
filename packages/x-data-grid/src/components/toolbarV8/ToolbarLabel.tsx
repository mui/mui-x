import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { forwardRef } from '@mui/x-internals/forwardRef';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import { vars } from '../../constants/cssVariables';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';

export type ToolbarLabelProps = React.HTMLAttributes<HTMLSpanElement> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<React.ComponentProps<typeof ToolbarLabelRoot>>;
};

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const ToolbarLabelRoot = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ToolbarLabel',
})({
  flex: 1,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  margin: vars.spacing(0, 0.5),
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

/**
 * A label for the toolbar.
 * It renders a styled `<span />` element. By default, it uses the DataGrid's `label` prop as its content but can be overridden by providing `children`.
 *
 * Demos:
 *
 * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
 *
 * API:
 *
 * - [ToolbarLabel API](https://mui.com/x/api/data-grid/toolbar-label/)
 */
const ToolbarLabel = forwardRef<HTMLSpanElement, ToolbarLabelProps>(
  function ToolbarLabel(props, ref) {
    const { render, className, ...other } = props;
    const rootProps = useGridRootProps();
    const classes = useUtilityClasses(rootProps);

    const element = useGridComponentRenderer(ToolbarLabelRoot, render, {
      children: rootProps.label,
      id: 'data-grid-label', // TODO: Generate a unique ID - needs to be at a higher level as it will need to be referenced in `useGridAriaAttributes`
      ...other,
      className: clsx(classes.root, className),
      ref,
    });

    return <React.Fragment>{element}</React.Fragment>;
  },
);

ToolbarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ToolbarLabel };
