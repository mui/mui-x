import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const CustomFilterPanelContext = React.createContext<React.Dispatch<
  React.SetStateAction<HTMLButtonElement | null>
> | null>(null);

const CustomToolbar = () => {
  const setFilterButtonEl = React.useContext(CustomFilterPanelContext);

  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
};

export default function CustomFilterPanel() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterButtonEl, setFilterButtonEl] =
    React.useState<HTMLButtonElement | null>(null);

  return (
    <CustomFilterPanelContext.Provider value={setFilterButtonEl}>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          {...data}
          components={{
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            panel: {
              anchorEl: filterButtonEl,
            },
          }}
        />
      </div>
    </CustomFilterPanelContext.Provider>
  );
}
