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
import ImageIcon from '../../icons/ImageIcon';
import LeftIcon from '../../icons/LeftIcon';
import { ExtendedTreeItemProps, IdType, ITEMS, ItemType } from './items';
import RightIcon from '../../icons/RightIcon';
import BottomIcon from '../../icons/BottomIcon';
import TopIcon from '../../icons/TopIcon';
import VerticalCenterIcon from '../../icons/VerticalCenterIcon';
import HorizontalCenterIcon from '../../icons/HorizontalCenterIcon';
import ComponentIcon from '../../icons/ComponentIcon';
import TextIcon from '../../icons/TextIcon';
import FrameIcon from '../../icons/FrameIcon';

const getIconFromItemType = (itemType: ItemType) => {
  switch (itemType) {
    case 'image':
      return ImageIcon;
    case 'left':
      return LeftIcon;
    case 'right':
      return RightIcon;
    case 'bottom':
      return BottomIcon;
    case 'top':
      return TopIcon;
    case 'vertical_center':
      return VerticalCenterIcon;
    case 'horizontal_center':
      return HorizontalCenterIcon;
    case 'component':
      return ComponentIcon;
    case 'text':
      return TextIcon;
    default:
      return FrameIcon;
  }
};

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

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
  // ...other styles
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
  marginBottom: theme.spacing(0.5),
}));
const CustomTreeItemRoot = styled(TreeItemRoot)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
  },
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
    publicAPI,
  } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;

  const Icon = getIconFromItemType(item.itemType);

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
        <CustomTreeItemContent {...getContentProps()}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexGrow={1}
            justifyContent="flex-start"
            sx={
              item.itemType === 'component'
                ? (theme) => ({
                    color: 'primary.dark',
                    ...theme.applyStyles('dark', {
                      color: 'primary.light',
                    }),
                  })
                : {}
            }
          >
            <TreeItemIconContainer
              {...getIconContainerProps({ sx: { '& svg': { fontSize: 13 } } })}
            >
              <TreeItemIcon status={status} />
            </TreeItemIconContainer>
            <TreeItemCheckbox {...getCheckboxProps()} />
            <Icon sx={{ fontSize: 12 }} />
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
              onClick={() => {
                publicAPI.setIsItemDisabled({ itemId });
              }}
            >
              {status.disabled ? (
                <Tooltip title="Unlock" arrow>
                  <LockOutlinedIcon sx={{ fontSize: 16 }} />
                </Tooltip>
              ) : (
                <Tooltip title="Lock" arrow>
                  <LockOpenOutlinedIcon sx={{ fontSize: 16 }} />
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

export const figma = {
  darker: 'hsl(269, 99%, 21%)',
  dark: 'hsl(269, 98%, 39%)',
  main: 'hsl(269, 100%, 57%)',
  light: 'hsl(269, 97%, 76%)',
  lighter: 'hsl(269, 95%, 90%)',
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
        light: figma.lighter,
        main: figma.main,
        dark: figma.dark,
        contrastText: '#fff',
        ...(mode === 'dark' && {
          contrastText: '#fff',
          light: figma.light,
          main: figma.main,
          dark: figma.darker,
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

type FigmaTreeViewProps = {
  selectedItem: IdType | null;
  setSelectedItem: (value: IdType | null) => void;
};

export default function FigmaTreeView({ selectedItem, setSelectedItem }: FigmaTreeViewProps) {
  const currentTheme = useTheme();

  const customTheme = createTheme(getTheme(currentTheme.palette.mode));

  return (
    <ThemeProvider theme={customTheme}>
      <RichTreeView
        items={ITEMS}
        defaultExpandedItems={['paper', 'header', 'header_content', 'content', 'avatar', 'actions']}
        selectedItems={selectedItem}
        onSelectedItemsChange={(_event, itemId) => {
          setSelectedItem(itemId ? (itemId as IdType) : null);
        }}
        sx={{ height: 'fit-content', flexGrow: 1, width: 300, overflowY: 'auto' }}
        slots={{ item: CustomTreeItem }}
        itemChildrenIndentation={12}
        expansionTrigger="iconContainer"
      />
    </ThemeProvider>
  );
}
