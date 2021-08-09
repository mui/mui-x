import Button from '@material-ui/core/Button';
import * as React from 'react';
import clsx from 'clsx';
import { Story, Meta } from '@storybook/react';
import {
  GridColDef,
  XGrid,
  XGridProps,
  GridPanelProps,
  GridPreferencesPanel,
  GridFooter,
  GridToolbar,
  GridApiContext,
  useGridApiRef,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridState,
} from '@material-ui/x-grid';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import { useData } from '../../hooks/useData';
import {
  CustomHeader,
  CustomFooter,
  FooterComponent2,
  LoadingComponent,
  NoRowsComponent,
  PaginationComponent,
  ColumnMenuComponent,
  SortedDescendingIcon,
  SortedAscendingIcon,
  CustomCheckboxComponent,
} from './customComponents';

export default {
  title: 'X-Grid Demos/Custom-Components',
  component: XGrid,
  parameters: {
    docs: {
      page: null,
    },
  },
  decorators: [(StoryFn) => <StoryFn />],
} as Meta;

const columns: GridColDef[] = [{ field: 'id' }, { field: 'name' }, { field: 'age' }];

const rows = [
  { id: 1, name: 'alice', age: 40 },
  { id: 2, name: 'bob', age: 30 },
  { id: 3, name: 'igor', age: 40 },
  { id: 4, name: 'clara', age: 40 },
  { id: 5, name: 'clara', age: null },
  { id: 6, name: null, age: 25 },
  { id: 7, name: '', age: 42 },
];

const defaultData = {
  columns,
  rows,
  sortModel: [
    { field: 'name', sort: 'asc' as 'asc' },
    { field: 'age', sort: 'desc' as 'desc' },
  ],
};

const Template: Story<XGridProps> = (args) => {
  const data = useData(500, 50);
  return (
    <div className="grid-container">
      <XGrid {...data} {...args} />
    </div>
  );
};

export const Loading = Template.bind({});
Loading.args = {
  ...defaultData,
  loading: true,
  components: {
    LoadingOverlay: LoadingComponent,
  },
};

export const NoRows = Template.bind({});
NoRows.args = {
  rows: [],
  columns,
  components: {
    NoRowsOverlay: NoRowsComponent,
  },
};

export const Icons = Template.bind({});
Icons.args = {
  ...defaultData,
  components: {
    ColumnSortedDescendingIcon: SortedDescendingIcon,
    ColumnSortedAscendingIcon: SortedAscendingIcon,
  },
};

export const CustomPagination = Template.bind({});
CustomPagination.args = {
  pagination: true,
  pageSize: 50,
  components: {
    Pagination: PaginationComponent,
  },
  componentsProps: {
    pagination: { color: 'primary' },
  },
};

export const CustomFooterDemo = Template.bind({});
CustomFooterDemo.args = {
  pagination: true,
  pageSize: 33,
  components: {
    Footer: CustomFooter,
  },
  componentsProps: {
    footer: { color: 'blue' },
  },
};

export const HeaderAndFooter = Template.bind({});
HeaderAndFooter.args = {
  pagination: true,
  hideFooterPagination: true,
  pageSize: 33,
  components: {
    Header: CustomHeader,
    Footer: FooterComponent2,
  },
  componentsProps: {
    header: { color: 'primary' },
  },
};

function IsDone(props: { value?: boolean }) {
  return props.value ? <DoneIcon fontSize="small" /> : <ClearIcon fontSize="small" />;
}

function RegisteredComponent() {
  return <CreateIcon className="icon" />;
}

export const StyledColumns = Template.bind({});
StyledColumns.args = {
  columns: [
    { field: 'id' },
    { field: 'firstName' },
    { field: 'lastName' },
    {
      field: 'age',
      cellClassName: () => clsx('age', 'shine'),
      headerClassName: () => clsx('age', 'shine'),
      type: 'number',
    },
    {
      field: 'fullName',
      description: 'this column has a value getter and is not sortable',
      headerClassName: 'highlight',
      sortable: false,
      valueGetter: (params) =>
        `${params.getValue(params.id, 'firstName') || ''} ${
          params.getValue(params.id, 'lastName') || ''
        }`,
      cellClassName: (params) => {
        if (params.row.lastName === 'Smith') {
          return 'common';
        }
        return !params.row.lastName ? 'unknown' : '';
      },
    },
    {
      field: 'isRegistered',
      description: 'Is Registered',
      align: 'center',
      renderCell: (params) => <IsDone value={!!params.value} />,
      renderHeader: RegisteredComponent,
      headerAlign: 'center',
    },
    {
      field: 'registerDate',
      headerName: 'Registered on',
      type: 'date',
    },
    {
      field: 'lastLoginDate',
      headerName: 'Last Seen',
      type: 'dateTime',
      width: 200,
    },
  ],
  sortModel: [
    { field: 'age', sort: 'desc' },
    { field: 'registerDate', sort: 'asc' },
  ],
  rows: [
    { id: 1, firstName: 'alice', age: 40 },
    {
      id: 2,
      lastName: 'Smith',
      firstName: 'bob',
      isRegistered: true,
      age: 30,
      registerDate: new Date(2010, 10, 25),
      lastLoginDate: new Date(2019, 0, 30, 10, 55, 32),
    },
    {
      id: 3,
      lastName: 'Smith',
      firstName: 'igor',
      isRegistered: false,
      age: 40,
      registerDate: new Date(2013, 2, 13),
    },
    {
      id: 4,
      lastName: 'James',
      firstName: 'clara',
      isRegistered: true,
      age: 40,
      registerDate: new Date(2011, 2, 11),
      lastLoginDate: new Date(2020, 4, 28, 11, 30, 25),
    },
    {
      id: 5,
      lastName: 'Bobby',
      firstName: 'clara',
      isRegistered: false,
      age: null,
      registerDate: new Date(2010, 10, 2),
      lastLoginDate: new Date(2020, 0, 5, 10, 11, 32),
    },
    {
      id: 6,
      lastName: 'James',
      firstName: null,
      isRegistered: false,
      age: 40,
      registerDate: new Date(2015, 11, 6),
      lastLoginDate: new Date(2020, 5, 20, 15, 35, 10),
    },
    { id: 7, lastName: 'Smith', firstName: '', isRegistered: true, age: 40 },
  ],
};

function ToolbarComponent(props: any) {
  return <div style={{ background: props.color }}>This is my custom toolbar!</div>;
}

export const CustomToolbar = Template.bind({});
CustomToolbar.args = {
  components: {
    Header: ToolbarComponent,
  },
  componentsProps: {
    header: { color: 'red' },
  },
};

export const CustomColumnMenu = Template.bind({});
CustomColumnMenu.args = {
  components: {
    ColumnMenu: ColumnMenuComponent,
  },
  componentsProps: {
    columnMenu: { color: 'red' },
  },
};

export const UndefinedAllComponent = Template.bind({});
UndefinedAllComponent.args = {
  components: {
    ColumnMenu: undefined,
    Pagination: undefined,
    Footer: undefined,
    Header: undefined,
    ErrorOverlay: undefined,
    NoRowsOverlay: undefined,
    LoadingOverlay: undefined,
  },
};

function MyIcon1() {
  // eslint-disable-next-line jsx-a11y/accessible-emoji
  return <span role="img">✅</span>;
}

function MyIcon2() {
  // eslint-disable-next-line jsx-a11y/accessible-emoji
  return <span role="img">💥</span>;
}

export function DynamicIconUpdate() {
  const data = useData(2000, 200);
  const [icon, setIcon] = React.useState<any>(() => MyIcon1);

  return (
    <React.Fragment>
      <div>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={() => {
            setIcon(() => MyIcon2);
          }}
        >
          Change Icon
        </Button>
        <Button
          component="button"
          color="primary"
          variant="outlined"
          onClick={() => {
            setIcon(undefined);
          }}
        >
          Clear icon
        </Button>
      </div>
      <div className="grid-container">
        <XGrid
          {...data}
          components={{
            DensityStandardIcon: icon,
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </React.Fragment>
  );
}

function CustomFilterPanel(props: { bg?: string }) {
  return (
    <div style={{ width: 500, height: 100, background: props.bg, color: 'white' }}>
      My Custom Filter Panel
    </div>
  );
}
function CustomColumnsPanel(props: { bg?: string }) {
  return (
    <div style={{ width: 500, height: 300, background: props.bg }}>My Custom GridColumns Panel</div>
  );
}
export const CustomFilterColumnsPanels = Template.bind({});
CustomFilterColumnsPanels.args = {
  components: {
    FilterPanel: CustomFilterPanel,
    ColumnsPanel: CustomColumnsPanel,
    Toolbar: GridToolbar,
  },
  componentsProps: {
    filterPanel: { bg: 'blue' },
    columnsPanel: { bg: 'red' },
  },
};
function CustomPanelComponent(props: GridPanelProps) {
  if (!props.open) {
    return null;
  }

  return <div style={{ maxHeight: 500, overflow: 'auto', display: 'flex' }}>{props.children}</div>;
}
export const CustomPanel = Template.bind({});
CustomPanel.args = {
  components: {
    Panel: CustomPanelComponent,
    Toolbar: GridToolbar,
  },
};

function FooterWithPanel() {
  return (
    <React.Fragment>
      <GridFooter />
      <GridPreferencesPanel />
    </React.Fragment>
  );
}
export const CustomPanelInFooter = Template.bind({});
CustomPanelInFooter.args = {
  components: {
    Panel: CustomPanelComponent,
    Footer: FooterWithPanel,
    Toolbar: GridToolbar,
  },
};

export const CustomCheckbox = Template.bind({});
CustomCheckbox.args = {
  components: {
    Checkbox: CustomCheckboxComponent,
  },
  checkboxSelection: true,
};

const SidePanel = ({ open }) => {
  return open && <GridPreferencesPanel />;
};
const CustomPanel2 = (props) => {
  return <div className="customPanel">{props.children}</div>;
};

export const OutsideColumnsPanel = () => {
  const data = useData(500, 50);
  const apiRef = useGridApiRef();
  const [open, setOpen] = React.useState(false);

  const handleStateChange = React.useCallback((state: GridState) => {
    const preferencePanelState = gridPreferencePanelStateSelector(state);
    const isColumnsTabOpen =
      preferencePanelState.openedPanelValue === GridPreferencePanelsValue.columns;
    setOpen(isColumnsTabOpen);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <GridApiContext.Provider value={apiRef}>
        <SidePanel open={open} />
        <div className="grid-container">
          <XGrid
            {...data}
            apiRef={apiRef}
            onStateChange={handleStateChange}
            components={{
              Panel: CustomPanel2,
              Header: GridToolbar,
            }}
          />
        </div>
      </GridApiContext.Provider>
    </div>
  );
};
