import * as React from 'react';
import PropTypes from 'prop-types';
import { GridVirtualScroller } from '../virtualization/GridVirtualScroller';

interface GridBodyProps {
  children?: React.ReactNode;
}

function GridBody(props: GridBodyProps) {
  return <GridVirtualScroller children={props.children} />;
}

GridBody.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
} as any;

export { GridBody };
