import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import {
  useTreeView,
  TreeViewProvider,
  buildWarning,
  RichTreeViewItems,
} from '@mui/x-tree-view/internals';
import { Watermark } from '@mui/x-license';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { getRichTreeViewProUtilityClass } from './richTreeViewProClasses';
import { RichTreeViewProProps } from './RichTreeViewPro.types';
import {
  RICH_TREE_VIEW_PRO_PLUGINS,
  RichTreeViewProPluginSignatures,
} from './RichTreeViewPro.plugins';
import { getReleaseInfo } from '../internals/utils/releaseInfo';
import { TreeViewVirtualScroller } from '../TreeViewVirtualScroller';

const useThemeProps = createUseThemeProps('MuiRichTreeViewPro');

const useUtilityClasses = <R extends {}, Multiple extends boolean | undefined>(
  ownerState: RichTreeViewProProps<R, Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getRichTreeViewProUtilityClass, classes);
};

export const RichTreeViewProRoot = styled('ul', {
  name: 'MuiRichTreeViewPro',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: RichTreeViewProProps<any, any> }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
  position: 'relative',
});

type RichTreeViewProComponent = (<R extends {}, Multiple extends boolean | undefined = undefined>(
  props: RichTreeViewProProps<R, Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

const releaseInfo = getReleaseInfo();

const childrenWarning = buildWarning([
  'MUI X: The `RichTreeViewPro` component does not support JSX children.',
  'If you want to add items, you need to use the `items` prop',
  'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/',
]);

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [RichTreeView API](https://mui.com/x/api/tree-view/rich-tree-view/)
 */
const RichTreeViewPro = React.forwardRef(function RichTreeViewPro<
  R extends {},
  Multiple extends boolean | undefined = undefined,
>(inProps: RichTreeViewProProps<R, Multiple>, ref: React.Ref<HTMLUListElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiRichTreeViewPro' });

  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).children != null) {
      childrenWarning();
    }
  }

  const { getRootProps, contextValue, instance } = useTreeView<
    RichTreeViewProPluginSignatures,
    typeof props
  >({
    plugins: RICH_TREE_VIEW_PRO_PLUGINS,
    rootRef: ref,
    props,
  });

  const { slots, slotProps } = props;
  const classes = useUtilityClasses(props);

  const Root = slots?.root ?? RichTreeViewProRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState: props as RichTreeViewProProps<any, any>,
  });

  return (
    <TreeViewProvider value={contextValue}>
      {contextValue.virtualization.enabled ? (
        <TreeViewVirtualScroller
          {...rootProps}
          slots={{ ...slots, root: Root }}
          slotProps={slotProps}
        />
      ) : (
        <Root {...rootProps} ref={ref}>
          <RichTreeViewItems
            slots={slots}
            slotProps={slotProps}
            itemsToRender={instance.getItemsToRender()}
          />
          <Watermark packageName="x-tree-view-pro" releaseInfo={releaseInfo} />
        </Root>
      )}
    </TreeViewProvider>
  );
}) as RichTreeViewProComponent;

export { RichTreeViewPro };
