class DeliverabilityService {

  static canProcess(index) {

    const limit = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.DAILY_EMAIL_LIMIT
      )
    );

    return index < limit;

  }

  static sleepBetweenEmails() {

    const min = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MIN
      )
    );

    const max = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MAX
      )
    );

    const seconds =
      Math.floor(Math.random() * (max - min + 1)) + min;

    AppLogger.info(
      `Waiting ${seconds} seconds before next email.`
    );

    Utilities.sleep(seconds * 1000);

  }


  static sleepBeforeProcessing() {

    const min = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MIN
      )
    );

    const max = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MAX
      )
    );

    const seconds =
      Math.floor(Math.random() * (max - min + 1)) + min;

    AppLogger.info(
      `Waiting ${seconds} seconds before processing.`
    );

    Utilities.sleep(seconds * 1000);

  }


  static sleepBeforeProcessing() {

    const min = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MIN
      )
    );

    const max = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MAX
      )
    );

    const seconds =
      Math.floor(Math.random() * (max - min + 1)) + min;

    AppLogger.info(
      `Waiting ${seconds} seconds before starting processing.`
    );

    Utilities.sleep(seconds * 1000);

  }

}