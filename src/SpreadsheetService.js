class SpreadsheetService {

  static getSpreadsheet() {

    return SpreadsheetApp.openById(
      CONSTANTS.SPREADSHEET_ID
    );

  }

  static getSheet(sheetName) {

    const spreadsheet = this.getSpreadsheet();

    const availableSheets = spreadsheet
        .getSheets()
        .map(sheet => sheet.getName());

    Logger.log(
        "Available Sheets: " +
        availableSheets.join(", ")
    );

    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {

        throw new Error(
        `Sheet not found: ${sheetName}`
        );

    }

    return sheet;

    }

}