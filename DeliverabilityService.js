class DeliverabilityService {

  static canProcess(index) {

    const limit = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.DAILY_EMAIL_LIMIT
      )
    );

    return index < limit;

  }

  static randomDelay() {

    const min = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.RANDOM_DELAY_MIN
      )
    );

    const max = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.RANDOM_DELAY_MAX
      )
    );

    const seconds =
      Math.floor(Math.random() * (max - min + 1)) + min;

    return seconds;

  }

}