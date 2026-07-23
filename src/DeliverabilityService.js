class DeliverabilityService {

  static canProcess(index) {

    const limit = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.DAILY_EMAIL_LIMIT
      )
    );

    return index < limit;

  }

  static sleepRandom(minKey, maxKey, message) {

    const min = Number(
      Config.get(minKey)
    );

    const max = Number(
      Config.get(maxKey)
    );

    const seconds =
      Math.floor(Math.random() * (max - min + 1)) + min;

    AppLogger.info(
      `${message} ${seconds} seconds.`
    );

    Utilities.sleep(seconds * 1000);

  }

  static sleepBetweenEmails() {

    this.sleepRandom(

      CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MIN,

      CONSTANTS.CONFIG_KEYS.EMAIL_DELAY_MAX,

      "Waiting before next email:"

    );

  }

  static sleepBeforeProcessing() {

    this.sleepRandom(

      CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MIN,

      CONSTANTS.CONFIG_KEYS.STARTUP_DELAY_MAX,

      "Waiting before processing:"

    );

  }

}