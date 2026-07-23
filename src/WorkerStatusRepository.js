class WorkerStatusRepository {

  static getSheet() {

    return SpreadsheetService.getSheet(
      CONSTANTS.SHEETS.WORKER_STATUS
    );

  }

  static findRow(senderEmail) {

    const sheet = this.getSheet();

    const values = sheet.getDataRange().getValues();

    const senderColumn =
      CONSTANTS.WORKER_STATUS_COLUMNS.SENDER - 1;

    for (let i = 1; i < values.length; i++) {

      if (values[i][senderColumn] === senderEmail) {

        return i + 1;

      }

    }

    return null;

  }

  static upsert(worker) {

    const sheet = this.getSheet();

    let row = this.findRow(worker.sender);

    if (!row) {

      row = sheet.getLastRow() + 1;

    }

    const columns =
      Object.keys(
        CONSTANTS.WORKER_STATUS_COLUMN_COUNT
      ).length;

    sheet.getRange(
      row,
      CONSTANTS.WORKER_STATUS_COLUMNS.SENDER,
      1,
      columns
    ).setValues([[
      worker.sender,
      worker.status,
      worker.lastHeartbeat,
      worker.currentCompany,
      worker.sentToday,
      worker.lastError,
      worker.lastActivity
    ]]);

  }

}