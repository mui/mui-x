function ignore() {
  return null;
}

require.extensions['.css'] = ignore;
require.extensions['.scss'] = ignore;
