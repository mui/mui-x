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
    input {
        font-size:1.5rem;
        width:100%;
        border-bottom
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
