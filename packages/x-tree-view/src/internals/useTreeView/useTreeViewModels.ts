import * as React from 'react';
import {
  TreeViewAnyPluginSignature,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
  TreeViewPlugin,
} from '../models';
import { TreeViewCorePluginSignatures } from '../corePlugins';

/**
 * Implements the same behavior as `useControlled` but for several models.
 * The controlled models are never stored in the state, and the state is only updated if the model is not controlled.
 */
export const useTreeViewModels = <TSignatures extends readonly TreeViewAnyPluginSignature[]>(
  plugins: ConvertSignaturesIntoPlugins<readonly [...TreeViewCorePluginSignatures, ...TSignatures]>,
  props: MergeSignaturesProperty<TSignatures, 'defaultizedParams'>,
) => {
  type DefaultizedParams = MergeSignaturesProperty<TSignatures, 'defaultizedParams'>;

  const modelsRef = React.useRef<{
    [modelName: string]: {
      getDefaultValue: (params: DefaultizedParams) => any;
      isControlled: boolean;
    };
  }>({});

  const [modelsState, setModelsState] = React.useState<{ [modelName: string]: any }>(() => {
    const initialState: { [modelName: string]: any } = {};

    plugins.forEach((plugin: TreeViewPlugin<TreeViewAnyPluginSignature>) => {
      if (plugin.models) {
        Object.entries(plugin.models).forEach(([modelName, modelInitializer]) => {
          modelsRef.current[modelName] = {
            isControlled: props[modelName as keyof DefaultizedParams] !== undefined,
            getDefaultValue: modelInitializer.getDefaultValue,
          };
          initialState[modelName] = modelInitializer.getDefaultValue(props);
        });
      }
    });

    return initialState;
  });

  const models = Object.fromEntries(
    Object.entries(modelsRef.current).map(([modelName, model]) => {
      const value = props[modelName as keyof DefaultizedParams] ?? modelsState[modelName];

      return [
        modelName,
        {
          value,
          setControlledValue: (newValue: any) => {
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
  ) as MergeSignaturesProperty<TSignatures, 'models'>;

  // We know that `modelsRef` do not vary across renders.
  /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  if (process.env.NODE_ENV !== 'production') {
    Object.entries(modelsRef.current).forEach(([modelName, model]) => {
      const controlled = props[modelName as keyof DefaultizedParams];
      const newDefaultValue = model.getDefaultValue(props);

      React.useEffect(() => {
        if (model.isControlled !== (controlled !== undefined)) {
          console.error(
            [
              `MUI X: A component is changing the ${
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

      const { current: defaultValue } = React.useRef(newDefaultValue);

      React.useEffect(() => {
        if (!model.isControlled && defaultValue !== newDefaultValue) {
          console.error(
            [
              `MUI X: A component is changing the default ${modelName} state of an uncontrolled TreeView after being initialized. ` +
                `To suppress this warning opt to use a controlled TreeView.`,
            ].join('\n'),
          );
        }
      }, [JSON.stringify(newDefaultValue)]);
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */

  return models;
};
