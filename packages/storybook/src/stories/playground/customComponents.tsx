import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import CodeIcon from '@material-ui/icons/Code';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
import {
  GridFooterContainer,
  GridOverlay,
  GridColumnMenu,
  HideGridColMenuItem,
  GridColumnMenuProps,
  useGridSlotComponentProps,
} from '@material-ui/data-grid';
import RecipeReviewCard from './RecipeReviewCard';

export function SortedDescendingIcon() {
  return <ExpandMoreIcon className="icon" />;
}

export function SortedAscendingIcon() {
  return <ExpandLessIcon className="icon" />;
}

export function LoadingComponent() {
  return (
    <GridOverlay className="custom-overlay">
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export function NoRowsComponent() {
  return (
    <GridOverlay className="custom-overlay">
      <CodeIcon />
      <span style={{ lineHeight: '24px', padding: '0 10px' }}>No Rows</span>
      <CodeIcon />
    </GridOverlay>
  );
}

export function PaginationComponent(props: { color?: 'primary' }) {
  const { state, apiRef } = useGridSlotComponentProps();
  return (
    <Pagination
      className="my-custom-pagination"
      page={state.pagination.page}
      color={props.color}
      count={state.pagination.pageCount}
      onChange={(event, value) => apiRef.current.setPage(value)}
    />
  );
}

export function CustomFooter(props) {
  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <GridFooterContainer className="my-custom-footer">
      <span style={{ display: 'flex', alignItems: 'center', background: props.color }}>
        Custom footer is here.
      </span>
      <Pagination
        className="my-custom-pagination"
        page={state.pagination.page}
        count={state.pagination.pageCount}
        onChange={(event, value) => apiRef.current.setPage(value)}
      />
    </GridFooterContainer>
  );
}

export function FooterComponent2() {
  const { state } = useGridSlotComponentProps();

  return (
    <div className="footer my-custom-footer"> I counted {state.pagination.rowCount} row(s) </div>
  );
}

export function CustomHeader(props) {
  return (
    <div className="custom-header">
      <PaginationComponent {...props} />
    </div>
  );
}

export function ColumnMenuComponent(props: GridColumnMenuProps) {
  const { apiRef } = useGridSlotComponentProps();

  if (apiRef.current.getColumnIndex(props.currentColumn.field) === 1) {
    return <RecipeReviewCard />;
  }
  if (props.currentColumn.field === 'id') {
    return <HideGridColMenuItem onClick={props.hideMenu} column={props.currentColumn!} />;
  }

  return (
    <GridColumnMenu
      open={props.open}
      hideMenu={props.hideMenu}
      currentColumn={props.currentColumn}
    />
  );
}

export function CustomCheckboxComponent(props: CheckboxProps) {
  const GreenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((checkboxProps: CheckboxProps) => <Checkbox color="default" {...checkboxProps} />);

  return <GreenCheckbox {...props} />;
}
