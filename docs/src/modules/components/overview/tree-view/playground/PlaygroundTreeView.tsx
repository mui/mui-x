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
} from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
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

import { ExtendedTreeItemProps, IdType, ITEMS, ItemType } from './items';

const AnimatedCollapse = animated(TreeItemGroupTransition);

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const CustomTreeItemContent = styled(TreeItemContent)(({ theme, status }) => ({
  // ...other styles
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  //   borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
  //   marginBottom: theme.spacing(0.5),
  ...(status.selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.8),
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.85),
    },
    ...(status.focused && {
      backgroundColor: alpha(theme.palette.primary.main, 0.88),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.9),
      },
    }),
  }),
  ...(status.focused &&
    !status.selected && {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),

      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
      },
    }),
}));
const CustomTreeItemRoot = styled(TreeItemRoot)(({ theme, ...x }) => {
  console.log(x);
  return {
    'aria-selected': {
      // backgroundColor: alpha(theme.palette.primary.main, 0.08),
      // borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
    },
  };
});

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
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx(treeItemClasses.content, {
              'Mui-selected': status.selected,
              'Mui-disabled': status.disabled,
            }),
          })}
        >
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
            <TreeItemCheckbox {...getCheckboxProps()} />
            <TreeItemLabel
              {...getLabelProps({
                sx: (theme) => ({
                  ...theme.typography.body2,
                }),
              })}
            />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                publicAPI.setIsItemDisabled({ itemId });
              }}
              sx={(theme) => ({
                color: theme.palette.grey[400],
                ...(status.selected && {
                  color: theme.palette.grey[50],
                }),
              })}
            >
              {status.disabled ? (
                <Tooltip title="Unlock" arrow>
                  <LockOutlinedIcon sx={{ fontSize: 16, color: 'inherit' }} />
                </Tooltip>
              ) : (
                <Tooltip title="Lock" arrow>
                  <LockOpenOutlinedIcon sx={{ fontSize: 16, color: 'inherit' }} />
                </Tooltip>
              )}
            </IconButton>
          </Stack>
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
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

export const purple = {
  darker: 'hsl(239, 100%, 33%)',
  dark: 'hsl(239, 100%, 56%)',
  main: 'hsl(239, 100%, 64%)',
  light: 'hsl(239, 100%, 77%)',
  lighter: 'hsl(239, 100%, 90%)',
};
export const grayMain = {
  darker: 'hsl(220, 25%, 10%)',
  dark: 'hsl(220, 25%, 20%)',
  main: 'hsl(220, 25%, 35%)',
  light: 'hsl(220, 25%, 80%)',
  lighter: 'hsl(220, 35%, 94%)',
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
        light: grayMain.lighter,
        main: grayMain.main,
        dark: grayMain.dark,
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: grayMain.light,
          main: grayMain.main,
          dark: grayMain.darker,
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

type PurpleTreeViewProps = {};

export default function PlaygroundTreeView() {
  const currentTheme = useTheme();

  const customTheme = createTheme(getTheme(currentTheme.palette.mode));

  return (
    <ThemeProvider theme={customTheme}>
      <RichTreeView
        items={ITEMS}
        defaultExpandedItems={['paper', 'header', 'header_content', 'content', 'avatar', 'actions']}
        sx={{ height: 'fit-content', flexGrow: 1, width: 300, overflowY: 'auto' }}
        slots={{ item: CustomTreeItem }}
        itemChildrenIndentation={12}
      />
    </ThemeProvider>
  );
}
