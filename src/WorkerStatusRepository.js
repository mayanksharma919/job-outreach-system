class WorkerStatusRepository {

  static getSheet() {

    return SpreadsheetService.getSheet(
      CONSTANTS.SHEETS.WORKER_STATUS
    );

  }

}