import * as React from 'react';
import { animated, useSpring } from '@react-spring/web';
import {
  ThemeOptions,
  ThemeProvider,
  createTheme,
  useTheme,
  alpha,
  styled,
} from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import Stack from '@mui/material/Stack';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemCheckbox,
  TreeItemContent,
  TreeItemGroupTransition,
  TreeItemIconContainer,
  TreeItemLabel,
  TreeItemRoot,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { ExtendedTreeItemProps, ITEMS, ItemType } from './items';
import StateAddedIcon from '../../icons/StateAddedIcon';
import StateDeletedIcon from '../../icons/StateDeletedIcon';
import StateModifiedIcon from '../../icons/StateModifiedIcon';

const getIconFromItemType = (itemType: ItemType) => {
  switch (itemType) {
    case 'added':
      return StateAddedIcon;
    case 'deleted':
      return StateDeletedIcon;
    default:
      return StateModifiedIcon;
  }
};

const CustomGroupTransition = styled(TreeItemGroupTransition)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  marginLeft: `calc(${theme.spacing(0.2)} + 3px + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  ...theme.applyStyles('dark', {
    borderLeftColor: theme.palette.grey[600],
  }),
}));

const AnimatedCollapse = animated(CustomGroupTransition);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  gap: theme.spacing(1.5),
  paddingLeft: `calc(${theme.spacing(0.2)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth)/2)`,
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  color: theme.palette.grey[500],
  borderLeft: `3px solid transparent`,
  '&[data-selected]': {
    borderLeftColor: theme.palette.primary.main,
    color: theme.palette.grey[700],
    backgroundColor: alpha(theme.palette.grey[300], 0.2),
    '&:hover': {
      backgroundColor: alpha(theme.palette.grey[300], 0.3),
    },
    '&[data-focused]': {
      backgroundColor: alpha(theme.palette.grey[300], 0.4),
      '&:hover': {
        backgroundColor: alpha(theme.palette.grey[300], 0.5),
      },
    },
  },
  '&[data-focused][data-selected]': {
    backgroundColor: alpha(theme.palette.grey[300], 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.grey[300], 0.2),
    },
  },
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[300],
    '&[data-selected]': {
      color: theme.palette.grey[50],
      backgroundColor: alpha(theme.palette.grey[600], 0.6),
      '&:hover': {
        backgroundColor: alpha(theme.palette.grey[600], 0.7),
      },
      '&[data-focused]': {
        backgroundColor: alpha(theme.palette.grey[600], 0.8),
        '&:hover': {
          backgroundColor: alpha(theme.palette.grey[600], 0.9),
        },
      },
    },
    '&[data-focused][data-selected]': {
      backgroundColor: alpha(theme.palette.grey[600], 0.3),
      '&:hover': {
        backgroundColor: alpha(theme.palette.grey[600], 0.4),
      },
    },
  }),
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: UseTreeItemParameters,
  ref: React.Ref<HTMLLIElement>,
) {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

  const Icon = getIconFromItemType(item.itemType as ItemType);

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ maxWidth: '100%' }}
            flexGrow={1}
            spacing={0.5}
          >
            <TreeItemIconContainer
              {...getIconContainerProps({ sx: { '& svg': { fontSize: 13 } } })}
            >
              <TreeItemIcon status={status} />
            </TreeItemIconContainer>
            <TreeItemCheckbox {...getCheckboxProps()} />
            {status.expandable ? (
              <FolderIcon fontSize="small" />
            ) : (
              <InsertDriveFileOutlinedIcon fontSize="small" />
            )}
            <TreeItemLabel
              {...getLabelProps({
                sx: (theme) => ({
                  ...theme.typography.body2,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  flexGrow: 1,
                }),
              })}
            />
            {!status.expandable && (
              <Stack direction="row" spacing={1} paddingLeft={1} alignItems="center">
                <Icon sx={{ fontSize: 12 }} />
              </Stack>
            )}
          </Stack>
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export const gray = {
  50: 'hsl(220, 60%, 99%)',
  100: 'hsl(220, 35%, 94%)',
  200: 'hsl(220, 35%, 88%)',
  300: 'hsl(220, 25%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 25%, 35%)',
  700: 'hsl(220, 25%, 25%)',
  800: 'hsl(220, 25%, 10%)',
  900: 'hsl(220, 30%, 5%)',
};

export const github = {
  darker: 'hsl(212, 92%, 20%)',
  dark: 'hsl(212, 92%, 30%)',
  main: 'hsl(212, 92%, 45%)',
  light: 'hsl(212, 92%, 60%)',
  lighter: 'hsl(212, 92%, 85%)',
};
export const red = {
  darker: 'hsl(11, 100%, 34%)',
  dark: 'hsl(11, 100%, 45%)',
  main: 'hsl(11, 100%, 60%)',
  light: 'hsl(11, 100%, 72%)',
  lighter: 'hsl(11, 100%, 85%)',
};
export const yellow = {
  darker: 'hsl(47, 87%, 42%)',
  dark: 'hsl(50, 87%, 46%)',
  main: 'hsl(48, 87%, 60%)',
  light: 'hsl(52, 87%, 67%)',
  lighter: 'hsl(47, 88%, 84%)',
};
export const green = {
  darker: 'hsl(137, 57%, 20%)',
  dark: 'hsl(137, 57%, 33%)',
  main: 'hsl(137, 57%, 41%)',
  light: 'hsl(137, 57%, 52%)',
  lighter: 'hsl(137, 57%, 78%)',
};

const getTheme = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    palette: {
      mode,
      background: {
        default: gray[50],
        paper: '#FFFFFF',
        ...(mode === 'dark' && {
          default: gray[900],
          paper: '#14181F',
        }),
      },
      primary: {
        light: github.lighter,
        main: github.main,
        dark: github.dark,
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: github.light,
          main: github.main,
          dark: github.darker,
        }),
      },
      success: {
        light: green.lighter,
        main: green.main,
        dark: green.darker,
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: green.light,
          main: green.main,
          dark: green.darker,
        }),
      },
      error: {
        light: red.lighter,
        main: red.main,
        dark: red.darker,
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: red.light,
          main: red.main,
          dark: red.darker,
        }),
      },
      warning: {
        light: yellow.lighter,
        main: yellow.main,
        dark: yellow.darker,
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: yellow.light,
          main: yellow.main,
          dark: yellow.darker,
        }),
      },
      grey: gray,
      divider: alpha(gray[300], 0.5),
      ...(mode === 'dark' && {
        divider: alpha(gray[700], 0.5),
      }),
      action: {
        activatedOpacity: 0.2,
        active: alpha(gray[500], 0.5),
        disabled: alpha(gray[500], 0.2),
        disabledBackground: alpha(gray[300], 0.12),
        focus: alpha(gray[500], 0.12),
        hover: alpha(gray[400], 0.08),
        hoverOpacity: 0.08,
        selected: alpha(gray[500], 0.16),
        selectedOpacity: 0.16,
      },
    },
    typography: {
      fontFamily: ['"Inter", "sans-serif"'].join(','),
      fontSize: 13,
      button: {
        textTransform: 'none',
      },
      overline: { textTransform: 'none', fontWeight: 600 },
      body2: {
        fonsWeight: 300,
        fontSize: '0.8rem',
      },
    },
  };
};

type GitHubTreeViewProps = {
  selectedItem: string | null;
  setSelectedItem: (value: string | null) => void;
};

export default function GitHubTreeView({ selectedItem, setSelectedItem }: GitHubTreeViewProps) {
  const currentTheme = useTheme();

  const customTheme = createTheme(getTheme(currentTheme.palette.mode));

  return (
    <ThemeProvider theme={customTheme}>
      <RichTreeView
        items={ITEMS}
        defaultExpandedItems={['1', '2', '3', '2.1', '2.2', '2.3', '3.1']}
        selectedItems={selectedItem}
        onSelectedItemsChange={(_, itemId) => {
          setSelectedItem(itemId);
        }}
        sx={{ height: 'fit-content', flexGrow: 1, width: 300, overflowY: 'auto' }}
        slots={{ item: CustomTreeItem }}
        itemChildrenIndentation={12}
      />
    </ThemeProvider>
  );
}
