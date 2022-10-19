import * as React from 'react';

export default function PlaygroundExample() {
  return (
    <div>
      <p>A playground for a fast iteration development cycle.</p>
      <p>
        This page is accessible via{' '}
        <a href="http://localhost:3001/playground/example/">playground/example</a>
      </p>
      <p>
        You can create as many components here as you like and access them by changing{' '}
        <strong>example</strong> to whatever your other component is named.
      </p>
    </div>
  );
}
