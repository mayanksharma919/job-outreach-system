class StartupValidationService {

  static validate() {

    this.validateSheets();

    this.validateConfig();

    this.validateSender();

    this.validateResume();

    this.validateGmail();

    this.validateGemini();

    AppLogger.info(
      "Startup validation completed successfully."
    );

  }

  static validateSheets() {

    const requiredSheets = [

      CONSTANTS.SHEETS.APPLICATIONS,

      CONSTANTS.SHEETS.SENDER_ACCOUNTS,

      CONSTANTS.SHEETS.CONFIG,

      CONSTANTS.SHEETS.COMPANIES,

      CONSTANTS.SHEETS.WORKER_STATUS,

      CONSTANTS.SHEETS.DASHBOARD,

      CONSTANTS.SHEETS.SYSTEM

    ];

    const spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();

    const existingSheets =
      spreadsheet
        .getSheets()
        .map(sheet => sheet.getName());

    requiredSheets.forEach(sheetName => {

      if (!existingSheets.includes(sheetName)) {

        throw new Error(
          `Missing required sheet: ${sheetName}`
        );

      }

    });

  }

  static validateConfig() {

    const requiredKeys = [

      CONSTANTS.CONFIG_KEYS.GEMINI_MODEL,

      CONSTANTS.CONFIG_KEYS.MODE,

      CONSTANTS.CONFIG_KEYS.MAX_RETRIES,

      CONSTANTS.CONFIG_KEYS.DAILY_EMAIL_LIMIT,

      CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MIN,

      CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MAX,

      CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MIN,

      CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MAX,

      CONSTANTS.CONFIG_KEYS.RESUME_FILE_ID,

      CONSTANTS.CONFIG_KEYS.GMAIL_LABEL,

      CONSTANTS.CONFIG_KEYS.SENDER_EMAIL

    ];

    requiredKeys.forEach(key => {

      const value = Config.get(key);

      if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
      ) {

        throw new Error(
          `Missing configuration: ${key}`
        );

      }

    });

    const mode = Config.get(
      CONSTANTS.CONFIG_KEYS.MODE
    );

    if (
      mode !== CONSTANTS.MODE.DRAFT &&
      mode !== CONSTANTS.MODE.AUTO_SEND
    ) {

      throw new Error(
        `Invalid MODE: ${mode}`
      );

    }

    [

      CONSTANTS.CONFIG_KEYS.MAX_RETRIES,

      CONSTANTS.CONFIG_KEYS.DAILY_EMAIL_LIMIT,

      CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MIN,

      CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MAX,

      CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MIN,

      CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MAX

    ].forEach(key => {

      const value = Number(
        Config.get(key)
      );

      if (isNaN(value)) {

        throw new Error(
          `${key} must be numeric.`
        );

      }

    });

  }

  static validateSender() {

    const sender =
      SenderSelector.getCurrentSender();

    if (!sender) {

      throw new Error(
        "Configured sender not found."
      );

    }

    if (sender.status !== "ACTIVE") {

      throw new Error(
        `Sender '${sender.email}' is not ACTIVE.`
      );

    }

    if (sender.dailyLimit <= 0) {

      throw new Error(
        `Sender '${sender.email}' has invalid daily limit.`
      );

    }

  }

  static validateResume() {

    const fileId = Config.get(
      CONSTANTS.CONFIG_KEYS.RESUME_FILE_ID
    );

    try {

      DriveApp.getFileById(fileId);

    }
    catch (error) {

      throw new Error(
        "Resume file cannot be accessed."
      );

    }

  }

  static validateGmail() {

    const labelName = Config.get(
      CONSTANTS.CONFIG_KEYS.GMAIL_LABEL
    );

    try {

      let label =
        GmailApp.getUserLabelByName(labelName);

      if (!label) {

        GmailApp.createLabel(labelName);

      }

    }
    catch (error) {

      throw new Error(
        `Unable to create/access Gmail label '${labelName}'.`
      );

    }

  }

  static validateGemini() {

    const model = Config.get(
      CONSTANTS.CONFIG_KEYS.GEMINI_MODEL
    );

    if (!model) {

      throw new Error(
        "Gemini model not configured."
      );

    }

  }

}