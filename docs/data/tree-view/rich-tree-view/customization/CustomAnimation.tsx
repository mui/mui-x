import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useSpring, animated } from '@react-spring/web';
import { MUI_X_PRODUCTS } from '../../datasets/products';

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

export default function CustomAnimation() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView
        defaultExpandedItems={['grid']}
        slotProps={{ item: { slots: { groupTransition: TransitionComponent } } }}
        items={MUI_X_PRODUCTS}
      />
    </Box>
  );
}
