import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuValue } from '../../../../hooks/features/columnMenu';
import { GridColumnMenuSimpleContainer } from './GridColumnMenuSimpleContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnsMenuSimpleItem } from './GridColumnsMenuSimpleItem';
import { GridFilterMenuSimpleItem } from './GridFilterMenuSimpleItem';
import { HideGridColMenuSimpleItem } from './HideGridColMenuSimpleItem';
import { SortGridMenuSimpleItems } from './SortGridMenuSimpleItems';
import { GridColumnMenu } from '../GridColumnMenu';

interface Props
  extends Pick<
    GridColumnMenuProps,
    'hideMenu' | 'currentColumn' | 'open' | 'filterColumnMenuItems'
  > {}

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, Props>(
  function GridColumnMenuSimple(props: Props, ref) {
    const { hideMenu, currentColumn } = props;

    const menuItems: GridColumnMenuValue = [
      {
        slot: 'sorting',
        displayName: 'SortGridMenuSimpleItems',
        component: <SortGridMenuSimpleItems onClick={hideMenu} column={currentColumn!} />,
      },
      // TODO update types to allow `onClick` and `column` to be optional
      {
        slot: 'filter',
        displayName: 'GridFilterMenuSimpleItem',
        component: <GridFilterMenuSimpleItem onClick={hideMenu} column={currentColumn!} />,
      },
      {
        slot: 'hideColumn',
        displayName: 'HideGridColMenuSimpleItem',
        component: <HideGridColMenuSimpleItem onClick={hideMenu} column={currentColumn!} />,
      },
      {
        slot: 'manageColumns',
        displayName: 'GridColumnsMenuSimpleItem',
        component: <GridColumnsMenuSimpleItem onClick={hideMenu} column={currentColumn!} />,
      },
    ];

    return (
      <GridColumnMenuSimpleContainer ref={ref} {...props}>
        <GridColumnMenu menuItems={menuItems} {...props} />
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
  filterColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuSimple };
