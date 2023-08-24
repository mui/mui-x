import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import {
  TreeViewInstance,
  TreeViewPlugin,
  TreeViewState,
  TreeViewModel,
  TreeViewModels,
} from '../models';
import { useTreeViewNodes } from './useTreeViewNodes';
import { useTreeViewSelection } from './useTreeViewSelection';
import { useTreeViewFocus } from './useTreeViewFocus';
import { useTreeViewExpansion } from './useTreeViewExpansion';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import { TreeViewDefaultizedProps } from '../TreeView/TreeView.types';

const plugins: TreeViewPlugin[] = [
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
];

const useTreeViewModels = (props: TreeViewDefaultizedProps) => {
  const modelsRef = React.useRef<{
    [modelName: string]: Omit<TreeViewModel<any>, 'value' | 'setValue'>;
  }>({});

  const [modelsState, setModelsState] = React.useState<{ [modelName: string]: any }>(() => {
    const initialState: typeof modelsState = {};

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
  });

  const models = Object.fromEntries(
    Object.entries(modelsRef.current).map(([modelName, model]) => {
      const value = model.isControlled ? props[model.controlledProp] : modelsState[modelName];

      return [
        modelName,
        {
          ...model,
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
  ) as unknown as TreeViewModels;

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

export const useTreeView = (
  props: TreeViewDefaultizedProps,
  ref: React.Ref<HTMLUListElement> | undefined,
) => {
  const [state, setState] = React.useState<TreeViewState>(() =>
    plugins.reduce((prevState, plugin) => {
      if (plugin.getInitialState) {
        const response = plugin.getInitialState(props);
        Object.assign(prevState, response);
      }

      return prevState;
    }, {} as TreeViewState),
  );

  const models = useTreeViewModels(props);

  const instanceRef = React.useRef<TreeViewInstance>({ nodeMap: {} } as TreeViewInstance);
  const instance = instanceRef.current;
  const rootRef = React.useRef(null);
  const handleRootRef = useForkRef(rootRef, ref);

  const rootProps: React.HTMLAttributes<HTMLUListElement> & { ref: React.Ref<HTMLUListElement> } = {
    ref: handleRootRef,
  };

  const runPlugin = (plugin: TreeViewPlugin) => {
    const pluginResponse = plugin({ instance, props, state, setState, rootRef, models }) || {};

    if (pluginResponse.rootProps) {
      Object.assign(rootProps, pluginResponse.rootProps);
    }
  };

  plugins.forEach(runPlugin);

  runPlugin(useTreeViewNodes);
  runPlugin(useTreeViewExpansion);
  runPlugin(useTreeViewSelection);
  runPlugin(useTreeViewFocus);
  runPlugin(useTreeViewKeyboardNavigation);

  return { instance, state, rootProps, ref };
};
