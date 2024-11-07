/**
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
 * All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
 * provided that the above copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
 * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
import * as React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/joy/SvgIcon';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridSortDirection } from '../models/gridSortModel';
import { GridIconSlotsComponent } from '../models/gridIconSlotsComponent';

function createSvgIcon(path: React.ReactNode, displayName: string): typeof SvgIcon {
  const fontSizeMap = { small: 'lg', medium: 'xl', large: 'xl2', inherit: undefined } as const;
  // @ts-ignore internal component
  function Component({ sx, fontSize, ...props }, ref) {
    return (
      <SvgIcon
        data-testid={`${displayName}Icon`}
        ref={ref}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={[{ fill: 'none' }, ...(Array.isArray(sx) ? sx : [sx])]}
        fontSize={fontSize ? fontSizeMap[fontSize as keyof typeof fontSizeMap] : undefined}
        {...props}
      >
        {path}
      </SvgIcon>
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}Icon`;
  }

  // @ts-ignore internal component
  Component.muiName = SvgIcon.muiName;

  // @ts-ignore internal component
  return React.memo(React.forwardRef(Component));
}

export const GridArrowUpwardIcon = createSvgIcon(
  <React.Fragment>
    <line x1="12" x2="12" y1="19" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </React.Fragment>,
  'ArrowUpward',
);

export const GridArrowDownwardIcon = createSvgIcon(
  <React.Fragment>
    <line x1="12" x2="12" y1="5" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </React.Fragment>,
  'ArrowDownward',
);

export const GridKeyboardArrowLeft = createSvgIcon(
  <polyline points="15 18 9 12 15 6" />,
  'KeyboardArrowLeft',
);

export const GridKeyboardArrowRight = createSvgIcon(
  <polyline points="9 18 15 12 9 6" />,
  'KeyboardArrowRight',
);

export const GridExpandMoreIcon = createSvgIcon(
  <React.Fragment>
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </React.Fragment>,
  'ExpandMore',
);

export const GridFilterListIcon = createSvgIcon(
  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  'FilterList',
);
export const GridFilterAltIcon = createSvgIcon(
  <React.Fragment>
    <path d="M3 6h18" />
    <path d="M7 12h10" />
    <path d="M10 18h4" />
  </React.Fragment>,
  'FilterAlt',
);

export const GridSearchIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </React.Fragment>,
  'Search',
);

export const GridMenuIcon = createSvgIcon(
  <React.Fragment>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 8h10" />
    <path d="M7 12h10" />
    <path d="M7 16h10" />
  </React.Fragment>,
  'Menu',
);

export const GridCheckCircleIcon = createSvgIcon(
  <React.Fragment>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </React.Fragment>,
  'CheckCircle',
);

export const GridColumnIcon = createSvgIcon(
  <React.Fragment>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="12" x2="12" y1="3" y2="21" />
  </React.Fragment>,
  'ColumnIcon',
);

export const GridSeparatorIcon = createSvgIcon(<path d="M11 19V5h2v14z" />, 'Separator');

export const GridViewHeadlineIcon = createSvgIcon(
  <path
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    d="M3 12h18M3 12v4.5M3 12V7.5M21 12v4.5m0-4.5V7.5m-18 9v3.9a.6.6 0 0 0 .6.6h16.8a.6.6 0 0 0 .6-.6v-3.9m-18 0h18m0-9V3.6a.6.6 0 0 0-.6-.6H3.6a.6.6 0 0 0-.6.6v3.9m18 0H3"
  />,
  'ViewHeadline',
);

export const GridTableRowsIcon = createSvgIcon(
  <path
    fill="currentColor"
    strokeWidth="0"
    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h14zm0 5v4H5v-4h14zM5 19v-3h14v3H5z"
  />,
  'TableRows',
);

export const GridViewStreamIcon = createSvgIcon(
  <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 6h16" />,
  'ViewStream',
);

export const GridTripleDotsVerticalIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </React.Fragment>,
  'TripleDotsVertical',
);

export const GridCloseIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" x2="9" y1="9" y2="15" />
    <line x1="9" x2="15" y1="9" y2="15" />
  </React.Fragment>,
  'Close',
);

export const GridAddIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="16" />
    <line x1="8" x2="16" y1="12" y2="12" />
  </React.Fragment>,
  'Add',
);

export const GridRemoveIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" x2="9" y1="9" y2="15" />
    <line x1="9" x2="15" y1="9" y2="15" />
  </React.Fragment>,
  'Remove',
);

export const GridLoadIcon = createSvgIcon(
  <React.Fragment>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </React.Fragment>,
  'Load',
);

export const GridDragIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="19" r="1" />
  </React.Fragment>,
  'Drag',
);

export const GridSaveAltIcon = createSvgIcon(
  <React.Fragment>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 12v6" />
    <path d="m15 15-3-3-3 3" />
  </React.Fragment>,
  'SaveAlt',
);

export const GridCheckIcon = createSvgIcon(<polyline points="20 6 9 17 4 12" />, 'Check');

export const GridMoreVertIcon = createSvgIcon(
  <React.Fragment>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </React.Fragment>,
  'MoreVert',
);

export const GridVisibilityOffIcon = createSvgIcon(
  <React.Fragment>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </React.Fragment>,
  'VisibilityOff',
);

export const GridViewColumnIcon = createSvgIcon(
  <React.Fragment>
    <rect width="6" height="20" x="4" y="2" rx="2" />
    <rect width="6" height="20" x="14" y="2" rx="2" />
  </React.Fragment>,
  'ViewColumn',
);

export const GridClearIcon = createSvgIcon(
  <React.Fragment>
    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
    <path d="M22 21H7" />
    <path d="m5 11 9 9" />
  </React.Fragment>,
  'Clear',
);

export const GridDeleteIcon = createSvgIcon(
  <React.Fragment>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </React.Fragment>,
  'Delete',
);

export const GridDeleteForeverIcon = createSvgIcon(
  <React.Fragment>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </React.Fragment>,
  'Delete',
);

interface GridColumnUnsortedIconProps extends SvgIconProps {
  sortingOrder: GridSortDirection[];
}
const GridColumnUnsortedIcon = React.memo(function GridColumnHeaderSortIcon(
  props: GridColumnUnsortedIconProps,
) {
  const { sortingOrder, ...other } = props;
  const rootProps = useGridRootProps();
  const [nextSortDirection] = sortingOrder;

  const Icon =
    nextSortDirection === 'asc'
      ? rootProps.slots.columnSortedAscendingIcon
      : rootProps.slots.columnSortedDescendingIcon;

  return Icon ? <Icon {...other} /> : null;
});

const joyIconSlots: GridIconSlotsComponent = {
  booleanCellTrueIcon: GridCheckIcon,
  booleanCellFalseIcon: GridCloseIcon,
  columnMenuIcon: GridTripleDotsVerticalIcon,
  openFilterButtonIcon: GridFilterListIcon,
  filterPanelDeleteIcon: GridCloseIcon,
  columnFilteredIcon: GridFilterAltIcon,
  columnSelectorIcon: GridColumnIcon,
  columnUnsortedIcon: GridColumnUnsortedIcon,
  columnSortedAscendingIcon: GridArrowUpwardIcon,
  columnSortedDescendingIcon: GridArrowDownwardIcon,
  columnResizeIcon: GridSeparatorIcon,
  densityCompactIcon: GridViewHeadlineIcon,
  densityStandardIcon: GridTableRowsIcon,
  densityComfortableIcon: GridViewStreamIcon,
  exportIcon: GridSaveAltIcon,
  moreActionsIcon: GridMoreVertIcon,
  treeDataCollapseIcon: GridExpandMoreIcon,
  treeDataExpandIcon: GridKeyboardArrowRight,
  groupingCriteriaCollapseIcon: GridExpandMoreIcon,
  groupingCriteriaExpandIcon: GridKeyboardArrowRight,
  detailPanelExpandIcon: GridAddIcon,
  detailPanelCollapseIcon: GridRemoveIcon,
  rowReorderIcon: GridDragIcon,
  quickFilterIcon: GridSearchIcon,
  quickFilterClearIcon: GridCloseIcon,
  columnMenuHideIcon: GridVisibilityOffIcon,
  columnMenuSortAscendingIcon: GridArrowUpwardIcon,
  columnMenuSortDescendingIcon: GridArrowDownwardIcon,
  columnMenuFilterIcon: GridFilterAltIcon,
  columnMenuManageColumnsIcon: GridViewColumnIcon,
  columnMenuClearIcon: GridClearIcon,
  loadIcon: GridLoadIcon,
  filterPanelAddIcon: GridAddIcon,
  filterPanelRemoveAllIcon: GridDeleteForeverIcon,
  columnReorderIcon: GridDragIcon,
};

export default joyIconSlots;
