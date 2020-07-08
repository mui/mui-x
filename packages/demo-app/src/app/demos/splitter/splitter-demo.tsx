import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import { Panel } from '@material-ui-x/panel';
import { Splitter } from '@material-ui-x/splitter';
import { DummyContent } from './dummyContent';
import { AppBreadcrumbs } from '../../app-breadcrumbs';
import { StyledPanels } from '../grid/components/styled-panel';

export const SplitterDemo: React.FC<{}> = () => {
  const [sizes, setSizes] = React.useState([30, 70]);
  const [minPanelSizes, setMinPanelSizes] = React.useState([100, 300]);
  const [invertHandler, setInvertHandler] = React.useState(true);
  const [direction, setDirection] = React.useState<'horizontal' | 'vertical'>('horizontal');

  const reverseSizes = (): void => setSizes([sizes[1], sizes[0]]);
  const toggleInvertHandler = (): void => setInvertHandler(!invertHandler);
  const changeDirection = (): void =>
    setDirection(direction === 'horizontal' ? 'vertical' : 'horizontal');

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
            <Button
              size={'small'}
              onClick={toggleInvertHandler}
              variant={'outlined'}
              color={'primary'}
            >
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
