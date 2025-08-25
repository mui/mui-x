"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var Edit_1 = require("@mui/icons-material/Edit");
function GridActionsCellItemLabelTyping() {
    return (<React.Fragment>
      <x_data_grid_1.GridActionsCellItem label="test" icon={<Edit_1.default fontSize="small"/>}/>
      <x_data_grid_1.GridActionsCellItem showInMenu label={<div>test</div>} icon={<Edit_1.default fontSize="small"/>}/>
      {/* @ts-expect-error */}
      <x_data_grid_1.GridActionsCellItem label={<div>test</div>} icon={<Edit_1.default fontSize="small"/>}/>
    </React.Fragment>);
}
