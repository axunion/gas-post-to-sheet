type PostResponse = {
	result: "done" | "error";
	error?: string;
};

function doPost(
	e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
	const response: PostResponse = { result: "done" };

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

		const checkResult = validateParameters({
			inputValues: parameter,
			acceptedRows: config.rows,
		});

		if (checkResult.errors.length > 0) {
			const error = checkResult.errors.join(", ");
			throw new Error(`Invalid Parameter: ${error}`);
		}

		const recaptchaResponse = verifyRecaptcha({ secret, token });

		if (!recaptchaResponse.success || recaptchaResponse.score < 0.5) {
			const score = recaptchaResponse.score || "-";
			const error = recaptchaResponse["error-codes"].join(" ");
			throw new Error(`reCAPTCHA verification failed. ${score} ${error}`);
		}

		const ss = SpreadsheetApp.openById(config.sheetId);
		const sheet = ss.getSheetByName(config.sheetName);

		if (!sheet) {
			throw new Error("Sheet not found.");
		}

		sheet.appendRow([date, ...checkResult.values]);
	} catch (error) {
		response.result = "error";
		response.error = error.message;
	}

	return ContentService.createTextOutput(JSON.stringify(response));
}
