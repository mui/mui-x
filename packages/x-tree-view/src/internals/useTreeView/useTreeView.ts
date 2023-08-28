import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { EventHandlers } from '@mui/base/utils';
import { TreeViewInstance, TreeViewPlugin, TreeViewState, TreeViewModels } from '../../models';
import { useTreeViewNodes } from './useTreeViewNodes';
import { useTreeViewSelection } from './useTreeViewSelection';
import { useTreeViewFocus } from './useTreeViewFocus';
import { useTreeViewExpansion } from './useTreeViewExpansion';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import { useTreeViewContext } from './useTreeViewContext';
import { UseTreeViewDefaultizedProps, UseTreeViewProps } from './useTreeView.types';
import { DEFAULT_TREE_VIEW_CONTEXT_VALUE } from '../TreeViewProvider/TreeViewContext';

const plugins: TreeViewPlugin<UseTreeViewDefaultizedProps<any>>[] = [
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewContext,
];

/**
 * Implements the same behavior as `useControlled` but for several models.
 * The controlled models are never stored in the state and the state is only updated if the model is not controlled.
 */
const useTreeViewModels = <Multiple extends boolean>(
  props: UseTreeViewDefaultizedProps<Multiple>,
) => {
  const modelsRef = React.useRef<{
    [modelName: string]: {
      controlledProp: keyof UseTreeViewDefaultizedProps<true>;
      defaultProp: keyof UseTreeViewDefaultizedProps<true>;
      isControlled: boolean;
    };
  }>({});

  const [modelsState, setModelsState] = React.useState<{ [modelName: string]: any }>(() => {
    const initialState: { [modelName: string]: any } = {};

    plugins.forEach((plugin) => {
      plugin.models?.forEach((model) => {
        modelsRef.current[model.name] = {
          controlledProp: model.controlledProp,
          defaultProp: model.defaultProp,
          isControlled: props[model.controlledProp] !== undefined,
        };
        initialState[model.name] = props[model.defaultProp];
      });
    });

    return initialState;
  });

  const models = Object.fromEntries(
    Object.entries(modelsRef.current).map(([modelName, model]) => {
      const value = model.isControlled ? props[model.controlledProp] : modelsState[modelName];

      return [
        modelName,
        {
          value,
          setValue: (newValue: any) => {
            if (!model.isControlled) {
              setModelsState((prevState) => ({
                ...prevState,
                [modelName]: newValue,
              }));
            }
          },
        },
      ];
    }),
  ) as unknown as TreeViewModels<Multiple>;

  // We know that `modelsRef` do not vary across renders.
  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  if (process.env.NODE_ENV !== 'production') {
    Object.entries(modelsRef.current).forEach(([modelName, model]) => {
      const controlled = props[model.controlledProp];
      const defaultProp = props[model.defaultProp];

      React.useEffect(() => {
        if (model.isControlled !== (controlled !== undefined)) {
          console.error(
            [
              `MUI: A component is changing the ${
                model.isControlled ? '' : 'un'
              }controlled ${modelName} state of TreeView to be ${
                model.isControlled ? 'un' : ''
              }controlled.`,
              'Elements should not switch from uncontrolled to controlled (or vice versa).',
              `Decide between using a controlled or uncontrolled ${modelName} ` +
                'element for the lifetime of the component.',
              "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
              'More info: https://fb.me/react-controlled-components',
            ].join('\n'),
          );
        }
      }, [controlled]);

      const { current: defaultValue } = React.useRef(defaultProp);

      React.useEffect(() => {
        if (!model.isControlled && defaultValue !== defaultProp) {
          console.error(
            [
              `MUI: A component is changing the default ${modelName} state of an uncontrolled TreeView after being initialized. ` +
                `To suppress this warning opt to use a controlled TreeView.`,
            ].join('\n'),
          );
        }
      }, [JSON.stringify(defaultValue)]);
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */

  return models;
};

const defaultDefaultExpanded: string[] = [];
const defaultDefaultSelected: string[] = [];

export const useTreeView = <Multiple extends boolean | undefined>(
  inProps: UseTreeViewProps<Multiple>,
) => {
  type DefaultProps = UseTreeViewDefaultizedProps<Multiple extends true ? true : false>;

  const props = {
    ...inProps,
    disabledItemsFocusable: inProps.disabledItemsFocusable ?? false,
    disableSelection: inProps.disableSelection ?? false,
    multiSelect: inProps.multiSelect ?? false,
    defaultExpanded: inProps.defaultExpanded ?? defaultDefaultExpanded,
    defaultSelected:
      inProps.defaultSelected ?? (inProps.multiSelect ? defaultDefaultSelected : null),
  } as DefaultProps;

  const [state, setState] = React.useState<TreeViewState>(() =>
    plugins.reduce((prevState, plugin) => {
      if (plugin.getInitialState) {
        const response = plugin.getInitialState(props as UseTreeViewDefaultizedProps<any>);
        Object.assign(prevState, response);
      }

      return prevState;
    }, {} as TreeViewState),
  );

  const models = useTreeViewModels(props);

  const instanceRef = React.useRef<TreeViewInstance>({ nodeMap: {} } as TreeViewInstance);
  const instance = instanceRef.current;
  const rootRef = React.useRef(null);
  const handleRootRef = useForkRef(rootRef, inProps.rootRef);

  const rootPropsGetters: (<TOther extends EventHandlers = {}>(
    otherHandlers: TOther,
  ) => React.HTMLAttributes<HTMLUListElement>)[] = [];
  let contextValue = DEFAULT_TREE_VIEW_CONTEXT_VALUE;

  const runPlugin = (plugin: TreeViewPlugin<any>) => {
    const pluginResponse = plugin({ instance, props, state, setState, rootRef, models }) || {};

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
    const rootProps: React.HTMLAttributes<HTMLUListElement> & { ref: React.Ref<HTMLUListElement> } =
      {
        ref: handleRootRef,
        role: 'tree',
        tabIndex: 0,
        ...otherHandlers,
      };

    rootPropsGetters.forEach((rootPropsGetter) => {
      Object.assign(rootProps, rootPropsGetter(otherHandlers));
    });

    return rootProps;
  };

  return { getRootProps, contextValue };
};
