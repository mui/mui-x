import * as React from 'react';
import PropTypes from 'prop-types';
import { GridMainContainer } from '../containers/GridMainContainer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

function GridErrorHandler(props: { children: React.ReactNode }) {
  const { children } = props;
  const rootProps = useGridRootProps();
  const error = rootProps.error;
  const hasError = !!error;

  return (
    <React.Fragment>
      {hasError ? (
        <GridMainContainer>
          <rootProps.components.ErrorOverlay
            error={error}
            {...rootProps.componentsProps?.errorOverlay}
          />
        </GridMainContainer>
      ) : (
        children
      )}
    </React.Fragment>
  );
}

GridErrorHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
} as any;

export { GridErrorHandler };
