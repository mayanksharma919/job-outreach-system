class SystemRepository {

  static getSheet() {

    return SpreadsheetService.getSheet(
        CONSTANTS.SHEETS.SYSTEM
    );

    }

  static append(record) {

    const sheet = this.getSheet();

    if (sheet.getLastRow() === 0) {

        sheet.appendRow([
            "Timestamp",
            "Status",
            "Duration (ms)",
            "Applications Processed",
            "Emails Sent",
            "Replies Found",
            "Bounces Found",
            "Errors"
        ]);

    }

    sheet.appendRow([

        record.timestamp,

        record.status,

        record.duration,

        record.applicationsProcessed,

        record.emailsSent,

        record.repliesFound,

        record.bouncesFound,

        record.errors

    ]);

  }

  static getLatestRun() {

    const sheet = this.getSheet();

    const values = sheet.getDataRange().getValues();

    if (values.length <= 1) {
      return null;
    }

    const row = values[values.length - 1];

    return {

      timestamp: row[0],

      status: row[1],

      duration: row[2],

      applicationsProcessed: row[3],

      emailsSent: row[4],

      repliesFound: row[5],

      errors: row[6]

    };

  }

}