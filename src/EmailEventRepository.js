class EmailEventRepository {

  static getSheet() {

    return SpreadsheetService.getSheet(
      CONSTANTS.SHEETS.EMAIL_EVENTS
    );

  }

  static log(email, sender, event, type, details) {

    this.getSheet().appendRow([
      new Date(),
      email,
      sender,
      event,
      type,
      details
    ]);

  }

  static isSuppressed(email) {

    const values =
      this.getSheet().getDataRange().getValues();

    for (let i = values.length - 1; i >= 1; i--) {

      if (
        values[i][1] === email &&
        values[i][3] === "BOUNCE" &&
        values[i][4] === "HARD"
      ) {

        return true;

      }

    }

    return false;

  }

}