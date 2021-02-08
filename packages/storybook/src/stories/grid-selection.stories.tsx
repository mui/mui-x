import { useDemoData } from '@material-ui/x-grid-data-generator';
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import {
  XGrid,
  GridOptionsProp,
  useApiRef,
  SelectionModelChangeParams,
  RowId,
} from '@material-ui/x-grid';
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
  const apiRef = useApiRef();
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
    onRowSelected: (params) => action('onRowSelected')(params),
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

  const [selectionModel, setSelectionModel] = React.useState<RowId[]>([]);
  const handleSelection = React.useCallback(
    (params: SelectionModelChangeParams) => {
      setSelectionModel(params.selectionModel);
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
export const SelectionModel = () => {
  const data = useData(200, 200);

  return <XGrid rows={data.rows} columns={data.columns} selectionModel={[1, 2, 3]} />;
};
