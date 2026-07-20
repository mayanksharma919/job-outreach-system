function testConfig() {

  Logger.log(
    Config.get(
      CONSTANTS.CONFIG_KEYS.GEMINI_MODEL
    )
  );

  Logger.log(
    Config.get(
      CONSTANTS.CONFIG_KEYS.MODE
    )
  );

}