class Config {

  static get(key) {

    if (!Config._cache) {

      Config.load();

    }

    if (!(key in Config._cache)) {

      throw new Error(`Missing configuration: ${key}`);

    }

    return Config._cache[key];

  }

  static load() {

    Config._cache = {};

    const sheet = SpreadsheetApp
      .openById(CONSTANTS.SPREADSHEET_ID)
      .getSheetByName(CONSTANTS.SHEETS.CONFIG);

    const values = sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {

      if (!values[i][0]) {

          continue;

      }

      const configValue = String(values[i][1]).trim();

      Config._cache[configKey] = configValue;

    }

    AppLogger.info(
      `Loaded ${Object.keys(Config._cache).length} configuration values.`
    );

  }

  static clearCache() {

    Config._cache = null;

  }

  static getGeminiApiKey() {

    const key = PropertiesService
      .getScriptProperties()
      .getProperty(CONSTANTS.CONFIG_KEYS.GEMINI_API_KEY);

    if (!key) {

      throw new Error(
        "GEMINI_API_KEY missing from Script Properties."
      );

    }

    return key;

  }

}

Config._cache = null;