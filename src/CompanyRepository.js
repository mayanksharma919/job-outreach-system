class CompanyRepository {

  static getSheet() {

    return SpreadsheetApp
      .openById(CONSTANTS.SPREADSHEET_ID)
      .getSheetByName(CONSTANTS.SHEETS.COMPANIES);

  }

  static find(companyName) {

    const values =
      this.getSheet()
        .getDataRange()
        .getValues();

    for (let i = 1; i < values.length; i++) {

      if (values[i][0] === companyName) {

        return {

          rowNumber: i + 1,

          company: values[i][0],

          senderAccount: values[i][1],

          lastContact: values[i][2],

          recruiters: values[i][3],

          hiringManagers: values[i][4],

          notes: values[i][5]

        };

      }

    }

    return null;

  }

  static create(companyName, senderEmail) {

    this.getSheet().appendRow([

      companyName,

      senderEmail,

      new Date(),

      "",

      "",

      ""

    ]);

  }

  static exists(companyName) {

  return this.find(companyName) !== null;

}

}