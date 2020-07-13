[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/checkbox-renderer"](_src_components_checkbox_renderer_.md)

# Module: "src/components/checkbox-renderer"

## Index

### Variables

- [CellCheckboxRenderer](_src_components_checkbox_renderer_.md#const-cellcheckboxrenderer)
- [CheckboxInputContainer](_src_components_checkbox_renderer_.md#const-checkboxinputcontainer)
- [HeaderCheckbox](_src_components_checkbox_renderer_.md#const-headercheckbox)

## Variables

### `Const` CellCheckboxRenderer

• **CellCheckboxRenderer**: _React.FC‹[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)›_ = React.memo(({ api, rowModel, value }) => {
const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
api.selectRow(rowModel.id, checked, true);
};

return (
<CheckboxInputContainer>
<Checkbox
checked={!!value}
onChange={handleChange}
className={'checkbox-input'}
inputProps={{ 'aria-label': 'Select Row checkbox' }}
/>
</CheckboxInputContainer>
);
})

_Defined in [packages/grid/x-grid-modules/src/components/checkbox-renderer.tsx:48](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/checkbox-renderer.tsx#L48)_

---

### `Const` CheckboxInputContainer

• **CheckboxInputContainer**: _string & StyledComponentBase‹"div", any, object, never› & object_ = styled.div`display: flex; justify-content: center;`

_Defined in [packages/grid/x-grid-modules/src/components/checkbox-renderer.tsx:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/checkbox-renderer.tsx#L8)_

---

### `Const` HeaderCheckbox

• **HeaderCheckbox**: _React.FC‹[ColParams](../interfaces/_src_models_coldef_coldef_.colparams.md)›_ = React.memo(({ api, colDef, colIndex }) => {
const [isChecked, setChecked] = useState(false);
const [isIndeterminate, setIndeterminate] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
setChecked(checked);
api.selectRows(api.getAllRowIds(), checked);
};
const selectionChanged = useCallback(
(e: SelectionChangedParam) => {
const isAllSelected = api.getAllRowIds().length === e.rows.length && e.rows.length > 0;
const hasNoneSelected = e.rows.length === 0;
setChecked(isAllSelected || !hasNoneSelected);
const isIndeterminate = !isAllSelected && !hasNoneSelected;
setIndeterminate(isIndeterminate);
},
[api, setIndeterminate, setChecked],
);

useEffect(() => {
return api.onSelectionChanged(selectionChanged);
}, [api, selectionChanged]);
return (
<CheckboxInputContainer>
<Checkbox
indeterminate={isIndeterminate}
checked={isChecked}
onChange={handleChange}
className={'checkbox-input'}
inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
/>
</CheckboxInputContainer>
);
})

_Defined in [packages/grid/x-grid-modules/src/components/checkbox-renderer.tsx:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/checkbox-renderer.tsx#L13)_
