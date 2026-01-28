type PostSuccessResponse = {
	result: "done";
};

type PostErrorResponse = {
	result: "error";
	error: string;
};

type PostResponse = PostSuccessResponse | PostErrorResponse;

function _doPost() {
	const e = { parameter: { type: "" } };
	const result = doPost(e as unknown as GoogleAppsScript.Events.DoPost);
	console.log(result.getContent());
}

function doPost(
	e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
	let response: PostResponse = { result: "done" };

	try {
		const date = new Date();
		const parameter = JSON.parse(e.postData.contents);
		const type = parameter.type;
		const token = parameter.recaptchaToken;

		if (!type || !token) {
			throw new Error("Invalid parameter.");
		}

		const properties = PropertiesService.getScriptProperties().getProperties();
		const secret = properties.RECAPTCHA_SECRET;
		const configSheetId = properties.SPREADSHEET_ID_CONFIG;

		if (!secret || !configSheetId) {
			throw new Error("Invalid script properties.");
		}

		const config = getConfig(configSheetId, type);

		const checkResult = _validateParameters({
			inputValues: parameter,
			acceptedRows: config.fieldConfigs,
		});

		if (checkResult.errors.length > 0) {
			const error = checkResult.errors.join(", ");
			throw new Error(`Invalid Parameter: ${error}`);
		}

		const recaptchaResponse = _verifyRecaptcha({ secret, token });

		if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
			const score = recaptchaResponse.score || "-";
			const error = recaptchaResponse["error-codes"]?.join(" ") ?? "";
			throw new Error(`reCAPTCHA verification failed. ${score} ${error}`);
		}

		const ss = SpreadsheetApp.openById(config.fileId);
		const sheet = ss.getSheetByName(config.sheetName);

		if (!sheet) {
			throw new Error("Sheet not found.");
		}

		sheet.appendRow([date, ...checkResult.values]);
	} catch (error) {
		response = { result: "error", error: error.message };
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
