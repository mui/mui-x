import * as React from 'react';
import {
  TreeViewAnyPluginSignature,
  TreeViewPlugin,
  ConvertPluginsIntoSignatures,
  MergePluginsProperty,
} from '../models';

/**
 * Implements the same behavior as `useControlled` but for several models.
 * The controlled models are never stored in the state and the state is only updated if the model is not controlled.
 */
export const useTreeViewModels = <
  TPlugins extends readonly TreeViewPlugin<TreeViewAnyPluginSignature>[],
>(
  plugins: TPlugins,
  props: MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'defaultizedParams'>,
) => {
  const modelsRef = React.useRef<{
    [modelName: string]: {
      controlledProp: keyof typeof props;
      defaultProp: keyof typeof props;
      isControlled: boolean;
    };
  }>({});

  const [modelsState, setModelsState] = React.useState<{ [modelName: string]: any }>(() => {
    const initialState: { [modelName: string]: any } = {};

    plugins.forEach((plugin) => {
      if (plugin.models) {
        Object.entries(plugin.models).forEach(([modelName, model]) => {
          modelsRef.current[modelName] = {
            controlledProp: model.controlledProp as keyof typeof props,
            defaultProp: model.defaultProp as keyof typeof props,
            isControlled: props[model.controlledProp as keyof typeof props] !== undefined,
          };
          initialState[modelName] = props[model.defaultProp as keyof typeof props];
        });
      }
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
  ) as MergePluginsProperty<ConvertPluginsIntoSignatures<TPlugins>, 'models'>;

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

      const { current: defaultValue } = React.useRef(defaultProp);

      React.useEffect(() => {
        if (!model.isControlled && defaultValue !== defaultProp) {
          console.error(
            [
              `MUI X: A component is changing the default ${modelName} state of an uncontrolled TreeView after being initialized. ` +
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
