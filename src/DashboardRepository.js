class DashboardRepository {

  static getSheet() {

    return SpreadsheetService.getSheet(
        CONSTANTS.SHEETS.DASHBOARD
    );

    }

  static write(rows) {

    const sheet = this.getSheet();

    sheet.clear();

    sheet
      .getRange(
        1,
        1,
        rows.length,
        2
      )
      .setValues(rows);

  }

}