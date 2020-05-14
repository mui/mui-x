import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import React, { useState } from 'react';
import { DummyContent } from './dummyContent';
import { Splitter } from '@material-ui-x/splitter';
import { AppBreadcrumbs } from '../../app-breadcrumbs';
import { Panel } from '@material-ui-x/panel';
import FormGroup from '@material-ui/core/FormGroup';
import { StyledPanels } from '../grid/components/styled-panel';

export const SplitterDemo: React.FC<{}> = () => {
  const [sizes, setSizes] = useState([30, 70]);
  const [minPanelSizes, setMinPanelSizes] = useState([100, 300]);
  const [invertHandler, setInvertHandler] = useState(true);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  const reverseSizes = (): void => setSizes([sizes[1], sizes[0]]);
  const toggleInvertHandler = (): void => setInvertHandler(!invertHandler);
  const changeDirection = (): void => setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal');

  return (
    <>
      <AppBreadcrumbs name={'Splitter'} />
      <StyledPanels>
        <Panel title={'Settings'}>
          <FormGroup row className={'center'}>
            <TextField
              className={'input-text'}
              label="Top Min Size"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={e => setMinPanelSizes([Number(e.target.value), minPanelSizes[1]])}
              value={minPanelSizes[0]}
            />
            <TextField
              className={'input-text'}
              label="Bottom Min Size"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={e => setMinPanelSizes([minPanelSizes[0], Number(e.target.value)])}
              value={minPanelSizes[1]}
            />
          </FormGroup>
          <div className={'action-button-bar'}>
            <Button size={'small'} onClick={changeDirection} variant={'outlined'} color={'primary'}>
              Change Direction
            </Button>
            <Button size={'small'} onClick={reverseSizes} variant={'outlined'} color={'primary'}>
              Reverse Sizes
            </Button>
            <Button size={'small'} onClick={toggleInvertHandler} variant={'outlined'} color={'primary'}>
              Invert Handler
            </Button>
          </div>
        </Panel>
      </StyledPanels>
      <div className={'main-container'}>
        <div className={'fill-space'}>
          <Splitter
            sizesInPercent={sizes}
            invertHandler={invertHandler}
            minPanelSizes={minPanelSizes}
            direction={direction}
            displayHandler={'show'}
          >
            <DummyContent />
            <DummyContent />
          </Splitter>
        </div>
      </div>
    </>
  );
};
