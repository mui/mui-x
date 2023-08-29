import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewInstance, TreeViewPlugin } from '../../models';
import { useTreeViewNodes } from './useTreeViewNodes';
import { useTreeViewSelection } from './useTreeViewSelection';
import { useTreeViewFocus } from './useTreeViewFocus';
import { useTreeViewExpansion } from './useTreeViewExpansion';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import { useTreeViewContextValueBuilder } from './useTreeViewContextValueBuilder';
import {
  UseTreeViewDefaultizedParameters,
  UseTreeViewParameters,
  UseTreeViewReturnValue,
  UseTreeViewRootSlotProps,
} from './useTreeView.types';
import { DEFAULT_TREE_VIEW_CONTEXT_VALUE } from '../TreeViewProvider/TreeViewContext';
import { useTreeViewModels } from './useTreeViewModels';
import { ConvertPluginsIntoSignatures, MergePluginsProperty } from '../models';
import { TreeViewContextValue } from '../TreeViewProvider';

const plugins = [
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewContextValueBuilder,
] as const;

export type DefaultPlugins = ConvertPluginsIntoSignatures<typeof plugins>;

const defaultDefaultExpanded: string[] = [];
const defaultDefaultSelected: string[] = [];

export const useTreeView = <Multiple extends boolean | undefined>(
  inProps: UseTreeViewParameters<Multiple>,
): UseTreeViewReturnValue<DefaultPlugins> => {
  type DefaultProps = UseTreeViewDefaultizedParameters<Multiple extends true ? true : false>;

  const props = {
    ...inProps,
    disabledItemsFocusable: inProps.disabledItemsFocusable ?? false,
    disableSelection: inProps.disableSelection ?? false,
    multiSelect: inProps.multiSelect ?? false,
    defaultExpanded: inProps.defaultExpanded ?? defaultDefaultExpanded,
    defaultSelected:
      inProps.defaultSelected ?? (inProps.multiSelect ? defaultDefaultSelected : null),
  } as DefaultProps;

  const models = useTreeViewModels(
    plugins,
    props as MergePluginsProperty<DefaultPlugins, 'defaultizedParams'>,
  );
  const instanceRef = React.useRef<TreeViewInstance<DefaultPlugins>>(
    {} as TreeViewInstance<DefaultPlugins>,
  );
  const instance = instanceRef.current;
  const innerRootRef = React.useRef(null);
  const handleRootRef = useForkRef(innerRootRef, inProps.rootRef);

  const [state, setState] = React.useState(() => {
    const temp = {} as MergePluginsProperty<DefaultPlugins, 'state'>;
    plugins.forEach((plugin) => {
      if (plugin.getInitialState) {
        Object.assign(temp, plugin.getInitialState(props as UseTreeViewDefaultizedParameters<any>));
      }
    });

    return temp;
  });

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];
  let contextValue: TreeViewContextValue<DefaultPlugins> = DEFAULT_TREE_VIEW_CONTEXT_VALUE;

  const runPlugin = (plugin: TreeViewPlugin<any>) => {
    const pluginResponse =
      plugin({ instance, props, state, setState, rootRef: innerRootRef, models }) || {};

    if (pluginResponse.getRootProps) {
      rootPropsGetters.push(pluginResponse.getRootProps);
    }

    if (pluginResponse.contextValue) {
      contextValue = pluginResponse.contextValue;
    }
  };

  plugins.forEach(runPlugin);

  const getRootProps = <TOther extends EventHandlers = {}>(
    otherHandlers: TOther = {} as TOther,
  ) => {
    const rootProps: UseTreeViewRootSlotProps = {
      role: 'tree',
      tabIndex: 0,
      ...otherHandlers,
      ref: handleRootRef,
    };

    rootPropsGetters.forEach((rootPropsGetter) => {
      Object.assign(rootProps, rootPropsGetter(otherHandlers));
    });

    return rootProps;
  };

  return { getRootProps, rootRef: handleRootRef, contextValue };
};
