import { reactBenchmark } from '@mui/internal-benchmark/page';
import { eventCalendarDrag, eventTimelinePremium } from './scenarios';

// The scenarios with an interaction, too long for the smoke file. CI doesn't run them.
reactBenchmark(...eventCalendarDrag);
reactBenchmark(...eventTimelinePremium);
