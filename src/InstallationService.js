class InstallationService {

  static install() {

    AppLogger.info("===== Installing Job Outreach System =====");

    this.validateConfiguration();

    this.validateSheets();

    this.validateGmail();

    TriggerService.installScheduler();

    AppLogger.info("===== Installation Complete =====");

  }

  static validateConfiguration() {

    Config.load();

    AppLogger.info(
      "Configuration loaded successfully."
    );

  }

  static validateSheets() {

    const spreadsheet =
      SpreadsheetApp.openById(
        CONSTANTS.SPREADSHEET_ID
      );

    const requiredSheets = [

      CONSTANTS.SHEETS.APPLICATIONS,

      CONSTANTS.SHEETS.CONFIG

    ];

    for (const name of requiredSheets) {

      if (!spreadsheet.getSheetByName(name)) {

        throw new Error(
          `Missing sheet: ${name}`
        );

      }

    }

    AppLogger.info(
      "Required sheets verified."
    );

  }

  static validateGmail() {

    GmailApp.getInboxUnreadCount();

    AppLogger.info(
      "Gmail access verified."
    );

  }

}