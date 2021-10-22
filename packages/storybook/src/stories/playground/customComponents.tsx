import * as React from 'react';
import { withStyles } from '@mui/styles';
import { green } from '@mui/material/colors';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
import CodeIcon from '@mui/icons-material/Code';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Pagination from '@mui/material/Pagination';
import {
  GridFooterContainer,
  GridOverlay,
  GridColumnMenu,
  HideGridColMenuItem,
  GridColumnMenuProps,
  useGridApiContext,
  useGridState,
} from '@mui/x-data-grid';
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
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

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
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

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
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

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
  const apiRef = useGridApiContext();

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
