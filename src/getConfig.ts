type Config = {
	fileId: string;
	sheetName: string;
	fieldConfigs: {
		name: string;
		maxlength: number;
		required: boolean;
	}[];
};

function _getConfig(): void {
	const properties = PropertiesService.getScriptProperties().getProperties();
	const config = getConfig(properties.SPREADSHEET_ID_CONFIG, "", true);
	console.log(config);
}

function getConfig(
	fileId: string,
	type: string,
	configOnly = false,
): Config | unknown[] | undefined {
	const ss = SpreadsheetApp.openById(fileId);
	const configSheet = ss.getSheetByName("config");

	if (!configSheet) {
		throw new Error("Config sheet not found.");
	}

	const configList = configSheet.getDataRange().getValues();

	if (!configList) {
		throw new Error("Config not found.");
	}

	const config = configList.find((row) => !row[0] && row[1] === type);

	if (configOnly) {
		return config;
	}

	if (!config) {
		throw new Error("Config not found.");
	}

	const sheet = ss.getSheetByName(type);

	if (!sheet) {
		throw new Error("Sheet not found.");
	}

	const fieldConfigs = sheet.getDataRange().getValues();

	return {
		fileId: config[2].trim(),
		sheetName: config[3].trim(),
		fieldConfigs: fieldConfigs.slice(1).map((row) => ({
			name: row[0].trim(),
			maxlength: Number.parseInt(row[1], 10) || 0,
			required: Boolean(row[2]),
		})),
	};
}
