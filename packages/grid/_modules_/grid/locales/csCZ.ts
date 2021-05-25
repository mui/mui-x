import { csCZ as csCZCore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils';

const csCZKGrid: Partial<GridLocaleText> = {
	// Root
	rootGridLabel: 'mřížka',
	noRowsLabel: 'Žádné záznamy',
	noResultsOverlayLabel: 'Nenašli se žadné výsledky.',
	errorOverlayDefaultLabel: 'Stala sa nepředvídaná chyba.',

	// Density selector toolbar button text
	toolbarDensity: 'Hustota',
	toolbarDensityLabel: 'Hustota',
	toolbarDensityCompact: 'Kompaktní',
	toolbarDensityStandard: 'Standartní',
	toolbarDensityComfortable: 'Komfortní',

	// Columns selector toolbar button text
	toolbarColumns: 'Sloupce',
	toolbarColumnsLabel: 'Vybrat sloupec',

	// Filters toolbar button text
	toolbarFilters: 'Filtre',
	toolbarFiltersLabel: 'Zobrazit filtre',
	toolbarFiltersTooltipHide: 'Skrýt filtre ',
	toolbarFiltersTooltipShow: 'Zobrazit filtre',
	toolbarFiltersTooltipActive: count => {
		let pluralForm = 'aktivních filtrů';
		const lastDigit = count % 10;

		if (lastDigit > 1 && lastDigit < 5) {
			pluralForm = 'aktivní filtre';
		} else if (lastDigit === 1) {
			pluralForm = 'aktivní filtr';
		}

		return `${count} ${pluralForm}`;
	},

	// Export selector toolbar button text
	toolbarExport: 'Export',
	toolbarExportLabel: 'Export',
	toolbarExportCSV: 'Stáhnout jako CSV',

	// Columns panel text
	columnsPanelTextFieldLabel: 'Najít sloupec',
	columnsPanelTextFieldPlaceholder: 'Název sloupce',
	columnsPanelDragIconLabel: 'Uspořádat sloupce',
	columnsPanelShowAllButton: 'Zobrazit vše',
	columnsPanelHideAllButton: 'Skrýt vše',

	// Filter panel text
	filterPanelAddFilter: 'Přidat filter',
	filterPanelDeleteIconLabel: 'Odstranit',
	filterPanelOperators: 'Operatory',
	filterPanelOperatorAnd: 'A',
	filterPanelOperatorOr: 'Anebo',
	filterPanelColumns: 'Sloupce',
	filterPanelInputLabel: 'Hodnota',
	filterPanelInputPlaceholder: 'Hodnota filtra',

	// Filter operators text
	filterOperatorContains: 'obsahuje',
	filterOperatorEquals: 'rovná se',
	filterOperatorStartsWith: 'začíná s',
	filterOperatorEndsWith: 'končí na',
	filterOperatorIs: 'je',
	filterOperatorNot: 'není',
	filterOperatorAfter: 'je po',
	filterOperatorOnOrAfter: 'je na alebo po',
	filterOperatorBefore: 'je před',
	filterOperatorOnOrBefore: 'je na alebo dříve',

	// Filter values text
	filterValueAny: 'jakýkoliv',
	filterValueTrue: 'ano',
	filterValueFalse: 'ne',

	// Column menu text
	columnMenuLabel: 'Menu',
	columnMenuShowColumns: 'Zobrazit stloupce',
	columnMenuFilter: 'Filtr',
	columnMenuHideColumn: 'Skrýt',
	columnMenuUnsort: 'Zrušit filtre',
	columnMenuSortAsc: 'Seřadit vzostupně',
	columnMenuSortDesc: 'Seřadit zostupně',

	// Column header text
	columnHeaderFiltersTooltipActive: count => {
		let pluralForm = 'aktivních filtrů';
		const lastDigit = count % 10;

		if (lastDigit > 1 && lastDigit < 5) {
			pluralForm = 'aktivní filtre';
		} else if (lastDigit === 1) {
			pluralForm = 'aktivní filtr';
		}

		return `${count} ${pluralForm}`;
	},
	columnHeaderFiltersLabel: 'Zobrazit filtre',
	columnHeaderSortIconLabel: 'Filtrovat',

	// Rows selected footer text
	footerRowSelected: count => {
		let pluralForm = 'vybrané záznamy';
		const lastDigit = count % 10;

		if (lastDigit > 1 && lastDigit < 5) {
			pluralForm = 'vybraných záznamů';
		} else if (lastDigit === 1) {
			pluralForm = 'vybraný záznam';
		}

		return `${count} ${pluralForm}`;
	},

	// Total rows footer text
	footerTotalRows: 'Řádků spolu:',

	// Checkbox selection text
	checkboxSelectionHeaderName: 'Výběr řádku',

	// Boolean cell text
	booleanCellTrueLabel: 'ano',
	booleanCellFalseLabel: 'ne',
};

export const csCZ: Localization = getGridLocalization(csCZKGrid, csCZCore);
