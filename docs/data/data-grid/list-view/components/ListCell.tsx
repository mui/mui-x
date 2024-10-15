import * as React from 'react';
import {
  gridColumnVisibilityModelSelector,
  GridDensity,
  gridDensitySelector,
  GridRenderCellParams,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  CardDetailList,
  CardDetail,
  CardTitle,
  CardMedia,
} from './Card';
import { FileIcon } from './FileIcon';
import { formatDate, formatSize } from '../utils';
import { RowModel } from '../types';

const ICON_SIZE_BY_DENSITY: Record<GridDensity, number> = {
  compact: 24,
  standard: 32,
  comfortable: 16,
};

function Thumbnail(props: { fileIcon: React.ReactNode }) {
  const { fileIcon } = props;
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        borderRadius: 1,
        width: 64,
        height: 64,
        overflow: 'hidden',
        backgroundColor: 'grey.200',
        ...theme.applyStyles('dark', {
          backgroundColor: 'grey.800',
        }),
      })}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          left: 4,
          display: 'flex',
        }}
      >
        {fileIcon}
      </Box>
    </Box>
  );
}

export function ListCell(params: GridRenderCellParams<RowModel>) {
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);
  const columnVisibilityModel = useGridSelector(
    apiRef,
    gridColumnVisibilityModelSelector,
  );

  const showCreatedBy = columnVisibilityModel.createdBy !== false;
  const showSize = columnVisibilityModel.size !== false;
  const showCreatedAt = columnVisibilityModel.createdAt !== false;
  const showUpdatedAt = columnVisibilityModel.updatedAt !== false;
  const showThumbnail = density === 'comfortable';

  const icon = (
    <FileIcon
      type={params.row.type}
      sx={{ fontSize: ICON_SIZE_BY_DENSITY[density] }}
    />
  );

  return (
    <Card>
      <CardMedia>{showThumbnail ? <Thumbnail fileIcon={icon} /> : icon}</CardMedia>
      <CardContent>
        <CardTitle>{params.row.name}</CardTitle>
        {density !== 'compact' && (showCreatedBy || showSize) && (
          <CardDetailList>
            {showCreatedBy && <CardDetail>{params.row.createdBy}</CardDetail>}
            {showSize && <CardDetail>{formatSize(params.row.size)}</CardDetail>}
          </CardDetailList>
        )}
        {density === 'comfortable' && (showCreatedAt || showUpdatedAt) && (
          <CardDetail>
            {showUpdatedAt && `Updated ${formatDate(params.row.updatedAt)}`}
          </CardDetail>
        )}
      </CardContent>
    </Card>
  );
}
