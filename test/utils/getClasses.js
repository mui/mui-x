import * as React from 'react';
import { shallow as enzymeShallow } from 'enzyme';

// TODO v5: remove this file

function shallowRecursively(wrapper, selector, { context, ...other }) {
  if (wrapper.isEmptyRender() || typeof wrapper.getElement().type === 'string') {
    return wrapper;
  }

  let newContext = context;

  const instance = wrapper.root().instance();
  // The instance can be null with a stateless functional component and react >= 16.
  if (instance && instance.getChildContext) {
    newContext = {
      ...context,
      ...instance.getChildContext(),
    };
  }

  const nextWrapper = wrapper.shallow({ context: newContext, ...other });

  if (selector && wrapper.is(selector)) {
    return nextWrapper;
  }

  return shallowRecursively(nextWrapper, selector, { context: newContext });
}

function until(selector, options = {}) {
  return this.single('until', () => shallowRecursively(this, selector, options));
}

/**
 * Generate an enhanced shallow function.
 * @param {Partial<ShallowOptions>} [options1]
 * @returns {typeof import('enzyme').shallow}
 */
function createShallow(options1 = {}) {
  const { shallow = enzymeShallow, dive = false, untilSelector = false, ...other1 } = options1;

  const shallowWithContext = function shallowWithContext(node, options2 = {}) {
    const options = {
      ...other1,
      ...options2,
      context: {
        ...other1.context,
        ...options2.context,
      },
    };

    const wrapper = shallow(node, options);

    if (dive) {
      return wrapper.dive();
    }

    if (untilSelector) {
      return until.call(wrapper, untilSelector, options);
    }

    return wrapper;
  };

  return shallowWithContext;
}

const shallow = createShallow();

/**
 * Extracts the available classes for the `classes` prop of the given component
 * @param {React.ReactElement} element - An element created from a Material-UI component that implements the `classes` prop.
 * @returns {Record<string, string>}
 */
export default function getClasses(element) {
  const { useStyles = () => null } = element.type;

  let classes;
  function Listener() {
    classes = useStyles(element.props);
    return null;
  }
  shallow(<Listener />);

  return classes;
}
