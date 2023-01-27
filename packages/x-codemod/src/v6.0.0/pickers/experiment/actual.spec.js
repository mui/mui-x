import React from 'react';

const Button = (props) => {
  return (
    <button className="button" onClick={() => console.log('Hello, World!')}>
      <div onClick={() => {}}> // This line is unchanged Submit</div>
    </button>
  );
};
