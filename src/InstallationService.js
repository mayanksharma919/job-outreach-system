class InstallationService {

  static install() {

    AppLogger.info("===== Installing Job Outreach System =====");

    this.validateConfiguration();

    this.validateSheets();

    this.validateGmail();

    this.validateWorker();

    TriggerService.installScheduler();

    TriggerService.installWorker();

    WorkerStatusService.onWorkerIdle();

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

      CONSTANTS.SHEETS.CONFIG,

      CONSTANTS.SHEETS.WORKER_STATUS

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

  static validateWorker() {

    const sender =
      SenderSelector.getCurrentSender();

    if (!sender) {

      throw new Error(
        "Current sender not configured."
      );

    }

    if (sender.status !== "ACTIVE") {

      throw new Error(
        `Sender '${sender.email}' is not ACTIVE.`
      );

    }

    AppLogger.info(
      `Worker verified: ${sender.email}`
    );

  }

}