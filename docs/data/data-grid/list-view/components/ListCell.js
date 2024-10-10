import * as React from 'react';

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

const ICON_SIZE_BY_DENSITY = {
  compact: 24,
  standard: 32,
  comfortable: 16,
};

function Thumbnail(props) {
  const { fileIcon } = props;
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'grey.200',
        borderRadius: 1,
        width: 64,
        height: 64,
        overflow: 'hidden',
      }}
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

export function ListCell(params) {
  const {
    density,
    columns: { columnVisibilityModel },
  } = params.api.state;

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
