import { reactBenchmark } from '@mui/internal-benchmark/page';
import { eventCalendarDrag, eventTimelinePremium } from './scenarios';

// Too long for the smoke file, so CI doesn't run them.
reactBenchmark(...eventCalendarDrag);
reactBenchmark(...eventTimelinePremium);
