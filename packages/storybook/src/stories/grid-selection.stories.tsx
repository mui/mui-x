import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { XGrid, GridOptionsProp, useGridApiRef } from '@material-ui/x-grid';
import { getData, GridData } from '../data/data-service';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Selection',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const ApiPreSelectedRows = () => {
  const apiRef = useGridApiRef();
  const [data, setData] = React.useState<GridData>({ rows: [], columns: [] });

  React.useEffect(() => {
    if (data.rows.length > 0) {
      apiRef.current.selectRows([1, 3, 5]);
      apiRef.current.selectRow(8, true, true);
    }
  }, [data, apiRef]);

  React.useEffect(() => {
    setData(getData(50, 5));
  }, []);

  return <XGrid rows={data.rows} columns={data.columns} apiRef={apiRef} />;
};

export const EventsMapped = () => {
  const data = useData(200, 200);

  const options: GridOptionsProp = {
    onSelectionModelChange: (params) => action('onSelectionChange', { depth: 1 })(params),
  };

  return <XGrid rows={data.rows} columns={data.columns} {...options} />;
};

export const SingleSelect = () => {
  const data = useData(200, 200);
  return <XGrid rows={data.rows} columns={data.columns} disableMultipleSelection />;
};

export const MultipleSelect = () => {
  const data = useData(200, 200);
  return <XGrid rows={data.rows} columns={data.columns} />;
};
export const MultipleSelectWithCheckbox = () => {
  const data = useData(200, 200);
  return <XGrid rows={data.rows} columns={data.columns} checkboxSelection />;
};
export const MultipleSelectWithCheckboxNoClick = () => {
  const data = useData(200, 200);
  return (
    <XGrid rows={data.rows} columns={data.columns} checkboxSelection disableSelectionOnClick />
  );
};

export function HandleSelection() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  const handleSelection = React.useCallback(
    (model) => {
      setSelectionModel(model);
    },
    [setSelectionModel],
  );

  return (
    <XGrid
      {...data}
      checkboxSelection
      selectionModel={selectionModel}
      onSelectionModelChange={handleSelection}
    />
  );
}
export const GridSelectionModel = () => {
  const data = useData(200, 200);

  return <XGrid rows={data.rows} columns={data.columns} selectionModel={[1, 2, 3]} />;
};

export const UnselectableRows = () => {
  const data = useData(200, 200);

  return (
    <XGrid
      rows={data.rows}
      columns={data.columns}
      isRowSelectable={(params) => Number(params.id) % 2 === 0}
      checkboxSelection
    />
  );
};
export function ControlSelection() {
  const [storyState] = React.useState({
    rows: [
      {
        id: 0,
        brand: 'Nike',
        isPublished: false,
      },
      {
        id: 1,
        brand: 'Adidas',
        isPublished: true,
      },
      {
        id: 2,
        brand: 'Puma',
        isPublished: true,
      },
    ],
    columns: [{ field: 'brand' }, { field: 'isPublished', type: 'boolean' }],
  });

  const [selectionModel, setSelectionModel] = React.useState<any>([0]);
  const handleSelectionChange = React.useCallback((newModel) => {
    setSelectionModel(newModel);
  }, []);

  return (
    <div style={{ width: 300, height: 300 }}>
      <XGrid
        columns={storyState.columns}
        rows={storyState.rows}
        selectionModel={selectionModel}
        onSelectionModelChange={handleSelectionChange}
      />
    </div>
  );
}
export function NoControlSelection() {
  const [storyState] = React.useState({
    rows: [
      {
        id: 0,
        brand: 'Nike',
        isPublished: false,
      },
      {
        id: 1,
        brand: 'Adidas',
        isPublished: true,
      },
      {
        id: 2,
        brand: 'Puma',
        isPublished: true,
      },
    ],
    columns: [{ field: 'brand' }, { field: 'isPublished', type: 'boolean' }],
  });

  return (
    <div style={{ width: 300, height: 300 }}>
      <XGrid columns={storyState.columns} rows={storyState.rows} />
    </div>
  );
}
export function LargeControlSelection() {
  const { data } = useDemoData({ rowLength: 500000, dataSet: 'Commodity', maxColumns: 100 });

  const [selectionModel, setSelectionModel] = React.useState<any>([]);
  const handleSelectionChange = React.useCallback((newModel) => {
    setSelectionModel(newModel);
  }, []);

  return (
    <XGrid
      columns={data.columns}
      rows={data.rows}
      selectionModel={selectionModel}
      onSelectionModelChange={handleSelectionChange}
      checkboxSelection
    />
  );
}
