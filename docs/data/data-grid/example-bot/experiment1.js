import * as React from 'react';
import { Markprompt } from 'markprompt';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';

const MyPrompt = styled(Box)(
  `
    width:100%;
    border: 1px solid lightgray;
    border-radius:10px;
    overflow:hidden;
    min-height: 400px;
    padding:10px;

    input {
        font-size:1.5rem;
        width:100%;
        outline: none;
        border: 0px;
        border-bottom: 1px solid darkgray;
    }
  `,
);

export default function ExampleBot() {
  return (
    <MyPrompt>
      <Markprompt
        projectKey="ofZOVFDmWanOxAHGuXDkwoZGrIRYx2zJ"
        iDontKnowMessage="Sorry, I'm not trained in this content yet!"
        placeholder="I want an example for..."
      />
    </MyPrompt>
  );
}
