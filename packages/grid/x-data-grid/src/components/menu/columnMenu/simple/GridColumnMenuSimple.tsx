import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuValue } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuSimpleProps } from './GridColumnMenuSimpleProps';
import { GridColumnsMenuSimpleItem } from './GridColumnsMenuSimpleItem';
import { GridFilterMenuSimpleItem } from './GridFilterMenuSimpleItem';
import { HideGridColMenuSimpleItem } from './HideGridColMenuSimpleItem';
import { SortGridMenuSimpleItems } from './SortGridMenuSimpleItems';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuSimpleProps>(
  function GridColumnMenuSimple(props: GridColumnMenuSimpleProps, ref) {
    const { hideMenu, currentColumn } = props;
    const apiRef = useGridApiContext();

    const menuItems: GridColumnMenuValue = [
      {
        displayName: 'SortGridMenuSimpleItems',
        component: <SortGridMenuSimpleItems onClick={hideMenu} column={currentColumn!} />,
      },
      // TODO update types to allow `onClick` and `column` to be optional
      {
        displayName: 'GridFilterMenuSimpleItem',
        component: <GridFilterMenuSimpleItem onClick={hideMenu} column={currentColumn!} />,
      },
      {
        displayName: 'HideGridColMenuSimpleItem',
        component: <HideGridColMenuSimpleItem onClick={hideMenu} column={currentColumn!} />,
      },
      {
        displayName: 'GridColumnsMenuSimpleItem',
        component: <GridColumnsMenuSimpleItem onClick={hideMenu} column={currentColumn!} />,
      },
    ];

    const preProcessedValue = apiRef.current.unstable_applyPipeProcessors(
      'columnMenu',
      menuItems,
      currentColumn,
    );

    return (
      <GridColumnMenuSimpleContainer ref={ref} {...props}>
        {preProcessedValue.map((item: any, index: number) =>
          React.cloneElement(item.component, {
            key: index,
            onClick: hideMenu,
            column: currentColumn,
          }),
        )}
      </GridColumnMenuSimpleContainer>
    );
  },
);

GridColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuSimple };
