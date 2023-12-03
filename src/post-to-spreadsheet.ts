// eslint-disable-next-line @typescript-eslint/no-unused-vars
function doPost(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  try {
    const formData = e.parameter;
    const recaptcha = formData.recaptcha;

    if (!verifyRecaptcha(recaptcha)) {
      throw new Error("reCAPTCHA verification failed.");
    }

    const name = formData.name;
    const email = formData.email;
    const type = formData.type;

    if (!name || !email || !type || !recaptcha) {
      throw new Error(
        "Name, email, type, and recaptcha_response are required.",
      );
    }

    if (!config[type]) {
      throw new Error(`Invalid type: ${type}`);
    }

    const ID = config[type].SPREADSHEET_ID;
    const NAME = config[type].SHEET_NAME;
    const sheet = SpreadsheetApp.openById(ID).getSheetByName(NAME);

    if (!sheet) {
      throw new Error(`Sheet "${NAME}" not found.`);
    }

    const timestamp = new Date();

    sheet.appendRow([timestamp, name, email]);

    return ContentService.createTextOutput("Done");
  } catch (error) {
    Logger.log(`Error: ${error.message}`);
    return ContentService.createTextOutput(`Error: ${error.message}`);
  }
}
