import * as React from 'react';
import {
  useGridSelector,
  gridFilteredDescendantCountLookupSelector,
  GridRenderCellParams,
  GridGroupNode,
  useGridRootProps,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import { gridRowSelector, vars } from '@mui/x-data-grid/internals';
import { useTheme } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import StyleIcon from '@mui/icons-material/Style';

const getFileIcon = (type: string, isDarkMode: boolean) => {
  const iconProps = { fontSize: 'small' as const };
  const iconSx = { mr: 1, ml: 1.5 };

  switch (type) {
    case 'folder':
      return (
        <FolderIcon
          {...iconProps}
          sx={{ mr: 1, color: isDarkMode ? '#90caf9' : '#1976d2' }}
        />
      );
    case 'tsx':
    case 'ts':
      return (
        <CodeIcon
          {...iconProps}
          sx={{ ...iconSx, color: isDarkMode ? '#5BA7E8' : '#3178c6' }}
        />
      );
    case 'json':
      return (
        <DataObjectIcon
          {...iconProps}
          sx={{ ...iconSx, color: isDarkMode ? '#fbc02d' : '#f9a825' }}
        />
      );
    case 'md':
      return (
        <DescriptionIcon
          {...iconProps}
          sx={{ ...iconSx, color: isDarkMode ? '#9e9e9e' : '#616161' }}
        />
      );
    case 'css':
      return (
        <StyleIcon
          {...iconProps}
          sx={{ ...iconSx, color: isDarkMode ? '#42a5f5' : '#1976d2' }}
        />
      );
    case 'svg':
    case 'png':
    case 'jpg':
      return (
        <ImageIcon
          {...iconProps}
          sx={{ ...iconSx, color: isDarkMode ? '#81c784' : '#43a047' }}
        />
      );
    default:
      return <InsertDriveFileIcon {...iconProps} sx={{ ...iconSx }} />;
  }
};

interface GridTreeDataGroupingCellProps extends GridRenderCellParams<
  any,
  any,
  any,
  GridGroupNode
> {}

function TreeDataSyncRowDataGroupingCell(props: GridTreeDataGroupingCellProps) {
  const { id, field, formattedValue, rowNode } = props;

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );

  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const Icon = rowNode.childrenExpanded
    ? rootProps.slots.treeDataCollapseIcon
    : rootProps.slots.treeDataExpandIcon;

  const handleClick = () => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
    apiRef.current.setCellFocus(id, field);
  };

  const row = useGridSelector(apiRef, gridRowSelector, id);

  const folderColor = isDarkMode ? '#90caf9' : '#1976d2';
  const textColor = row.type.toLowerCase() === 'folder' ? folderColor : 'inherit';

  return (
    <div
      style={{
        marginLeft: vars.spacing(rowNode.depth * 2),
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div>
        {filteredDescendantCount > 0 && (
          <rootProps.slots.baseIconButton
            size="small"
            onClick={handleClick}
            tabIndex={-1}
            aria-label={
              rowNode.childrenExpanded
                ? apiRef.current.getLocaleText('treeDataCollapse')
                : apiRef.current.getLocaleText('treeDataExpand')
            }
            {...rootProps?.slotProps?.baseIconButton}
          >
            <Icon fontSize="inherit" />
          </rootProps.slots.baseIconButton>
        )}
      </div>
      <span style={{ display: 'flex', alignItems: 'center', color: textColor }}>
        {getFileIcon(row.type.toLowerCase(), isDarkMode)}
        {formattedValue === undefined ? rowNode.groupingKey : formattedValue}
        {filteredDescendantCount > 0 ? (
          <span style={{ marginLeft: '4px' }}>({filteredDescendantCount})</span>
        ) : (
          ''
        )}
      </span>
    </div>
  );
}

export { TreeDataSyncRowDataGroupingCell };
