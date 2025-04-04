import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import {
  ThemeOptions,
  ThemeProvider,
  createTheme,
  useTheme,
  alpha,
  styled,
  Theme,
} from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  useTreeItem,
  UseTreeItemParameters,
  UseTreeItemContentSlotOwnProps,
  UseTreeItemGroupTransitionSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemCheckbox,
  TreeItemContent,
  TreeItemGroupTransition,
  TreeItemIconContainer,
  TreeItemLabel,
  TreeItemRoot,
  treeItemClasses,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { TreeViewSelectionPropagation } from '@mui/x-tree-view/models';
import { Corner, Density } from './PlaygroundThemeConfig';
import { ExtendedTreeItemProps, ITEMS } from './items';

const CustomGroupTransition = styled(TreeItemGroupTransition, {
  shouldForwardProp: (prop) => prop !== 'showChildrenOutline',
})(
  ({
    theme,
    showChildrenOutline,
  }: { theme: Theme } & UseTreeItemGroupTransitionSlotOwnProps & {
      showChildrenOutline: boolean;
    }) =>
    showChildrenOutline
      ? {
          borderLeft: `1px solid ${theme.palette.grey[300]}`,
          marginLeft: `calc(${theme.spacing(0.5)} + 6px)`,
          ...theme.applyStyles('dark', {
            borderLeftColor: theme.palette.grey[600],
          }),
        }
      : {},
);

const AnimatedCollapse = animated(CustomGroupTransition);

function TransitionComponent(
  props: UseTreeItemGroupTransitionSlotOwnProps & {
    showChildrenOutline: boolean;
  },
) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

interface CustomTreeItemContentProps extends UseTreeItemContentSlotOwnProps {
  corner: Corner;
  density: Density;
}

const CustomTreeItemContent = styled(TreeItemContent)(({
  theme,
  status,
  density,
  corner,
}: { theme: Theme } & CustomTreeItemContentProps) => {
  let borderRadius = 4;
  if (corner === 'rounded') {
    borderRadius = 30;
  } else if (corner === 'rectangular') {
    borderRadius = 1;
  }
  return {
    // ...other styles
    paddingLeft: theme.spacing(0.5),
    borderRadius,
    color: theme.palette.grey[600],
    ...(density === 'spacious' && {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    }),
    ...(density === 'compact' && {
      paddingTop: theme.spacing(0.1),
      paddingBottom: theme.spacing(0.1),
    }),
    ...(status.selected && {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.dark,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.13),
      },
      ...(status.focused && {
        backgroundColor: alpha(theme.palette.primary.main, 0.17),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
      }),
    }),
    ...(status.focused &&
      !status.selected && {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),

        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.07),
        },
      }),
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[400],
      ...(status.selected && {
        color: theme.palette.primary.light,
      }),
    }),
  };
});
const CustomTreeItemRoot = styled(TreeItemRoot)(({ theme }) => ({
  paddingLeft: theme.spacing(0.5),
}));

interface CustomTreeItemProps extends UseTreeItemParameters {
  showFolderIcon: boolean;
  density: Density;
  corner: Corner;
  showChildrenOutline: boolean;
  showDisableButton: boolean;
  showSecondaryLabel: boolean;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    id,
    itemId,
    label,
    disabled,
    children,
    corner,
    density,
    showFolderIcon,
    showChildrenOutline,
    showDisableButton,
    showSecondaryLabel,
    ...other
  } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <CustomTreeItemRoot
        {...getRootProps({
          ...other,
          className: clsx(treeItemClasses.root, {
            'Mui-selected': status.selected,
            'Mui-disabled': status.disabled,
          }),
        })}
      >
        <CustomTreeItemContent {...getContentProps({ corner, density })}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexGrow={1}
            justifyContent="flex-start"
          >
            <TreeItemIconContainer
              {...getIconContainerProps({ sx: { '& svg': { fontSize: 13 } } })}
            >
              <TreeItemIcon status={status} />
            </TreeItemIconContainer>
            {status.expandable &&
              showFolderIcon &&
              (status.expanded ? (
                <FolderOpenOutlinedIcon sx={{ fontSize: 18, opacity: 0.8 }} />
              ) : (
                <FolderIcon sx={{ fontSize: 18, opacity: 0.8 }} />
              ))}

            <TreeItemCheckbox {...getCheckboxProps()} />
            <Stack spacing={density === 'compact' ? 0.2 : 0.5}>
              <TreeItemLabel
                {...getLabelProps({
                  sx: (theme) => ({
                    ...theme.typography.body2,
                  }),
                })}
              />
              {showSecondaryLabel && (
                <Typography variant="caption" color="text.secondary">
                  {item.secondaryLabel}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {showDisableButton && (
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  publicAPI.setIsItemDisabled({ itemId });
                }}
                sx={{
                  color: 'inherit',
                  padding: density === 'compact' ? 0.2 : 0.6,
                }}
              >
                {status.disabled ? (
                  <Tooltip title="Unlock" arrow>
                    <LockOutlinedIcon
                      sx={{ fontSize: density === 'compact' ? 14 : 16, color: 'inherit' }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Lock" arrow>
                    <LockOpenOutlinedIcon
                      sx={{ fontSize: density === 'compact' ? 14 : 16, color: 'inherit' }}
                    />
                  </Tooltip>
                )}
              </IconButton>
            )}
          </Stack>
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps({ showChildrenOutline })} />}
      </CustomTreeItemRoot>
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

export const orange = {
  darker: 'hsl(20, 70%, 25%)',
  dark: 'hsl(20, 70%, 40%)',
  main: 'hsl(20, 70%, 50%)',
  light: 'hsl(20, 70%, 75%)',
  lighter: 'hsl(20, 70%, 88%)',
  contrastText: '#fff',
};
export const purple = {
  darker: 'hsl(239, 100%, 23%)',
  dark: 'hsl(239, 100%, 56%)',
  main: 'hsl(239, 100%, 64%)',
  light: 'hsl(239, 100%, 77%)',
  lighter: 'hsl(239, 100%, 90%)',
  contrastText: '#fff',
};
export const grayMain = {
  darker: 'hsl(220, 25%, 10%)',
  dark: 'hsl(220, 25%, 20%)',
  main: 'hsl(220, 25%, 35%)',
  light: 'hsl(220, 25%, 80%)',
  lighter: 'hsl(220, 35%, 94%)',
  contrastText: '#fff',
};
const getColor = (color: string) => {
  if (color === 'default') {
    return grayMain;
  }
  if (color === 'purple') {
    return purple;
  }
  return orange;
};
const getTheme = (mode: 'light' | 'dark', colorProp: string): ThemeOptions => {
  const color = getColor(colorProp);

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
        light: color.light,
        main: color.main,
        dark: color.darker,
        contrastText: color.contrastText,
        ...(mode === 'dark' && {
          contrastText: color.contrastText,
          light: color.lighter,
          main: color.main,
          dark: color.darker,
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

type TreeViewProps = {
  color: string;
  corner: Corner;
  density: Density;
  showFolderIcon: boolean;
  showChildrenOutline: boolean;
  showDisableButton: boolean;
  showSecondaryLabel: boolean;
  isCheckboxSelectionEnabled: boolean;
  isMultiSelectEnabled: boolean;
  selectionPropagation: TreeViewSelectionPropagation;
};

export default function PlaygroundTreeView({
  color,
  corner,
  density,
  showFolderIcon,
  showChildrenOutline,
  showDisableButton,
  showSecondaryLabel,
  isCheckboxSelectionEnabled,
  isMultiSelectEnabled,
  selectionPropagation,
}: TreeViewProps) {
  const [selectedItems, setSelectedItems] = React.useState<string | string[] | null>(null);

  const currentTheme = useTheme();
  const customTheme = createTheme(getTheme(currentTheme.palette.mode, color));

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      pl={1}
      py={1}
      sx={(theme) => ({
        borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
        height: '100%',
        width: '100%',
        flexGrow: 1,
        backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(to right,${theme.palette.divider} 1px, ${theme.palette.background.paper} 1px)`,
        backgroundSize: '20px 20px',
      })}
    >
      <ThemeProvider theme={customTheme}>
        <Paper variant="outlined" sx={{ padding: 2, minHeight: 480, overflow: 'auto' }}>
          <RichTreeView
            items={ITEMS}
            defaultExpandedItems={[
              'paper',
              'header',
              'header_content',
              'content',
              'avatar',
              'actions',
            ]}
            defaultSelectedItems={['avatar']}
            sx={{ flexGrow: 1, width: 300, height: '100%' }}
            slots={{ item: CustomTreeItem as any }}
            itemChildrenIndentation={12}
            slotProps={{
              item: {
                corner,
                density,
                showFolderIcon,
                showChildrenOutline,
                showDisableButton,
                showSecondaryLabel,
              } as CustomTreeItemProps,
            }}
            checkboxSelection={isCheckboxSelectionEnabled}
            multiSelect={isMultiSelectEnabled}
            selectionPropagation={selectionPropagation}
            selectedItems={selectedItems}
            onSelectedItemsChange={(_event, items) => {
              setSelectedItems(items);
            }}
          />
        </Paper>
      </ThemeProvider>
    </Stack>
  );
}
