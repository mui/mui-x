import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  height: 6,
  borderRadius: 3,
  width: isSelected ? 32 : 20,
  backgroundColor: isSelected ? '#B6BEC9' : '#CAD0D8',
  transition: 'width 0.3s, background-color 0.3s',
}));
export interface SelectChartProps {
  selected: number;
  setSelected: (newSelected: number) => void;
}

export default function SelectChart(props: SelectChartProps) {
  return (
    <Stack spacing={1} justifyContent="center" direction="row">
      <Item isSelected={props.selected === 0} onClick={() => props.setSelected(0)} />
      <Item isSelected={props.selected === 1} onClick={() => props.setSelected(1)} />
      <Item isSelected={props.selected === 2} onClick={() => props.setSelected(2)} />
      <Item isSelected={props.selected === 3} onClick={() => props.setSelected(3)} />
    </Stack>
  );
}
