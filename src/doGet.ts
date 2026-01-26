type GetSuccessResponse = {
	result: "done";
	expired: boolean;
};

type GetErrorResponse = {
	result: "error";
	error: string;
};

type GetResponse = GetSuccessResponse | GetErrorResponse;

const COL_EXPIRED = 0;

function _doGet() {
	const e = { parameter: { type: "" } };
	const result = doGet(e as unknown as GoogleAppsScript.Events.DoGet);
	console.log(result.getContent());
}

function doGet(
	e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
	let response: GetResponse;

	try {
		const type = e.parameter.type;

		if (!type) {
			throw new Error("Invalid parameter.");
		}

		const properties = PropertiesService.getScriptProperties().getProperties();
		const configSheetId = properties.SPREADSHEET_ID_CONFIG;

		if (!configSheetId) {
			throw new Error("Invalid script properties.");
		}

		const config = getConfigEntry(configSheetId, type);

		response = {
			result: "done",
			expired: config[COL_EXPIRED] === true,
		};
	} catch (error) {
		response = { result: "error", error: error.message };
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
