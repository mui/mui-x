'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridRowCheckboxProps } from '../../models/gridSlotsComponentsProps';

const GridRowCheckbox = forwardRef<HTMLButtonElement, GridRowCheckboxProps>(
  function GridRowCheckbox(props, ref) {
    const { rowId, material, ...other } = props;
    const rootProps = useGridRootProps();
    return (
      <rootProps.slots.baseCheckbox
        {...rootProps.slotProps?.baseCheckbox}
        {...other}
        material={{
          disableRipple: props.disabled,
          ...material,
        }}
        ref={ref}
      />
    );
  },
);

GridRowCheckbox.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  autoFocus: PropTypes.bool,
  checked: PropTypes.bool,
  className: PropTypes.string,
  density: PropTypes.oneOf(['compact', 'standard']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  indeterminate: PropTypes.bool,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  label: PropTypes.node,
  name: PropTypes.string,
  /**
   * The grid row id.
   */
  rowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  size: PropTypes.oneOf(['medium', 'small']),
  slotProps: PropTypes.object,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  touchRippleRef: PropTypes.any,
} as any;

export { GridRowCheckbox };
