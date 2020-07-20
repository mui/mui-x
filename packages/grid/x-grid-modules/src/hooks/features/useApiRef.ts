import * as React from 'react';
import {ApiRef} from "../../models/api/apiRef";
import { GridApi } from '../../models/api/gridApi';

export const useApiRef = (): ApiRef => React.useRef<GridApi | null | undefined>();
