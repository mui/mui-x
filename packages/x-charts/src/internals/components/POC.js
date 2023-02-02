import * as React from 'react';
import { Surface } from '../../Surface';

function POC() {
  return (
    <div>
      This is a POC
      <Surface width={50} height={50}>
        <circle cx={25} cy={25} r={26} fill="blue" />
        <circle cx={25} cy={25} r={25} fill="orange" />
        <circle cx={25} cy={25} r={5} fill="red" />
      </Surface>
    </div>
  );
}

export default POC;
