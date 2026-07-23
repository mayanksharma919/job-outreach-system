class SpreadsheetService {

  static getSpreadsheet() {

    if (!this._spreadsheet) {

      this._spreadsheet =
        SpreadsheetApp.openById(
          CONSTANTS.SPREADSHEET_ID
        );

    }

    return this._spreadsheet;

  }

  static getSheet(sheetName) {

    const spreadsheet =
      this.getSpreadsheet();

    const sheet =
      spreadsheet.getSheetByName(sheetName);

    if (!sheet) {

      const availableSheets =
        spreadsheet
          .getSheets()
          .map(sheet => sheet.getName());

      AppLogger.error(
        `Sheet '${sheetName}' not found. Available sheets: ${availableSheets.join(", ")}`
      );

      throw new Error(
        `Sheet not found: ${sheetName}`
      );

    }

    return sheet;

  }

  static clearCache() {

    this._spreadsheet = null;

  }

}

