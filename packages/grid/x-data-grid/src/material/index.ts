import { GridSlotsComponent } from '../models';
import { GridPagination } from './slots/GridPagination';

const components: Pick<GridSlotsComponent, 'Pagination'> = {
  Pagination: GridPagination,
};

export default components;
